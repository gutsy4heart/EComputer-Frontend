'use client';
import { useState, useEffect, useCallback } from 'react';
import { favoriteService } from '../services/favorite.service';
import { Product } from '../types';
import { useAuthContext } from '../context';

interface ApiResponse<T> {
  isSuccess: boolean;
  error: string | null;
  value: T | null;
}

interface FavoriteDto {
  id: number;
  productIds: Product[];
  userId: number;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuthContext();

  
  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response: ApiResponse<FavoriteDto[]> = await favoriteService.getFavorites();

      if (response.isSuccess && response.value) {
        if (Array.isArray(response.value)) {
        
          const allProducts = response.value.flatMap(fav => fav.productIds || []);
          
          if (Array.isArray(allProducts)) {
            setFavorites(allProducts);
          } else {
            setFavorites([]);
            setError('Invalid favorites data format: productIds is not an array');
          }
        } else {
      
          if (response.value && typeof response.value === 'object') {

            const possibleData = (response.value as any).data || (response.value as any).value || response.value;
            if (Array.isArray(possibleData)) {
              const allProducts = possibleData.flatMap((fav: any) => fav.productIds || []);
              setFavorites(allProducts);
            } else {
              setFavorites([]);
              setError('Invalid favorites data format: unexpected structure');
            }
          } else {
            setFavorites([]);
            setError('Invalid favorites data format: expected array of FavoriteDto');
          }
        }
      } else {
        setFavorites([]);
        if (response.error) {
          setError(response.error);
        } else if (!response.value) {
          setError('No favorites found');
        } else {
          setError('Failed to load favorites');
        }
      }
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError('Failed to load favorites');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  /**
   * Добавляет продукт в избранное
   * @param productId - ID продукта
   * @returns true если успешно, иначе false
   */
  const addToFavorites = useCallback(
    async (productId: number): Promise<boolean> => {
      if (!isAuthenticated || !user) {
        setError('You must be logged in to add favorites');
        return false;
      }

      try {
        setLoading(true);
        setError(null);

        const success = await favoriteService.addFavorite(productId);

        if (success) {
          await loadFavorites();
          return true;
        }

        return false;
      } catch (err) {
        console.error('Error adding to favorites:', err);
        setError('Failed to add to favorites');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, loadFavorites, user]
  );

  /**
   * Удаляет продукт из избранного
   * @param productId - ID продукта
   * @returns true если успешно, иначе false
   */
  const removeFromFavorites = useCallback(
    async (productId: number): Promise<boolean> => {
      if (!isAuthenticated || !user) {
        setError('You must be logged in to remove favorites');
        return false;
      }

      try {
        setLoading(true);
        setError(null);

        const success = await favoriteService.removeFavorite(productId);

        if (success) {
          setFavorites(prev => prev.filter(product => product.id !== productId));
          return true;
        }

        return false;
      } catch (err) {
        console.error('Error removing from favorites:', err);
        setError('Failed to remove from favorites');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, user]
  );

  /**
   * Проверяет, есть ли продукт в избранном
   */
  const isInFavorites = useCallback(
    (productId: number): boolean => {
      return favorites.some(product => product.id === productId);
    },
    [favorites]
  );

  /**
   * Переключает состояние избранного для продукта (добавляет или удаляет)
   */
  const toggleFavorite = useCallback(
    async (productId: number): Promise<boolean> => {
      const isFavorite = isInFavorites(productId);

      if (isFavorite) {
        return removeFromFavorites(productId);
      } else {
        return addToFavorites(productId);
      }
    },
    [addToFavorites, isInFavorites, removeFromFavorites]
  );

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    loading,
    error,
    loadFavorites,
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
    toggleFavorite,
  };
};
