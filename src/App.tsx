import React, { useState } from 'react';
import { UserRole, Ride } from './types';
import Header from './components/Header';
import Tabs from './components/Tabs';
import DriverPortal from './components/DriverPortal';
import PassengerPortal from './components/PassengerPortal';
import AuthModal from './components/AuthModal';
import { useAuth } from './hooks/useAuth';
import { useRides } from './hooks/useRides';
import { isSupabaseConfigured } from './lib/supabase';

const App: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { rides, loading: ridesLoading, error: ridesError, addRide, bookRide } = useRides();
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.PASSENGER);
  const [notification, setNotification] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleAddRide = async (rideData: Omit<Ride, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      setAuthModalOpen(true);
      setAuthMode('signup');
      return;
    }

    try {
      await addRide(rideData);
      showNotification('Ride successfully posted!');
      setActiveRole(UserRole.PASSENGER);
    } catch (error) {
      console.error('Error adding ride:', error);
      showNotification('Failed to post ride. Please try again.');
    }
  };

  const handleBookRide = async (rideId: string) => {
    try {
      const ride = rides.find(r => r.id === rideId);
      await bookRide(rideId);
      
      if (ride) {
        showNotification(`Booking confirmed for ride to ${ride.destination}!`);
      }
    } catch (error) {
      console.error('Error booking ride:', error);
      showNotification('Failed to book ride. Please try again.');
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'signin' ? 'signup' : 'signin');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header onAuthClick={() => setAuthModalOpen(true)} />
      <main className="container mx-auto max-w-4xl p-4 sm:p-6">
        {!isSupabaseConfigured && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md shadow-md" role="alert">
            <p className="font-bold">Demo Mode</p>
            <p>Supabase is not configured. The app is running with mock data. Authentication and data persistence are disabled. To enable full functionality, click "Connect to Supabase" in the top right.</p>
          </div>
        )}
        
        {notification && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md shadow-md" role="alert">
            <p className="font-bold">Success</p>
            <p>{notification}</p>
          </div>
        )}
        
        {ridesError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-md" role="alert">
            <p className="font-bold">Error</p>
            <p>{ridesError}</p>
          </div>
        )}

        <Tabs activeRole={activeRole} setActiveRole={setActiveRole} />
        <div className="mt-6 bg-white p-6 sm:p-8 rounded-lg shadow-lg">
          {activeRole === UserRole.DRIVER ? (
            <DriverPortal onAddRide={handleAddRide} />
          ) : (
            <PassengerPortal 
              allRides={rides} 
              onBookRide={handleBookRide} 
              loading={ridesLoading}
            />
          )}
        </div>
      </main>
      
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onToggleMode={toggleAuthMode}
      />
      
      <footer className="text-center py-4 text-gray-500 text-sm mt-8">
        <p>&copy; {new Date().getFullYear()} RideLink. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;