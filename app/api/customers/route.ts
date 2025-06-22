import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')
    
    if (!phone) {
      return NextResponse.json(
        { error: 'Número de teléfono requerido' },
        { status: 400 }
      )
    }
    
    const { data: customer, error } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('phone', phone)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching customer:', error)
      return NextResponse.json(
        { error: 'Error al obtener el perfil del cliente' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      customer: customer || null
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, name, email, deliveryAddress, preferredService } = body

    // Validate required fields
    if (!phone || !name) {
      return NextResponse.json(
        { error: 'Teléfono y nombre son requeridos' },
        { status: 400 }
      )
    }

    const { data: customer, error } = await supabase
      .from('customer_profiles')
      .insert({
        phone,
        name,
        email,
        delivery_address: deliveryAddress,
        preferred_service: preferredService || 'pickup'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating customer:', error)
      return NextResponse.json(
        { error: 'Error al crear el perfil del cliente' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      customer,
      message: 'Perfil del cliente creado exitosamente'
    }, { status: 201 })

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
    const { phone, name, email, deliveryAddress, preferredService } = body

    // Validate required fields
    if (!phone) {
      return NextResponse.json(
        { error: 'Número de teléfono requerido' },
        { status: 400 }
      )
    }

    const { data: customer, error } = await supabase
      .from('customer_profiles')
      .update({
        name,
        email,
        delivery_address: deliveryAddress,
        preferred_service: preferredService
      })
      .eq('phone', phone)
      .select()
      .single()

    if (error) {
      console.error('Error updating customer:', error)
      return NextResponse.json(
        { error: 'Error al actualizar el perfil del cliente' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      customer,
      message: 'Perfil del cliente actualizado exitosamente'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 