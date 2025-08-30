
import React from 'react';
import { UserRole } from '../types';
import { UserIcon, CarIcon } from './IconComponents';

interface TabsProps {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeRole, setActiveRole }) => {
  const tabClasses = (role: UserRole) => 
    `w-1/2 py-4 px-1 text-center text-sm font-medium border-b-2 flex items-center justify-center gap-2 transition-colors duration-200 ease-in-out cursor-pointer ${
      activeRole === role
        ? 'border-yellow-500 text-yellow-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`;

  return (
    <div className="border-b border-gray-200">
      <div className="flex -mb-px">
        <button onClick={() => setActiveRole(UserRole.PASSENGER)} className={tabClasses(UserRole.PASSENGER)}>
          <UserIcon className="w-5 h-5" />
          Find a Ride
        </button>
        <button onClick={() => setActiveRole(UserRole.DRIVER)} className={tabClasses(UserRole.DRIVER)}>
            <CarIcon className="w-5 h-5" />
          Offer a Ride
        </button>
      </div>
    </div>
  );
};

export default Tabs;
