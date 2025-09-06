@@ .. @@
 interface PassengerPortalProps {
   allRides: Ride[];
   onBookRide: (rideId: string) => void;
+  loading?: boolean;
 }

-const PassengerPortal: React.FC<PassengerPortalProps> = ({ allRides, onBookRide }) => {
+const PassengerPortal: React.FC<PassengerPortalProps> = ({ allRides, onBookRide, loading = false }) => {
   // State for the input fields
@@ .. @@
       <div>
         <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Available Rides ({ridesAvailable.length})</h3>
        
        {!user && ridesAvailable.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-800">Want to book a ride?</p>
                <p className="text-sm text-blue-700 mt-1">Sign in to contact drivers and book your seat. Click "Sign In" in the top right corner.</p>
              </div>
            </div>
          </div>
        )}
        
-        {ridesAvailable.length > 0 ? (
+        {loading ? (
+          <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
+            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
+            <p className="text-gray-500">Loading rides...</p>
+          </div>
+        ) : ridesAvailable.length > 0 ? (
           <div className="space-y-4">
             {ridesAvailable.map(ride => (
               <RideCard key={ride.id} ride={ride} onBookRide={onBookRide} />
@@ .. @@
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