import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role (for admin operations)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Database types
export interface Database {
  public: {
    Tables: {
      daily_menu: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          emoji: string | null
          availability: 'available' | 'limited' | 'sold-out'
          available_portions: number
          date_added: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          emoji?: string | null
          availability?: 'available' | 'limited' | 'sold-out'
          available_portions?: number
          date_added?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          emoji?: string | null
          availability?: 'available' | 'limited' | 'sold-out'
          available_portions?: number
          date_added?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_name: string
          customer_phone: string
          customer_email: string | null
          service_type: 'pickup' | 'delivery'
          delivery_address: string | null
          special_instructions: string | null
          total_amount: number
          status: 'submitted' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled'
          whatsapp_thread_id: string | null
          estimated_ready_time: string | null
          actual_ready_time: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: string
          customer_name: string
          customer_phone: string
          customer_email?: string | null
          service_type: 'pickup' | 'delivery'
          delivery_address?: string | null
          special_instructions?: string | null
          total_amount: number
          status?: 'submitted' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled'
          whatsapp_thread_id?: string | null
          estimated_ready_time?: string | null
          actual_ready_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_name?: string
          customer_phone?: string
          customer_email?: string | null
          service_type?: 'pickup' | 'delivery'
          delivery_address?: string | null
          special_instructions?: string | null
          total_amount?: number
          status?: 'submitted' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled'
          whatsapp_thread_id?: string | null
          estimated_ready_time?: string | null
          actual_ready_time?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          menu_item_id: string | null
          menu_item_name: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          menu_item_id?: string | null
          menu_item_name: string
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          menu_item_id?: string | null
          menu_item_name?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      customer_profiles: {
        Row: {
          id: string
          phone: string
          name: string
          email: string | null
          delivery_address: string | null
          preferred_service: 'pickup' | 'delivery'
          total_orders: number
          favorite_items: any[]
          last_order_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          phone: string
          name: string
          email?: string | null
          delivery_address?: string | null
          preferred_service?: 'pickup' | 'delivery'
          total_orders?: number
          favorite_items?: any[]
          last_order_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone?: string
          name?: string
          email?: string | null
          delivery_address?: string | null
          preferred_service?: 'pickup' | 'delivery'
          total_orders?: number
          favorite_items?: any[]
          last_order_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_status_history: {
        Row: {
          id: string
          order_id: string
          old_status: string | null
          new_status: string
          changed_by: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          old_status?: string | null
          new_status: string
          changed_by?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          old_status?: string | null
          new_status?: string
          changed_by?: string
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
} 