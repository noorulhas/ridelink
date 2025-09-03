import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      rides: {
        Row: {
          id: string
          driver_name: string
          car_model: string
          start_location: string
          destination: string
          ride_date: string
          ride_time: string
          price: number
          available_seats: number
          contact_detail: string
          remarks: string | null
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          driver_name: string
          car_model: string
          start_location: string
          destination: string
          ride_date: string
          ride_time: string
          price: number
          available_seats: number
          contact_detail: string
          remarks?: string | null
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          driver_name?: string
          car_model?: string
          start_location?: string
          destination?: string
          ride_date?: string
          ride_time?: string
          price?: number
          available_seats?: number
          contact_detail?: string
          remarks?: string | null
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}