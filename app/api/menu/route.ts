import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { data: menuItems, error } = await supabase
      .from('daily_menu')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching menu:', error)
      return NextResponse.json(
        { error: 'Error al cargar el menú' },
        { status: 500 }
      )
    }

    // Transform data to match frontend interface
    const transformedItems = menuItems.map(item => ({
      id: parseInt(item.id.split('-')[0]) || Math.floor(Math.random() * 1000), // Temporary ID for compatibility
      name: item.name,
      description: item.description || '',
      price: Number(item.price),
      image: item.image_url,
      emoji: item.emoji || '🍽️',
      availability: item.availability,
      availablePortions: item.available_portions
    }))

    return NextResponse.json({
      success: true,
      menuItems: transformedItems
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
    const { name, description, price, emoji, availability, availablePortions } = body

    // Validate required fields
    if (!name || !price) {
      return NextResponse.json(
        { error: 'Nombre y precio son requeridos' },
        { status: 400 }
      )
    }

    const { data: newItem, error } = await supabaseAdmin
      .from('daily_menu')
      .insert({
        name,
        description,
        price: Number(price),
        emoji: emoji || '🍽️',
        availability: availability || 'available',
        available_portions: availablePortions || 10
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating menu item:', error)
      return NextResponse.json(
        { error: 'Error al crear el elemento del menú' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      menuItem: newItem,
      message: 'Elemento del menú creado exitosamente'
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 