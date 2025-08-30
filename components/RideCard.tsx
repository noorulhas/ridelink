import React from 'react';
import { Ride } from '../types';
import { LocationMarkerIcon, FlagIcon, CalendarIcon, ClockIcon, UserGroupIcon, CurrencyDollarIcon, CarIcon, PhoneIcon, InformationCircleIcon } from './IconComponents';

interface RideCardProps {
  ride: Ride;
  onBookRide: (rideId: string) => void;
}

const RideCard: React.FC<RideCardProps> = ({ ride, onBookRide }) => {
  const formattedDate = new Date(ride.rideDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out overflow-hidden">
      <div className="p-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <CarIcon className="w-6 h-6 text-gray-400" />
                <div>
                    <p className="font-bold text-lg text-gray-800">{ride.driverName}</p>
                    <p className="text-sm text-gray-500">{ride.carModel}</p>
                </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3 sm:mt-0">
            <UserGroupIcon className="w-6 h-6 text-blue-500" />
            <p className="text-lg font-semibold text-gray-700">
              {ride.availableSeats} seat{ride.availableSeats !== 1 ? 's' : ''} left
            </p>
          </div>
        </div>
        
        <div className="my-4 border-t border-gray-100"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-2 text-gray-600">
            <div className="flex items-center gap-2">
                <LocationMarkerIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div>
                    <p className="text-xs text-gray-500">From</p>
                    <p className="font-semibold text-gray-700">{ride.startLocation}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <FlagIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div>
                    <p className="text-xs text-gray-500">To</p>
                    <p className="font-semibold text-gray-700">{ride.destination}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-semibold text-gray-700">{formattedDate}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-semibold text-gray-700">{ride.rideTime}</p>
                </div>
            </div>
        </div>

        <div className="mt-4 pt-4 border-t border-dashed">
            <div className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span>Contact: <span className="font-semibold text-gray-700">{ride.contactDetail}</span></span>
            </div>
        </div>

        {ride.remarks && (
            <>
                <div className="my-4 border-t border-gray-100"></div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                    <InformationCircleIcon className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-gray-800">Driver's Remarks</h4>
                        <p className="text-sm text-gray-600">{ride.remarks}</p>
                    </div>
                </div>
            </>
        )}
        
        <div className="my-4 border-t border-gray-100"></div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
           <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <CurrencyDollarIcon className="w-7 h-7 text-yellow-500" />
            <p className="text-2xl font-bold text-gray-800">AED {ride.price.toFixed(2)}</p>
            <span className="text-sm text-gray-500 mt-1">/ seat</span>
          </div>
          <button 
            onClick={() => onBookRide(ride.id)}
            disabled={ride.availableSeats === 0}
            className="w-full sm:w-auto px-6 py-3 font-bold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            {ride.availableSeats > 0 ? 'Book Now' : 'Full'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideCard;