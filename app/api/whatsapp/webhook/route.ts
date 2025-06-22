import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  // WhatsApp webhook verification
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('WhatsApp webhook verified')
    return new Response(challenge, { status: 200 })
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Process WhatsApp webhook payload
    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            await processWhatsAppMessage(change.value)
          }
        }
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error processing WhatsApp webhook:', error)
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    )
  }
}

async function processWhatsAppMessage(messageData: any) {
  try {
    if (!messageData.messages) return

    for (const message of messageData.messages) {
      const from = message.from
      const messageText = message.text?.body || ''
      const messageType = message.type

      // Log the message
      await supabase
        .from('whatsapp_messages')
        .insert({
          recipient_phone: from,
          message_content: messageText,
          message_type: 'incoming',
          whatsapp_message_id: message.id
        })

      // Process different types of messages
      if (messageType === 'text') {
        await handleTextMessage(from, messageText, message.id)
      }
    }

  } catch (error) {
    console.error('Error processing WhatsApp message:', error)
  }
}

async function handleTextMessage(from: string, text: string, messageId: string) {
  const lowerText = text.toLowerCase().trim()

  try {
    // Check if it's a menu request
    if (lowerText.includes('menu') || lowerText.includes('menú') || lowerText.includes('comida')) {
      await sendMenuToWhatsApp(from)
      return
    }

    // Check if it's an order status request
    if (lowerText.includes('orden') || lowerText.includes('pedido') || lowerText.includes('estado')) {
      await sendOrderStatusHelp(from)
      return
    }

    // Default response
    await sendWelcomeMessage(from)

  } catch (error) {
    console.error('Error handling text message:', error)
  }
}

async function sendMenuToWhatsApp(to: string) {
  try {
    // Get today's menu
    const { data: menuItems } = await supabase
      .from('daily_menu')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (!menuItems || menuItems.length === 0) {
      await sendWhatsAppMessage(to, '🍽️ Lo siento, no tenemos menú disponible en este momento. Por favor intenta más tarde.')
      return
    }

    let menuMessage = '🍽️ *MENÚ DE HOY - Wendy Cocina Gourmet*\n👩‍🍳 *Preparado por Wendy*\n\n'
    
    menuItems.forEach((item, index) => {
      menuMessage += `${item.emoji || '🍽️'} *${item.name}*\n`
      menuMessage += `   ${item.description || 'Deliciosa comida casera'}\n`
      menuMessage += `   💰 RD$ ${item.price}\n`
      
      if (item.availability === 'limited') {
        menuMessage += `   ⚠️ Pocas porciones disponibles\n`
      } else if (item.availability === 'sold-out') {
        menuMessage += `   ❌ Agotado\n`
      }
      
      menuMessage += '\n'
    })

    menuMessage += '📱 Para hacer tu pedido, visita: ' + process.env.NEXT_PUBLIC_APP_URL
    menuMessage += '\n\n🚚 Servicio a domicilio: RD$ 50'
    menuMessage += '\n📍 Recogida en tienda: Gratis'

    await sendWhatsAppMessage(to, menuMessage)

  } catch (error) {
    console.error('Error sending menu:', error)
    await sendWhatsAppMessage(to, '❌ Error al obtener el menú. Por favor intenta más tarde.')
  }
}

async function sendOrderStatusHelp(to: string) {
  const message = `📋 *ESTADO DE TU ORDEN*\n\n` +
    `Para consultar el estado de tu pedido:\n\n` +
    `1️⃣ Visita: ${process.env.NEXT_PUBLIC_APP_URL}\n` +
    `2️⃣ Ingresa el número de tu orden\n` +
    `3️⃣ Ve el estado en tiempo real\n\n` +
    `🔄 Estados posibles:\n` +
    `📝 Recibida - Tu orden fue recibida\n` +
    `✅ Confirmada - Confirmamos tu orden\n` +
    `👨‍🍳 Preparando - El chef está cocinando\n` +
    `🍽️ Lista - Tu orden está lista\n\n` +
    `❓ ¿Necesitas ayuda? Responde a este mensaje.`

  await sendWhatsAppMessage(to, message)
}

async function sendWelcomeMessage(to: string) {
        const message = `¡Hola! 👋 Bienvenido a *Wendy Cocina Gourmet*\n👩‍🍳 *Soy Wendy, tu chef personal*\n\n` +
    `🍽️ Escribe "MENÚ" para ver nuestros platos del día\n` +
    `📋 Escribe "ORDEN" para consultar tu pedido\n` +
    `📱 Haz tu pedido en: ${process.env.NEXT_PUBLIC_APP_URL}\n\n` +
    `¡Estoy aquí para servirte con amor! 😊❤️`

  await sendWhatsAppMessage(to, message)
}

async function sendWhatsAppMessage(to: string, message: string) {
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: {
          body: message
        }
      })
    })

    const result = await response.json()
    
    if (response.ok) {
      // Log sent message
      await supabase
        .from('whatsapp_messages')
        .insert({
          recipient_phone: to,
          message_content: message,
          message_type: 'outgoing',
          whatsapp_message_id: result.messages?.[0]?.id,
          sent_at: new Date().toISOString()
        })
    } else {
      console.error('Error sending WhatsApp message:', result)
    }

  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
  }
} 