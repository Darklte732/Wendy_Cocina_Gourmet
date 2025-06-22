import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }
    
    // Fetch order with items
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    // Fetch status history
    const { data: statusHistory } = await supabase
      .from('order_status_history')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true })

    // Calculate estimated time based on status
    let estimatedTime = 0
    switch (order.status) {
      case 'submitted':
        estimatedTime = 45
        break
      case 'confirmed':
        estimatedTime = 40
        break
      case 'preparing':
        estimatedTime = 25
        break
      case 'ready':
        estimatedTime = 0
        break
      default:
        estimatedTime = 30
    }
    
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerEmail: order.customer_email,
        serviceType: order.service_type,
        deliveryAddress: order.delivery_address,
        specialInstructions: order.special_instructions,
        totalAmount: order.total_amount,
        status: order.status,
        createdAt: order.created_at,
        estimatedTime,
        items: order.order_items,
        statusHistory: statusHistory || []
      }
    })
    
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Error al obtener la orden' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()
    
    // Validate required fields
    if (!orderData.customerName || !orderData.customerPhone || !orderData.items || !orderData.totalAmount) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Create customer profile or update existing one
    const { data: existingCustomer } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('phone', orderData.customerPhone)
      .single()

    if (existingCustomer) {
      // Update existing customer
      await supabase
        .from('customer_profiles')
        .update({
          name: orderData.customerName,
          email: orderData.customerEmail,
          delivery_address: orderData.deliveryAddress,
          preferred_service: orderData.serviceType,
          total_orders: existingCustomer.total_orders + 1,
          last_order_date: new Date().toISOString().split('T')[0]
        })
        .eq('phone', orderData.customerPhone)
    } else {
      // Create new customer profile
      await supabase
        .from('customer_profiles')
        .insert({
          phone: orderData.customerPhone,
          name: orderData.customerName,
          email: orderData.customerEmail,
          delivery_address: orderData.deliveryAddress,
          preferred_service: orderData.serviceType,
          total_orders: 1,
          last_order_date: new Date().toISOString().split('T')[0]
        })
    }
    
    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        customer_email: orderData.customerEmail,
        service_type: orderData.serviceType,
        delivery_address: orderData.deliveryAddress,
        special_instructions: orderData.specialInstructions,
        total_amount: Number(orderData.totalAmount),
        status: 'submitted',
        estimated_ready_time: new Date(Date.now() + 45 * 60 * 1000).toISOString() // 45 minutes from now
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json(
        { error: 'Error al crear la orden' },
        { status: 500 }
      )
    }

    // Create order items
    const orderItems = orderData.items.map((item: any) => ({
      order_id: order.id,
      menu_item_name: item.name,
      quantity: item.quantity,
      unit_price: Number(item.price),
      total_price: Number(item.price) * item.quantity
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      // Clean up the order if items creation failed
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json(
        { error: 'Error al crear los elementos de la orden' },
        { status: 500 }
      )
    }

    // Create initial status history entry
    await supabase
      .from('order_status_history')
      .insert({
        order_id: order.id,
        old_status: null,
        new_status: 'submitted',
        changed_by: 'system',
        notes: 'Orden recibida y procesada'
      })

    // Simulate order processing with status updates
    setTimeout(async () => {
      await updateOrderStatus(order.id, 'confirmed', 'Orden confirmada por el restaurante')
    }, 2000)
    
    setTimeout(async () => {
      await updateOrderStatus(order.id, 'preparing', 'El chef está preparando tu orden')
    }, 5000)
    
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        ...orderData,
        status: 'submitted',
        createdAt: order.created_at,
        estimatedTime: 45
      },
      message: 'Pedido recibido exitosamente'
    })
    
  } catch (error) {
    console.error('Error processing order:', error)
    return NextResponse.json(
      { error: 'Error al procesar la orden' },
      { status: 500 }
    )
  }
}

// Helper function to update order status
async function updateOrderStatus(orderId: string, newStatus: string, notes?: string) {
  try {
    // Get current order
    const { data: currentOrder } = await supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .single()

    if (!currentOrder) return

    // Update order status
    await supabase
      .from('orders')
      .update({ 
        status: newStatus,
        estimated_ready_time: newStatus === 'ready' ? new Date().toISOString() : undefined,
        actual_ready_time: newStatus === 'ready' ? new Date().toISOString() : undefined
      })
      .eq('id', orderId)

    // Add status history entry
    await supabase
      .from('order_status_history')
      .insert({
        order_id: orderId,
        old_status: currentOrder.status,
        new_status: newStatus,
        changed_by: 'system',
        notes: notes || `Estado cambiado a ${newStatus}`
      })

  } catch (error) {
    console.error('Error updating order status:', error)
  }
} 