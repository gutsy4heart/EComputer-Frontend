'use client';

import React from 'react';
import { useAuthContext } from '../../context';
import { UserRole } from '../../types/user';
import { hasRole } from '../../utils/auth';

interface RoleGuardProps {
  requiredRole: UserRole;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

 
export const RoleGuard: React.FC<RoleGuardProps> = ({
  requiredRole,
  children,
  fallback = null,
}) => {
  const { user } = useAuthContext();
  
  if (hasRole(user, requiredRole)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

 
export const AdminGuard: React.FC<Omit<RoleGuardProps, 'requiredRole'>> = ({
  children,
  fallback = null,
}) => {
  return (
    <RoleGuard requiredRole={UserRole.Admin} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};
