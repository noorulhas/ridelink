import React, { useState } from 'react';
import { Ride } from '../types';
import { CITIES } from '../constants';
import { useAuth } from '../hooks/useAuth';

interface DriverPortalProps {
  onAddRide: (ride: Omit<Ride, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const DriverPortal: React.FC<DriverPortalProps> = ({ onAddRide }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    driverName: '',
    carModel: '',
    startLocation: '',
    customStartLocation: '',
    destination: '',
    customDestination: '',
    rideDate: '',
    rideTime: '',
    price: '',
    availableSeats: '',
    contactDetail: '',
    remarks: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please sign in to post a ride');
      return;
    }

    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const rideData = {
        driverName: formData.driverName,
        carModel: formData.carModel,
        startLocation: formData.startLocation === 'Other' ? formData.customStartLocation : formData.startLocation,
        destination: formData.destination === 'Other' ? formData.customDestination : formData.destination,
        rideDate: formData.rideDate,
        rideTime: formData.rideTime,
        price: parseFloat(formData.price),
        availableSeats: parseInt(formData.availableSeats, 10),
        contactDetail: formData.contactDetail,
        remarks: formData.remarks,
        userId: user.id,
      };

      // Validate required fields
      if (!rideData.driverName || !rideData.carModel || !rideData.startLocation || 
          !rideData.destination || !rideData.rideDate || !rideData.rideTime || 
          !rideData.contactDetail || isNaN(rideData.price) || isNaN(rideData.availableSeats)) {
        alert('Please fill out all required fields correctly.');
        return;
      }
      
      await onAddRide(rideData);

      // Reset form on success
      setFormData({
        driverName: '',
        carModel: '',
        startLocation: '',
        customStartLocation: '',
        destination: '',
        customDestination: '',
        rideDate: '',
        rideTime: '',
        price: '',
        availableSeats: '',
        contactDetail: '',
        remarks: '',
      });
    } catch (error) {
      console.error('Error submitting ride:', error);
      alert('Failed to post ride. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
        <div className="max-w-md mx-auto">
          <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Create an account or sign in to start posting your rides and connect with passengers.</p>
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Why create an account?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Post unlimited rides</li>
              <li>✓ Manage your listings</li>
              <li>✓ Connect with passengers</li>
              <li>✓ Build your driver reputation</li>
            </ul>
          </div>
          <p className="text-sm text-gray-500 mb-4">Click "Sign In" in the top right corner to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Post a New Ride</h2>
      <p className="text-gray-600 mb-6">Fill in the details below to add your trip to the listings.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row for location and date/time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <select name="startLocation" value={formData.startLocation} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent" required>
            <option value="" disabled>Select Starting Location</option>
            {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
            <option value="Other">Other</option>
          </select>
          
          <select name="destination" value={formData.destination} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent" required>
            <option value="" disabled>Select Destination</option>
            {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
            <option value="Other">Other</option>
          </select>

          <input type="date" name="rideDate" value={formData.rideDate} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent" required min={new Date().toISOString().split('T')[0]} />
          <input type="time" name="rideTime" value={formData.rideTime} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent" required />
        </div>

        {/* Row for custom locations if needed */}
        {(formData.startLocation === 'Other' || formData.destination === 'Other') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formData.startLocation === 'Other' && (
                <input type="text" name="customStartLocation" placeholder="Enter Custom Starting Location" value={formData.customStartLocation} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent" required />
            )}
            {formData.destination === 'Other' && (
                <input type="text" name="customDestination" placeholder="Enter Custom Destination" value={formData.customDestination} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent" required />
            )}
            </div>
        )}
        
        {/* Grid for other details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
          <input type="text" name="driverName" placeholder="Driver Name" value={formData.driverName} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent" required />
          <input type="text" name="carModel" placeholder="Car Type & Model" value={formData.carModel} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent" required />
          <input type="number" name="price" placeholder="Price per Seat (AED)" value={formData.price} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent" min="0" step="0.01" required />
          <input type="number" name="availableSeats" placeholder="Available Seats" value={formData.availableSeats} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent" min="1" step="1" required />
          <input type="text" name="contactDetail" placeholder="Contact Detail (e.g., Phone)" value={formData.contactDetail} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent sm:col-span-2" required />
        </div>

         <div>
            <textarea name="remarks" placeholder="Additional Remarks (e.g., luggage policy, pickup points)" value={formData.remarks} onChange={handleChange} rows={3} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"></textarea>
         </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-yellow-500 text-white font-bold py-3 px-4 rounded-md hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Posting Ride...' : 'Post Ride'}
        </button>
      </form>
    </div>
  );
};

export default DriverPortal;