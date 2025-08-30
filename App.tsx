import React, { useState } from 'react';
import { UserRole, Ride } from './types';
import Header from './components/Header';
import Tabs from './components/Tabs';
import DriverPortal from './components/DriverPortal';
import PassengerPortal from './components/PassengerPortal';

// Initial mock data for demonstration
const initialRides: Ride[] = [
  {
    id: '1',
    driverName: 'John Doe',
    carModel: 'Toyota Camry',
    startLocation: 'Dubai',
    destination: 'Abu Dhabi',
    rideDate: '2024-08-15',
    rideTime: '10:00',
    price: 25,
    availableSeats: 3,
    contactDetail: '555-123-4567',
    remarks: 'Max 2 small bags per person. No pets allowed.',
  },
  {
    id: '2',
    driverName: 'Jane Smith',
    carModel: 'Honda Civic',
    startLocation: 'Sharjah',
    destination: 'Dubai',
    rideDate: '2024-08-15',
    rideTime: '12:30',
    price: 15,
    availableSeats: 2,
    contactDetail: '555-987-6543',
    remarks: 'Pickup from Central Mall.',
  },
    {
    id: '3',
    driverName: 'Sam Wilson',
    carModel: 'Tesla Model 3',
    startLocation: 'Abu Dhabi',
    destination: 'Rasalkhaima',
    rideDate: '2024-08-16',
    rideTime: '18:00',
    price: 20,
    availableSeats: 1,
    contactDetail: '555-456-7890',
  },
];


const App: React.FC = () => {
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.PASSENGER);
  const [rides, setRides] = useState<Ride[]>(initialRides);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const addRide = (ride: Omit<Ride, 'id'>) => {
    const newRide = { ...ride, id: new Date().toISOString() };
    setRides(prevRides => [newRide, ...prevRides]);
    showNotification('Ride successfully posted!');
    setActiveRole(UserRole.PASSENGER); // Switch to passenger view to see the new ride
  };

  const bookRide = (rideId: string) => {
    setRides(prevRides => 
      prevRides.map(ride => {
        if (ride.id === rideId && ride.availableSeats > 0) {
          showNotification(`Booking confirmed for ride to ${ride.destination}!`);
          return { ...ride, availableSeats: ride.availableSeats - 1 };
        }
        return ride;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main className="container mx-auto max-w-4xl p-4 sm:p-6">
        {notification && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md shadow-md" role="alert">
                <p className="font-bold">Success</p>
                <p>{notification}</p>
            </div>
        )}
        <Tabs activeRole={activeRole} setActiveRole={setActiveRole} />
        <div className="mt-6 bg-white p-6 sm:p-8 rounded-lg shadow-lg">
          {activeRole === UserRole.DRIVER ? (
            <DriverPortal onAddRide={addRide} />
          ) : (
            <PassengerPortal allRides={rides} onBookRide={bookRide} />
          )}
        </div>
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm mt-8">
        <p>&copy; {new Date().getFullYear()} RideLink. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;