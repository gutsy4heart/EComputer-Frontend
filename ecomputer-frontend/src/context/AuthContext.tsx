'use client';   

import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks';
import { User, LoginRequest, RegisterRequest, RegisterResponse } from '../types';

 
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (loginData: LoginRequest) => Promise<boolean>;
  register: (registerData: RegisterRequest) => Promise<RegisterResponse | null>;
  logout: () => Promise<boolean>;
  updateUser: (id: number, userData: { name?: string; address?: string; password?: string }) => Promise<boolean>;
  uploadUserImage: (userId: number, file: File) => Promise<string | null>;
  isAuthenticated: boolean;
}

 
const AuthContext = createContext<AuthContextType | undefined>(undefined);

 
interface AuthProviderProps {
  children: ReactNode;
}

 
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

 
export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
};
