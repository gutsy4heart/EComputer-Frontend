import { User, UserRole } from '../types';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
 
export const hasRole = (user: User | null, requiredRole: UserRole): boolean => {
  if (!user || !user.role) return false;  
 
  if (user.role === UserRole.Admin) return true;  
 
  return user.role === requiredRole;
};
 
export const hasAnyRole = (user: User | null, roles: UserRole[]): boolean => {
  if (!user || !user.role) return false; 
 
  if (user.role === UserRole.Admin) return true;

  return roles.includes(user.role);
};

export const isAuthenticated = (user: User | null): boolean => {
  return user !== null;
};


export const isAdmin = (user: User | null): boolean => {
  if (!user || !user.role) return false;
  return user.role === UserRole.Admin;
};


export const setUserRoleInCookie = (role: UserRole | undefined): void => {
  try {
 
    if (role) {
      document.cookie = `userRole=${role}; path=/; max-age=86400; SameSite=Strict`;
    }
  } catch (error) {
    console.error('Error setting user role cookie:', error);
  }
};

 
export const clearUserRoleFromCookie = (): void => {
  try {
    document.cookie = 'userRole=; path=/; max-age=0; SameSite=Strict';
  } catch (error) {
    console.error('Error clearing user role cookie:', error);
  }
};

 
export const getUserFromRequest = async (request: NextRequest): Promise<User | null> => {
  try {
  
    const accessToken = request.cookies.get('accessToken')?.value;
    
    if (!accessToken) {
      return null;
    }
    
 
    const user: User = {
      id: 1,
      name: 'user',
      email: 'user@example.com',
      createdAt: new Date().toISOString(),
      role: UserRole.User
    };
    
 
    const userRole = request.cookies.get('userRole')?.value;
 
    const referer = request.headers.get('referer');
    const isRefresh = referer && request.nextUrl.pathname === new URL(referer).pathname;
    
 
    if (isRefresh) {
 
      if (userRole) {
        user.role = userRole as UserRole;
      }
    } else {
   
      if (userRole === UserRole.Admin) {
        user.role = UserRole.Admin;
      }
    }
    
    return user;
  } catch (error) {
    console.error('Error getting user from request:', error);
    return null;
  }
};

 
export const canAccessResource = (user: User | null, resourceOwnerId: number): boolean => {
  if (!user || !user.role) return false;
 
  if (user.role === UserRole.Admin) return true;
  
  return user.id === resourceOwnerId;
};
