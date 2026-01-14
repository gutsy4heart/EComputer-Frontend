'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services';
import { User, LoginRequest, RegisterRequest, RegisterResponse } from '../types';
import { setUserRoleInCookie, clearUserRoleFromCookie } from '../utils/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const registeredUserId = localStorage.getItem('registeredUserId');
      const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';

      
      if (isAuthPage) {
        setLoading(false);
        return;
      }

      if (!registeredUserId) {
        router.push('/');
        return;
      }

      // Сначала пытаемся загрузить пользователя из localStorage для быстрого отображения
      const cachedUser = localStorage.getItem('currentUser');
      if (cachedUser) {
        try {
          const parsedUser = JSON.parse(cachedUser);
          setUser(parsedUser);
          if (parsedUser.role) {
            setUserRoleInCookie(parsedUser.role);
          }
        } catch (err) {
          console.error('[useAuth] Error parsing cached user:', err);
        }
      }

      // Затем загружаем актуальные данные с сервера
      const currentUser = await authService.getCurrentUser();

      if (currentUser) {
        setUser(currentUser);
        // Сохраняем актуального пользователя в localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        if (currentUser.role) {
          setUserRoleInCookie(currentUser.role);
        }
      } else {
        clearUserRoleFromCookie();
        setUser(null);
        localStorage.removeItem('currentUser');
      }
    } catch (err) {
      console.error('[useAuth] Error loading user:', err);
      setError('Failed to load user');
      clearUserRoleFromCookie();
      setUser(null);
      localStorage.removeItem('currentUser');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadUser();

    const onStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        loadUser();
      }
    };

    const onUserChanged = () => {
      loadUser();
    };

    window.addEventListener('storage', onStorageChange);
    window.addEventListener('userChanged', onUserChanged);

    return () => {
      window.removeEventListener('storage', onStorageChange);
      window.removeEventListener('userChanged', onUserChanged);
    };
  }, [loadUser]);

  const login = useCallback(
    async (loginData: LoginRequest) => {
      try {
        setLoading(true);
        setError(null);

        const loggedInUser = await authService.login(loginData);

        if (loggedInUser) {
          setUser(loggedInUser);
          if (loggedInUser.role) {
            setUserRoleInCookie(loggedInUser.role);
          }
          
          // Trigger user change event to refresh cart and other user-dependent data
          window.dispatchEvent(new Event('userChanged'));
          
          router.push('/');
          return true;
        } else {
          setError('Invalid email or password');
          return false;
        }
      } catch (err) {
        console.error('[useAuth] Login error:', err);
        setError('Login failed');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const register = useCallback(
    async (registerData: RegisterRequest): Promise<RegisterResponse | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await authService.register(registerData);
        return response;
      } catch (err) {
        setError('Registration failed');
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await authService.logout();
      setUser(null);
      clearUserRoleFromCookie();
      
      // Очищаем кэшированного пользователя
      localStorage.removeItem('currentUser');

      window.dispatchEvent(new Event('userChanged'));
      router.push('/');

      return true;
    } catch (err) {
      setError('Logout failed');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const updateUser = useCallback(
    async (id: number, userData: { name?: string; address?: string; password?: string }) => {
      try {
        setLoading(true);
        setError(null);

        const success = await authService.updateUser(id, userData);

        if (success && user) {
          setUser({
            ...user,
            ...(userData.name && { name: userData.name }),
            ...(userData.address && { address: userData.address }),
          });
          return true;
        } else {
          setError('Failed to update user');
          return false;
        }
      } catch (err) {
        setError('Failed to update user');
        console.error(err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const uploadUserImage = useCallback(
    async (userId: number, file: File): Promise<string | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await authService.uploadUserImage({
          userId,
          file
        });

        if (response && response.success && user && userId === user.id) {
          // Update the user object with the new image URL
          const updatedUser = {
            ...user,
            imageUrl: response.imageUrl // Используем imageUrl вместо image
          };
          setUser(updatedUser);
          
          // Сохраняем обновленного пользователя в localStorage для персистентности
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          
          // Уведомляем другие компоненты об изменении пользователя
          window.dispatchEvent(new Event('userChanged'));
          
          console.log('[useAuth] Updated user with imageUrl:', updatedUser);
          
          return response.imageUrl;
        } else {
          setError('Failed to upload image');
          return null;
        }
      } catch (err) {
        setError('Failed to upload image');
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const loginWithQr = useCallback(
    async (qrToken: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/qr/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ qrToken: qrToken.trim() }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`QR login failed: ${errorData.error || 'Unknown error'}`);
        }

        const data = await response.json();
        
        if (data.token) {
          // Сохраняем токены
          localStorage.setItem('token', data.token);
          if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
          }

          // Устанавливаем токен в apiService (важно для getCurrentUser)
          const { apiService } = await import('../services/api');
          apiService.setToken(data.token);
          if (data.refreshToken) {
            apiService.setRefreshToken(data.refreshToken);
          }

          // Загружаем данные пользователя
          const currentUser = await authService.getCurrentUser();

          if (currentUser) {
            setUser(currentUser);
            // Сохраняем актуального пользователя в localStorage
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            // Устанавливаем registeredUserId для совместимости
            localStorage.setItem('registeredUserId', currentUser.id.toString());
            
            if (currentUser.role) {
              setUserRoleInCookie(currentUser.role);
            }
            
            // Trigger user change event to refresh cart and other user-dependent data
            window.dispatchEvent(new Event('userChanged'));
            
            router.push('/');
            return true;
          } else {
            throw new Error('No user data received after QR login');
          }
        } else {
          throw new Error('No token received from server');
        }
      } catch (err) {
        console.error('[useAuth] QR login error:', err);
        setError(err instanceof Error ? err.message : 'QR login failed');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    uploadUserImage,
    loginWithQr,
    isAuthenticated: !!user,
  };
};
