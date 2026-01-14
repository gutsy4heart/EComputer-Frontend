import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services';
import { User } from '../types';   
import { useAuthContext } from '../context';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuthContext();
 
  const loadUsers = useCallback(async () => {
 
    if (!currentUser) {
      setUsers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const users = await authService.getAllUsers();
      if (users) {
        setUsers(users);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error('Ошибка при загрузке пользователей:', err);
      setError('Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

 
  const getUserById = useCallback(async (id: number): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      return await authService.getUserById(id);
    } catch (err) {
      console.error('Ошибка при получении пользователя:', err);
      setError('Не удалось получить пользователя');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

 
  const updateUser = useCallback(
    async (id: number, userData: { name?: string; address?: string }): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const success = await authService.updateUser(id, userData);
        if (success) {
          setUsers(prevUsers =>
            prevUsers.map(user =>
              user.id === id ? { ...user, ...userData } : user
            )
          );
        }
        return success;
      } catch (err) {
        console.error('Ошибка при обновлении пользователя:', err);
        setError('Не удалось обновить пользователя');
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

 

  return {
    users,
    loading,
    error,
    loadUsers,
    getUserById,
    updateUser,
    // updateUserRole
  };
};
