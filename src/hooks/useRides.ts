import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Ride } from '../types'

export function useRides() {
  const [rides, setRides] = useState<Ride[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRides = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: fetchError } = await supabase
        .from('rides')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('Supabase error:', fetchError)
        throw fetchError
      }

      console.log('Fetched rides from database:', data)
      setRides(data || [])
    } catch (err) {
      console.error('Error fetching rides:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch rides')
    } finally {
      setLoading(false)
    }
  }

  const addRide = async (rideData: Omit<Ride, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null)
      
      console.log('Adding ride to database:', rideData)
      
      const { data, error: insertError } = await supabase
        .from('rides')
        .insert([{
          driver_name: rideData.driverName,
          car_model: rideData.carModel,
          start_location: rideData.startLocation,
          destination: rideData.destination,
          ride_date: rideData.rideDate,
          ride_time: rideData.rideTime,
          price: rideData.price,
          available_seats: rideData.availableSeats,
          contact_detail: rideData.contactDetail,
          remarks: rideData.remarks || null
        }])
        .select()
        .single()

      if (insertError) {
        console.error('Insert error:', insertError)
        throw insertError
      }

      console.log('Successfully added ride:', data)
      
      // Refresh the rides list
      await fetchRides()
      
      return data
    } catch (err) {
      console.error('Error adding ride:', err)
      setError(err instanceof Error ? err.message : 'Failed to add ride')
      throw err
    }
  }

  const bookRide = async (rideId: string) => {
    try {
      setError(null)
      
      const { data, error: updateError } = await supabase
        .from('rides')
        .update({ 
          available_seats: supabase.sql`available_seats - 1` 
        })
        .eq('id', rideId)
        .gt('available_seats', 0)
        .select()
        .single()

      if (updateError) {
        console.error('Booking error:', updateError)
        throw updateError
      }

      // Refresh the rides list
      await fetchRides()
      
      return data
    } catch (err) {
      console.error('Error booking ride:', err)
      setError(err instanceof Error ? err.message : 'Failed to book ride')
      throw err
    }
  }

  useEffect(() => {
    fetchRides()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('rides_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'rides' },
        (payload) => {
          console.log('Real-time update:', payload)
          fetchRides() // Refresh data when changes occur
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    rides,
    loading,
    error,
    addRide,
    bookRide,
    refetch: fetchRides
  }
}