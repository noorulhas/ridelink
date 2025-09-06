import React from 'react';
import { Ride } from '../types';
import { useAuth } from '../hooks/useAuth';
import { LocationMarkerIcon, FlagIcon, CalendarIcon, ClockIcon, UserGroupIcon, CurrencyDollarIcon, CarIcon, PhoneIcon, InformationCircleIcon } from './IconComponents';

interface RideCardProps {
  ride: Ride;
  onBookRide: (rideId: string) => void;
}

const RideCard: React.FC<RideCardProps> = ({ ride, onBookRide }) => {
  const { user } = useAuth();
  
  const formattedDate = new Date(ride.rideDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <LocationMarkerIcon className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-semibold text-gray-900">{ride.startLocation}</span>
            </div>
            <div className="flex items-center mb-4">
              <FlagIcon className="w-5 h-5 text-red-600 mr-2" />
              <span className="font-semibold text-gray-900">{ride.endLocation}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-600">${ride.price}</div>
            <div className="text-sm text-gray-500">per person</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700">{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700">{ride.departureTime}</span>
          </div>
          <div className="flex items-center">
            <UserGroupIcon className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700">{ride.availableSeats} seats</span>
          </div>
          <div className="flex items-center">
            <CarIcon className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700">{ride.vehicleType}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-semibold text-gray-700">
                  {ride.driverName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">{ride.driverName}</div>
                <div className="text-sm text-gray-500">Driver</div>
              </div>
            </div>
            <div className="flex items-center">
              <PhoneIcon className="w-4 h-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-700">{ride.driverPhone}</span>
            </div>
          </div>

          {ride.notes && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <InformationCircleIcon className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                <span className="text-sm text-blue-800">{ride.notes}</span>
              </div>
            </div>
          )}

          <button 
            onClick={() => onBookRide(ride.id)}
            disabled={ride.availableSeats === 0}
            className="w-full sm:w-auto px-6 py-3 font-bold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            title={!user ? "Sign in to book this ride" : ""}
          >
            {ride.availableSeats > 0 ? (user ? 'Book Now' : 'Sign In to Book') : 'Full'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideCard;