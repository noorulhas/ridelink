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
      <Header onAuthClick={() => {
        setAuthModalOpen(true);
        setAuthMode('signin');
      }} />
      <main className="container mx-auto max-w-4xl p-4 sm:p-6">
        {!isSupabaseConfigured && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md shadow-md" role="alert">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="font-bold text-lg">⚠️ Database Not Connected</p>
                <p className="mt-1">Your app is running in <strong>Demo Mode</strong> with temporary data that won't be saved.</p>
                <div className="mt-3 p-3 bg-yellow-50 rounded-md border border-yellow-200">
                  <p className="font-semibold text-yellow-800 mb-2">To enable full functionality:</p>
                  <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
                    <li>Click the <strong>"Connect to Supabase"</strong> button in the top right corner</li>
                    <li>Follow the setup wizard to connect your database</li>
                    <li>Your data will then be saved permanently</li>
                  </ol>
                </div>
                <div className="mt-3 text-sm text-yellow-600">
                  <strong>Current limitations:</strong> Authentication disabled • Data resets on refresh • No data persistence
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isSupabaseConfigured && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md shadow-md" role="alert">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-bold">✅ Database Connected</p>
                <p>Your app is connected to Supabase. All data will be saved permanently!</p>
              </div>
            </div>
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