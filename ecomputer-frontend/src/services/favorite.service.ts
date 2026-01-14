import { apiClient } from './api-client';
import { Product } from '../types';

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

export class FavoriteService {
  private static instance: FavoriteService;

  private constructor() {}

  public static getInstance(): FavoriteService {
    if (!FavoriteService.instance) {
      FavoriteService.instance = new FavoriteService();
    }
    return FavoriteService.instance;
  }

  /**
   * Получить избранные товары пользователя
   * Возвращаем ApiResponse с массивом FavoriteDto
   */
  public async getFavorites(): Promise<ApiResponse<FavoriteDto[]>> {
    apiClient.ensureTokenFromStorage();
    
    const response = await apiClient.getFavorites();
    
    // Преобразуем ответ в нужный формат
    if (response.isSuccess && response.value) {
      // Если response.value это массив, возвращаем как есть
      if (Array.isArray(response.value)) {
        return {
          isSuccess: true,
          error: null,
          value: response.value as FavoriteDto[]
        };
      }
      
      // Если response.value это объект, ищем данные внутри
      if (typeof response.value === 'object') {
        const data = (response.value as any).data || (response.value as any).value || response.value;
        if (Array.isArray(data)) {
          return {
            isSuccess: true,
            error: null,
            value: data as FavoriteDto[]
          };
        }
      }
      
      return {
        isSuccess: false,
        error: 'Invalid response format',
        value: null
      };
    }
    
    return {
      isSuccess: response.isSuccess,
      error: response.error,
      value: null
    };
  }

  /**
   * Добавить товар в избранное
   */
  public async addFavorite(productId: number): Promise<boolean> {
    apiClient.ensureTokenFromStorage();
    const response = await apiClient.addFavorite({ productId });
    return response.isSuccess;
  }

  /**
   * Удалить товар из избранного
   */
  public async removeFavorite(productId: number): Promise<boolean> {
    apiClient.ensureTokenFromStorage();
    const response = await apiClient.removeFavorite(productId);
    return response.isSuccess;
  }

  /**
   * Проверить, есть ли товар в избранном
   */
  public async isInFavorites(productId: number, favorites?: Product[]): Promise<boolean> {
    if (favorites) {
      return favorites.some(product => product.id === productId);
    }
    
    const userFavoritesResponse = await this.getFavorites();
    if (!userFavoritesResponse.isSuccess || !userFavoritesResponse.value) return false;

    // Собираем все продукты из всех FavoriteDto
    const allProducts = userFavoritesResponse.value.flatMap(fav => fav.productIds);
    return allProducts.some(product => product.id === productId);
  }
}

export const favoriteService = FavoriteService.getInstance();
