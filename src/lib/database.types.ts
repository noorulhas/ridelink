export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
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
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}