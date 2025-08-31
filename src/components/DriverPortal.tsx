@@ .. @@
 import React, { useState } from 'react';
 import { Ride } from '../types';
 import { CITIES } from '../constants';
+import { useAuth } from '../hooks/useAuth';
 
 interface DriverPortalProps {
   onAddRide: (ride: Omit<Ride, 'id'>) => void;
 }
 
 const DriverPortal: React.FC<DriverPortalProps> = ({ onAddRide }) => {
+  const { user } = useAuth();
   const [formData, setFormData] = useState({