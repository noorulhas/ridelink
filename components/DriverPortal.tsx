import React, { useState } from 'react';
import { Ride } from '../types';
import { CITIES } from '../constants';

interface DriverPortalProps {
  onAddRide: (ride: Omit<Ride, 'id'>) => void;
}

const DriverPortal: React.FC<DriverPortalProps> = ({ onAddRide }) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
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
    };

    if (Object.values(rideData).some(val => val === '' || val === null || (typeof val === 'number' && isNaN(val))) && !rideData.remarks) {
      alert('Please fill out all required fields.');
      return;
    }
    
    onAddRide(rideData);

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
  };

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

          <input type="date" name="rideDate" value={formData.rideDate} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent" required />
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

        <button type="submit" className="w-full bg-yellow-500 text-white font-bold py-3 px-4 rounded-md hover:bg-yellow-600 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
          Post Ride
        </button>
      </form>
    </div>
  );
};

export default DriverPortal;