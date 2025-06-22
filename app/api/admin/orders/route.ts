import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const date = searchParams.get('date')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        customer_profiles (name, phone, email, delivery_address)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    // Filter by status if provided
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Filter by date if provided
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      
      query = query
        .gte('created_at', startDate.toISOString())
        .lt('created_at', endDate.toISOString())
    }

    const { data: orders, error } = await query

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json(
        { error: 'Error al obtener las órdenes' },
        { status: 500 }
      )
    }

    // Calculate summary statistics
    const totalOrders = orders.length
    const totalRevenue = orders
      .filter(order => order.status !== 'cancelled')
      .reduce((sum, order) => sum + Number(order.total_amount), 0)

    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      success: true,
      orders,
      summary: {
        totalOrders,
        totalRevenue,
        statusCounts
      }
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, status, notes } = body

    // Validate required fields
    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'ID de orden y estado son requeridos' },
        { status: 400 }
      )
    }

    // Get current order
    const { data: currentOrder, error: fetchError } = await supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .single()

    if (fetchError || !currentOrder) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    // Update order status
    const updateData: any = { status }
    
    if (status === 'ready') {
      updateData.actual_ready_time = new Date().toISOString()
    }

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating order:', updateError)
      return NextResponse.json(
        { error: 'Error al actualizar la orden' },
        { status: 500 }
      )
    }

    // Add status history entry
    await supabase
      .from('order_status_history')
      .insert({
        order_id: orderId,
        old_status: currentOrder.status,
        new_status: status,
        changed_by: 'business_owner',
        notes: notes || `Estado cambiado a ${status} por el propietario`
      })

    // Send WhatsApp notification to customer
    if (updatedOrder.customer_phone) {
      await sendOrderStatusNotification(updatedOrder, status)
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: 'Estado de la orden actualizado exitosamente'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

async function sendOrderStatusNotification(order: any, newStatus: string) {
  try {
    let message = `🔔 *Actualización de tu Orden ${order.order_number}*\n\n`

    switch (newStatus) {
      case 'confirmed':
        message += `✅ *Tu orden ha sido confirmada*\n\n`
        message += `Tiempo estimado: 40-45 minutos\n`
        message += `Te notificaremos cuando esté lista.`
        break
      case 'preparing':
        message += `👨‍🍳 *Tu orden está siendo preparada*\n\n`
        message += `Nuestro chef está cocinando tu deliciosa comida.\n`
        message += `Tiempo estimado: 25-30 minutos`
        break
      case 'ready':
        message += `🍽️ *¡Tu orden está lista!*\n\n`
        if (order.service_type === 'pickup') {
          message += `📍 Puedes venir a recogerla ahora.\n`
          message += `Dirección: El Seibo, República Dominicana`
        } else {
          message += `🚚 Estamos preparando la entrega.\n`
          message += `Dirección: ${order.delivery_address}`
        }
        break
      case 'delivering':
        message += `🚚 *Tu orden está en camino*\n\n`
        message += `El repartidor está en camino a tu dirección.\n`
        message += `Tiempo estimado: 10-15 minutos`
        break
      case 'completed':
        message += `🎉 *¡Orden completada!*\n\n`
        message += `Gracias por elegir Wendy Cocina Gourmet.\n`
        message += `¡Esperamos verte pronto!`
        break
      case 'cancelled':
        message += `❌ *Tu orden ha sido cancelada*\n\n`
        message += `Si tienes preguntas, por favor contáctanos.`
        break
    }

    message += `\n\n📱 Ver detalles: ${process.env.NEXT_PUBLIC_APP_URL}`

    await sendWhatsAppMessage(order.customer_phone, message)

  } catch (error) {
    console.error('Error sending status notification:', error)
  }
}

async function sendWhatsAppMessage(to: string, message: string) {
  try {
    if (!process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
      console.log('WhatsApp not configured, skipping message')
      return
    }

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
          message_type: 'order_notification',
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