import React, { useState, useMemo } from 'react';
import { Ride } from '../types';
import RideCard from './RideCard';
import { CITIES } from '../constants';
import { SearchIcon, XCircleIcon } from './IconComponents';

interface PassengerPortalProps {
  allRides: Ride[];
  onBookRide: (rideId: string) => void;
}

const PassengerPortal: React.FC<PassengerPortalProps> = ({ allRides, onBookRide }) => {
  // State for the input fields
  const [startQuery, setStartQuery] = useState('');
  const [customStartQuery, setCustomStartQuery] = useState('');
  const [destQuery, setDestQuery] = useState('');
  const [customDestQuery, setCustomDestQuery] = useState('');
  const [dateQuery, setDateQuery] = useState('');

  // State for the filters that are actually applied on search
  const [activeFilters, setActiveFilters] = useState({
    start: '',
    customStart: '',
    dest: '',
    customDest: '',
    date: '',
  });
  
  const handleSearch = () => {
    setActiveFilters({
      start: startQuery,
      customStart: customStartQuery,
      dest: destQuery,
      customDest: customDestQuery,
      date: dateQuery,
    });
  };

  const handleClearFilters = () => {
    setStartQuery('');
    setCustomStartQuery('');
    setDestQuery('');
    setCustomDestQuery('');
    setDateQuery('');
    setActiveFilters({
      start: '',
      customStart: '',
      dest: '',
      customDest: '',
      date: '',
    });
  };

  const filteredRides = useMemo(() => {
    // On initial load (when activeFilters are empty), show all rides.
    // Otherwise, filter based on the active search criteria.
    const hasActiveFilters = Object.values(activeFilters).some(val => val !== '');
    if (!hasActiveFilters) {
        return allRides;
    }

    return allRides.filter(ride => {
      let startMatch = true;
      if (activeFilters.start) {
        if (activeFilters.start === 'Other') {
          startMatch = activeFilters.customStart ? ride.startLocation.toLowerCase().includes(activeFilters.customStart.toLowerCase()) : true;
        } else {
          startMatch = ride.startLocation === activeFilters.start;
        }
      }

      let destMatch = true;
      if (activeFilters.dest) {
        if (activeFilters.dest === 'Other') {
          destMatch = activeFilters.customDest ? ride.destination.toLowerCase().includes(activeFilters.customDest.toLowerCase()) : true;
        } else {
          destMatch = ride.destination === activeFilters.dest;
        }
      }

      const dateMatch = activeFilters.date ? ride.rideDate === activeFilters.date : true;

      return startMatch && destMatch && dateMatch;
    });
  }, [activeFilters, allRides]);
  
  const ridesAvailable = filteredRides.filter(ride => ride.availableSeats > 0);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Find Your Ride</h2>
      <p className="text-gray-600 mb-6">Search for available rides based on your starting point, destination, and date.</p>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select value={startQuery} onChange={(e) => setStartQuery(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
              <option value="">Any Starting Location</option>
              {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
              <option value="Other">Other</option>
          </select>
          
          <select value={destQuery} onChange={(e) => setDestQuery(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
              <option value="">Any Destination</option>
              {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
              <option value="Other">Other</option>
          </select>

          {startQuery === 'Other' && (
              <div className="relative sm:col-span-1">
                  <input type="text" placeholder="Custom starting area..." value={customStartQuery} onChange={(e) => setCustomStartQuery(e.target.value)} className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="h-5 w-5 text-gray-400" /></div>
              </div>
          )}
          {destQuery === 'Other' && (
              <div className="relative sm:col-span-1">
                  <input type="text" placeholder="Custom destination..." value={customDestQuery} onChange={(e) => setCustomDestQuery(e.target.value)} className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="h-5 w-5 text-gray-400" /></div>
              </div>
          )}
        </div>
        <div>
          <input type="date" value={dateQuery} onChange={(e) => setDateQuery(e.target.value)} className="w-full sm:w-1/2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
        </div>
        <div className="flex flex-col sm:flex-row justify-end pt-2 gap-2">
            <button 
              onClick={handleClearFilters}
              className="w-full sm:w-auto bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-md hover:bg-gray-300 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 flex items-center justify-center gap-2"
            >
              <XCircleIcon className="h-5 w-5" />
              <span>Clear Filters</span>
            </button>
            <button 
              onClick={handleSearch}
              className="w-full sm:w-auto bg-yellow-500 text-white font-bold py-3 px-6 rounded-md hover:bg-yellow-600 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 flex items-center justify-center gap-2"
            >
              <SearchIcon className="h-5 w-5" />
              <span>Search Rides</span>
            </button>
        </div>
      </div>


      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Available Rides ({ridesAvailable.length})</h3>
        {ridesAvailable.length > 0 ? (
          <div className="space-y-4">
            {ridesAvailable.map(ride => (
              <RideCard key={ride.id} ride={ride} onBookRide={onBookRide} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No rides found matching your criteria. Try a different search!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengerPortal;