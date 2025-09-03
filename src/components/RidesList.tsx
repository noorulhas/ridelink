import React from 'react'
import { MapPin, Clock, DollarSign, Users, Phone, MessageSquare, Calendar } from 'lucide-react'
import type { Ride } from '../types'

interface RidesListProps {
  rides: Ride[]
  loading: boolean
  error: string | null
  onBookRide: (rideId: string) => Promise<void>
}

export function RidesList({ rides, loading, error, onBookRide }: RidesListProps) {
  const [bookingStates, setBookingStates] = React.useState<Record<string, boolean>>({})

  const handleBookRide = async (rideId: string) => {
    setBookingStates(prev => ({ ...prev, [rideId]: true }))
    try {
      await onBookRide(rideId)
    } catch (error) {
      console.error('Booking failed:', error)
    } finally {
      setBookingStates(prev => ({ ...prev, [rideId]: false }))
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-gray-600">Loading rides...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="text-red-600 mb-2">⚠️ Error loading rides</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (rides.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center text-gray-500">
          <Car className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No rides available</h3>
          <p>Be the first to post a ride!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {rides.map((ride) => (
        <div key={ride.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Car className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{ride.driverName}</h3>
                  <p className="text-sm text-gray-600">{ride.carModel}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="text-sm">From: {ride.startLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span className="text-sm">To: {ride.destination}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">{new Date(ride.rideDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">{ride.rideTime}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-600">${ride.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">{ride.availableSeats} seats available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-gray-600">{ride.contactDetail}</span>
                </div>
              </div>
              
              {ride.remarks && (
                <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
                  <p className="text-sm text-gray-600">{ride.remarks}</p>
                </div>
              )}
            </div>
            
            <div className="lg:ml-6">
              <button
                onClick={() => handleBookRide(ride.id)}
                disabled={ride.availableSeats === 0 || bookingStates[ride.id]}
                className="w-full lg:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {bookingStates[ride.id] ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Booking...
                  </>
                ) : ride.availableSeats === 0 ? (
                  'Fully Booked'
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    Book Ride
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}