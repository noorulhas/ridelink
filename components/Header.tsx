
import React from 'react';
import { TaxiIcon } from './IconComponents';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-4 flex items-center justify-center">
        <TaxiIcon className="h-8 w-8 text-yellow-500 mr-3"/>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
          RideLink
        </h1>
      </div>
    </header>
  );
};

export default Header;
