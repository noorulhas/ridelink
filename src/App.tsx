@@ .. @@
 import React, { useState } from 'react';
-import { UserRole, Ride } from './types';
+import { UserRole } from './types';
 import Header from './components/Header';
 import Tabs from './components/Tabs';
 import DriverPortal from './components/DriverPortal';
 import PassengerPortal from './components/PassengerPortal';
+import AuthModal from './components/AuthModal';
+import { useAuth } from './hooks/useAuth';
+import { useRides } from './hooks/useRides';

-// Initial mock data for demonstration
-const initialRides: Ride[] = [
-  {
-    id: '1',
-    driverName: 'John Doe',
-    carModel: 'Toyota Camry',
-    startLocation: 'Dubai',
-    destination: 'Abu Dhabi',
-    rideDate: '2024-08-15',
-    rideTime: '10:00',
-    price: 25,
-    availableSeats: 3,
-    contactDetail: '555-123-4567',
-    remarks: 'Max 2 small bags per person. No pets allowed.',
-  },
-  {
-    id: '2',
-    driverName: 'Jane Smith',
-    carModel: 'Honda Civic',
-    startLocation: 'Sharjah',
-    destination: 'Dubai',
-    rideDate: '2024-08-15',
-    rideTime: '12:30',
-    price: 15,
-    availableSeats: 2,
-    contactDetail: '555-987-6543',
-    remarks: 'Pickup from Central Mall.',
-  },
-    {
-    id: '3',
-    driverName: 'Sam Wilson',
-    carModel: 'Tesla Model 3',
-    startLocation: 'Abu Dhabi',
-    destination: 'Rasalkhaima',
-    rideDate: '2024-08-16',
-    rideTime: '18:00',
-    price: 20,
-    availableSeats: 1,
-    contactDetail: '555-456-7890',
-  },
-];
-
-
 const App: React.FC = () => {
+  const { user, loading: authLoading } = useAuth();
+  const { rides, loading: ridesLoading, error: ridesError, addRide, bookRide } = useRides();
   const [activeRole, setActiveRole] = useState<UserRole>(UserRole.PASSENGER);
-  const [rides, setRides] = useState<Ride[]>(initialRides);
   const [notification, setNotification] = useState<string | null>(null);
+  const [authModalOpen, setAuthModalOpen] = useState(false);
+  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

   const showNotification = (message: string) => {
     setNotification(message);
@@ .. @@
     }, 3000);
   };

-  const addRide = (ride: Omit<Ride, 'id'>) => {
-    const newRide = { ...ride, id: new Date().toISOString() };
-    setRides(prevRides => [newRide, ...prevRides]);
-    showNotification('Ride successfully posted!');
-    setActiveRole(UserRole.PASSENGER); // Switch to passenger view to see the new ride
+  const handleAddRide = async (rideData: Omit<Ride, 'id'>) => {
+    if (!user) {
+      setAuthModalOpen(true);
+      return;
+    }
+
+    const result = await addRide(rideData);
+    if (result.success) {
+      showNotification('Ride successfully posted!');
+      setActiveRole(UserRole.PASSENGER);
+    } else {
+      showNotification(result.error || 'Failed to post ride');
+    }
   };

-  const bookRide = (rideId: string) => {
-    setRides(prevRides => 
-      prevRides.map(ride => {
-        if (ride.id === rideId && ride.availableSeats > 0) {
-          showNotification(`Booking confirmed for ride to ${ride.destination}!`);
-          return { ...ride, availableSeats: ride.availableSeats - 1 };
-        }
-        return ride;
-      })
-    );
+  const handleBookRide = async (rideId: string) => {
+    const ride = rides.find(r => r.id === rideId);
+    const result = await bookRide(rideId);
+    
+    if (result.success && ride) {
+      showNotification(`Booking confirmed for ride to ${ride.destination}!`);
+    } else {
+      showNotification(result.error || 'Failed to book ride');
+    }
+  };
+
+  const toggleAuthMode = () => {
+    setAuthMode(prev => prev === 'signin' ? 'signup' : 'signin');
   };

+  if (authLoading) {
+    return (
+      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
+        <div className="text-center">
+          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
+          <p className="text-gray-600">Loading...</p>
+        </div>
+      </div>
+    );
+  }
+
   return (
     <div className="min-h-screen bg-gray-50 font-sans">
-      <Header />
+      <Header onAuthClick={() => setAuthModalOpen(true)} />
       <main className="container mx-auto max-w-4xl p-4 sm:p-6">
         {notification && (
-            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md shadow-md" role="alert">
-                <p className="font-bold">Success</p>
-                <p>{notification}</p>
-            </div>
+          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md shadow-md" role="alert">
+            <p className="font-bold">Success</p>
+            <p>{notification}</p>
+          </div>
+        )}
+        
+        {ridesError && (
+          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-md" role="alert">
+            <p className="font-bold">Error</p>
+            <p>{ridesError}</p>
+          </div>
         )}
+
         <Tabs activeRole={activeRole} setActiveRole={setActiveRole} />
         <div className="mt-6 bg-white p-6 sm:p-8 rounded-lg shadow-lg">
           {activeRole === UserRole.DRIVER ? (
-            <DriverPortal onAddRide={addRide} />
+            <DriverPortal onAddRide={handleAddRide} />
           ) : (
-            <PassengerPortal allRides={rides} onBookRide={bookRide} />
+            <PassengerPortal 
+              allRides={rides} 
+              onBookRide={handleBookRide} 
+              loading={ridesLoading}
+            />
           )}
         </div>
       </main>
+      
+      <AuthModal
+        isOpen={authModalOpen}
+        onClose={() => setAuthModalOpen(false)}
+        mode={authMode}
+        onToggleMode={toggleAuthMode}
+      />
+      
       <footer className="text-center py-4 text-gray-500 text-sm mt-8">
         <p>&copy; {new Date().getFullYear()} RideLink. All rights reserved.</p>
       </footer>
@@ .. @@
 };

 export default App;