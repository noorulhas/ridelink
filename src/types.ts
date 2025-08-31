@@ .. @@
 export interface Ride {
   id: string;
   driverName: string;
   carModel: string;
   startLocation: string;
   destination: string;
   rideDate: string;
   rideTime: string;
   price: number;
   availableSeats: number;
   contactDetail: string;
   remarks?: string;
+  userId?: string;
+  createdAt?: string;
+  updatedAt?: string;
 }
 
 export enum UserRole {
   DRIVER = 'DRIVER',
   PASSENGER = 'PASSENGER',
 }