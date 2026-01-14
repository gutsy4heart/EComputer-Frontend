 import React from 'react';
import { useAuthContext } from '../../context';
import { UserRole } from '../../types';

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

 
export const AdminGuard: React.FC<AdminGuardProps> = ({ children, fallback = null }) => {
  const { user, loading } = useAuthContext();
  
 
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p>Loading...</p>
      </div>
    );
  }
  
 
  console.log('[AdminGuard] User:', user);
  console.log('[AdminGuard] User role:', user?.role);
  console.log('[AdminGuard] Is admin:', user?.role === UserRole.Admin);
  
  if (!user || user.role !== UserRole.Admin) {
    console.log('[AdminGuard] Access denied - not an admin');
    return <>{fallback}</>;
  }
  
 
  return <>{children}</>;
};
