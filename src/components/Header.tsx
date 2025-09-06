import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAuth } from '../hooks/useAuth';
import { TaxiIcon } from './IconComponents';

interface HeaderProps {
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAuthClick }) => {
  const { user, signOut } = useAuth();

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
    } else {
      onAuthClick();
    }
  };

  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAuthClick }) => {
  const { user, signOut } = useAuth();

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
    } else {
      onAuthClick();
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
        <div className="flex items-center">
        <TaxiIcon className="h-8 w-8 text-yellow-500 mr-3"/>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
          RideLink
        </h1>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-gray-600 hidden sm:block">
              Welcome, {user.email?.split('@')[0]}
            </span>
          )}
          <button
            onClick={handleAuthAction}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors duration-200 font-medium flex items-center gap-2"
          >
            {!user && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
            {user ? 'Sign Out' : 'Sign In'}
          </button>
        </div>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-gray-600 hidden sm:block">
              Welcome, {user.email?.split('@')[0]}
            </span>
          )}
          <button
            onClick={handleAuthAction}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors duration-200 font-medium flex items-center gap-2"
          >
            {!user && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
            {user ? 'Sign Out' : 'Sign In'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;