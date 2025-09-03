import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Ride } from '../types';

interface DatabaseRide {
  id: string;
  driver_name: string;
  car_model: string;
  start_location: string;
  destination: string;
  ride_date: string;
  ride_time: string;
  price: number;
  available_seats: number;
  contact_detail: string;
  remarks: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export function useRides() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Convert database format to app format
  const convertDbRideToAppRide = (dbRide: DatabaseRide): Ride => ({
    id: dbRide.id,
    driverName: dbRide.driver_name,
    carModel: dbRide.car_model,
    startLocation: dbRide.start_location,
    destination: dbRide.destination,
    rideDate: dbRide.ride_date,
    rideTime: dbRide.ride_time,
    price: dbRide.price,
    availableSeats: dbRide.available_seats,
    contactDetail: dbRide.contact_detail,
    remarks: dbRide.remarks || '',
    userId: dbRide.user_id,
    createdAt: dbRide.created_at,
    updatedAt: dbRide.updated_at,
  });

  const fetchRides = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching rides from Supabase...');
      
      const { data, error: fetchError } = await supabase
        .from('rides')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Supabase fetch error:', fetchError);
        throw fetchError;
      }

      console.log('Raw data from Supabase:', data);
      
      const convertedRides = data ? data.map(convertDbRideToAppRide) : [];
      console.log('Converted rides:', convertedRides);
      
      setRides(convertedRides);
    } catch (err) {
      console.error('Error fetching rides:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch rides');
    } finally {
      setLoading(false);
    }
  };

  const addRide = async (rideData: Omit<Ride, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      
      if (!user) {
        throw new Error('You must be logged in to post a ride');
      }
      
      console.log('Adding ride to database:', rideData);
      
      const dbRideData = {
        driver_name: rideData.driverName,
        car_model: rideData.carModel,
        start_location: rideData.startLocation,
        destination: rideData.destination,
        ride_date: rideData.rideDate,
        ride_time: rideData.rideTime,
        price: rideData.price,
        available_seats: rideData.availableSeats,
        contact_detail: rideData.contactDetail,
        remarks: rideData.remarks || null,
        user_id: user.id
      };

      const { data, error: insertError } = await supabase
        .from('rides')
        .insert([dbRideData])
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      console.log('Successfully added ride:', data);
      
      // Refresh the rides list
      await fetchRides();
      
      return { success: true, data };
    } catch (err) {
      console.error('Error adding ride:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add ride';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const bookRide = async (rideId: string) => {
    try {
      setError(null);
      
      console.log('Booking ride:', rideId);
      
      // First check if the ride has available seats
      const { data: currentRide, error: fetchError } = await supabase
        .from('rides')
        .select('available_seats')
        .eq('id', rideId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (currentRide.available_seats <= 0) {
        throw new Error('No seats available for this ride');
      }

      const { data, error: updateError } = await supabase
        .from('rides')
        .update({ 
          available_seats: currentRide.available_seats - 1
        })
        .eq('id', rideId)
        .select()
        .single();

      if (updateError) {
        console.error('Booking error:', updateError);
        throw updateError;
      }

      console.log('Successfully booked ride:', data);
      
      // Refresh the rides list
      await fetchRides();
      
      return { success: true, data };
    } catch (err) {
      console.error('Error booking ride:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to book ride';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchRides();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('rides_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'rides' },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchRides(); // Refresh data when changes occur
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    rides,
    loading,
    error,
    addRide,
    bookRide,
    refetch: fetchRides
  };
}