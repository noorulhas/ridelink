@@ .. @@
 import React from 'react';
 import { Ride } from '../types';
+import { useAuth } from '../hooks/useAuth';
 import { LocationMarkerIcon, FlagIcon, CalendarIcon, ClockIcon, UserGroupIcon, CurrencyDollarIcon, CarIcon, PhoneIcon, InformationCircleIcon } from './IconComponents';
 
 interface RideCardProps {
@@ .. @@
 }
 
 const RideCard: React.FC<RideCardProps> = ({ ride, onBookRide }) => {
+  const { user } = useAuth();
+  
   const formattedDate = new Date(ride.rideDate).toLocaleDateString('en-US', {
     month: 'short',
     day: 'numeric',
@@ .. @@
           <button 
             onClick={() => onBookRide(ride.id)}
             disabled={ride.availableSeats === 0}
-            className="w-full sm:w-auto px-6 py-3 font-bold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
+            className="w-full sm:w-auto px-6 py-3 font-bold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
+            title={!user ? "Sign in to book this ride" : ""}
           >
-            {ride.availableSeats > 0 ? 'Book Now' : 'Full'}
+            {ride.availableSeats > 0 ? (user ? 'Book Now' : 'Sign In to Book') : 'Full'}
           </button>
         </div>
       </div>