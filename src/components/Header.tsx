@@ .. @@
 import React from 'react';
+import { useAuth } from '../hooks/useAuth';
 import { TaxiIcon } from './IconComponents';

-const Header: React.FC = () => {
+interface HeaderProps {
+  onAuthClick: () => void;
+}
+
+const Header: React.FC<HeaderProps> = ({ onAuthClick }) => {
+  const { user, signOut } = useAuth();
+
+  const handleAuthAction = async () => {
+    if (user) {
+      await signOut();
+    } else {
+      onAuthClick();
+    }
+  };
+
   return (
     <header className="bg-white shadow-md">
-      <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-4 flex items-center justify-center">
+      <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-4 flex items-center justify-between">
+        <div className="flex items-center">
         <TaxiIcon className="h-8 w-8 text-yellow-500 mr-3"/>
         <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
           RideLink
         </h1>
+        </div>
+        <div className="flex items-center gap-4">
+          {user && (
+            <span className="text-sm text-gray-600">
+              Welcome, {user.email}
+            </span>
+          )}
+          <button
+            onClick={handleAuthAction}
+            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors duration-200 font-medium"
+          >
+            {user ? 'Sign Out' : 'Sign In'}
+          </button>
+        </div>
       </div>
     </header>
   );
 };

 export default Header;