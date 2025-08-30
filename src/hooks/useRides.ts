import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Ride } from '../types';

export const useRides = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedRides: Ride[] = data.map(ride => ({
        id: ride.id,
        driverName: ride.driver_name,
        carModel: ride.car_model,
        startLocation: ride.start_location,
        destination: ride.destination,
        rideDate: ride.ride_date,
        rideTime: ride.ride_time,
        price: ride.price,
        availableSeats: ride.available_seats,
        contactDetail: ride.contact_detail,
        remarks: ride.remarks || undefined,
      }));

      setRides(formattedRides);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addRide = async (rideData: Omit<Ride, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to post a ride');
      }

      const { data, error } = await supabase
        .from('rides')
        .insert({
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
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Add the new ride to local state
      const newRide: Ride = {
        id: data.id,
        driverName: data.driver_name,
        carModel: data.car_model,
        startLocation: data.start_location,
        destination: data.destination,
        rideDate: data.ride_date,
        rideTime: data.ride_time,
        price: data.price,
        availableSeats: data.available_seats,
        contactDetail: data.contact_detail,
        remarks: data.remarks || undefined,
      };

      setRides(prev => [newRide, ...prev]);
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add ride');
      return { success: false, error: err instanceof Error ? err.message : 'Failed to add ride' };
    }
  };

  const bookRide = async (rideId: string) => {
    try {
      const ride = rides.find(r => r.id === rideId);
      if (!ride || ride.availableSeats <= 0) {
        throw new Error('Ride not available');
      }

      const { error } = await supabase
        .from('rides')
        .update({ available_seats: ride.availableSeats - 1 })
        .eq('id', rideId);

      if (error) throw error;

      // Update local state
      setRides(prev => 
        prev.map(r => 
          r.id === rideId 
            ? { ...r, availableSeats: r.availableSeats - 1 }
            : r
        )
      );

      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book ride');
      return { success: false, error: err instanceof Error ? err.message : 'Failed to book ride' };
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  return {
    rides,
    loading,
    error,
    addRide,
    bookRide,
    refetch: fetchRides,
  };
};