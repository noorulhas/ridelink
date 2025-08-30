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