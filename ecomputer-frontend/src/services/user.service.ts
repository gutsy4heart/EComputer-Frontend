import { apiService } from './api';
import { User, RegisterUserRequest, LoginUserRequest, UpdateUserRequest, DeleteUserRequest, LogoutUserRequest, UpdateRefreshTokenRequest, ImageUploadRequest, RequestPasswordChangeRequest, ConfirmPasswordChangeRequest } from '../types';

export class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Получить пользователя по ID
   */
  public async getUser(id: number): Promise<User | null> {
    try {
      const response = await apiService.get<User>(`/user/${id}`);
      if (response.isSuccess && response.value) {
        return response.value;
      }
      console.error('[UserService] Failed to get user:', response.error);
      return null;
    } catch (error) {
      console.error('[UserService] Error getting user:', error);
      return null;
    }
  }

  /**
   * Регистрация пользователя
   */
  public async registerUser(request: RegisterUserRequest): Promise<boolean> {
    try {
      const response = await apiService.post<void>('/user/register', request);
      if (response.isSuccess) {
        console.log('[UserService] User registered successfully');
        return true;
      }
      console.error('[UserService] Failed to register user:', response.error);
      return false;
    } catch (error) {
      console.error('[UserService] Error registering user:', error);
      return false;
    }
  }

  /**
   * Вход пользователя
   */
  public async loginUser(request: LoginUserRequest): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await apiService.post<any>('/user/login', request);
      if (response.isSuccess && response.value) {
        console.log('[UserService] User logged in successfully');
        return { success: true, data: response.value };
      }
      console.error('[UserService] Failed to login user:', response.error);
      return { success: false, error: response.error };
    } catch (error) {
      console.error('[UserService] Error logging in user:', error);
      return { success: false, error: 'Network error' };
    }
  }

  /**
   * Обновление профиля пользователя
   */
  public async updateUser(request: UpdateUserRequest): Promise<boolean> {
    try {
      const response = await apiService.put<void>('/user', request);
      if (response.isSuccess) {
        console.log('[UserService] User updated successfully');
        return true;
      }
      console.error('[UserService] Failed to update user:', response.error);
      return false;
    } catch (error) {
      console.error('[UserService] Error updating user:', error);
      return false;
    }
  }

  /**
   * Удаление пользователя
   */
  public async deleteUser(request: DeleteUserRequest): Promise<boolean> {
    try {
      const response = await apiService.delete<void>('/user', request);
      if (response.isSuccess) {
        console.log('[UserService] User deleted successfully');
        return true;
      }
      console.error('[UserService] Failed to delete user:', response.error);
      return false;
    } catch (error) {
      console.error('[UserService] Error deleting user:', error);
      return false;
    }
  }

  /**
   * Выход пользователя
   */
  public async logoutUser(request: LogoutUserRequest): Promise<boolean> {
    try {
      const response = await apiService.post<void>('/user/logout', request);
      if (response.isSuccess) {
        console.log('[UserService] User logged out successfully');
        return true;
      }
      console.error('[UserService] Failed to logout user:', response.error);
      return false;
    } catch (error) {
      console.error('[UserService] Error logging out user:', error);
      return false;
    }
  }

  /**
   * Обновление refresh token
   */
  public async updateRefreshToken(request: UpdateRefreshTokenRequest): Promise<boolean> {
    try {
      const response = await apiService.post<void>('/user/refresh-token', request);
      if (response.isSuccess) {
        console.log('[UserService] Refresh token updated successfully');
        return true;
      }
      console.error('[UserService] Failed to update refresh token:', response.error);
      return false;
    } catch (error) {
      console.error('[UserService] Error updating refresh token:', error);
      return false;
    }
  }

  /**
   * Получить всех пользователей
   */
  public async getAllUsers(): Promise<User[]> {
    try {
      const response = await apiService.get<User[]>('/user');
      if (response.isSuccess && response.value) {
        return response.value;
      }
      console.error('[UserService] Failed to get all users:', response.error);
      return [];
    } catch (error) {
      console.error('[UserService] Error getting all users:', error);
      return [];
    }
  }

  /**
   * Загрузка изображения пользователя
   */
  public async uploadImage(request: ImageUploadRequest): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const formData = new FormData();
      formData.append('imageFile', request.imageFile);

      const response = await apiService.post<any>('/user/upload-image', formData);
      if (response.isSuccess && response.value) {
        console.log('[UserService] Image uploaded successfully');
        return { success: true, data: response.value };
      }
      console.error('[UserService] Failed to upload image:', response.error);
      return { success: false, error: response.error };
    } catch (error) {
      console.error('[UserService] Error uploading image:', error);
      return { success: false, error: 'Network error' };
    }
  }

  /**
   * Запрос на смену пароля
   */
  public async requestPasswordChange(request: RequestPasswordChangeRequest): Promise<boolean> {
    try {
      const response = await apiService.post<void>('/user/request-password-change', request);
      if (response.isSuccess) {
        console.log('[UserService] Password change request sent successfully');
        return true;
      }
      console.error('[UserService] Failed to request password change:', response.error);
      return false;
    } catch (error) {
      console.error('[UserService] Error requesting password change:', error);
      return false;
    }
  }

  /**
   * Подтверждение смены пароля
   */
  public async confirmPasswordChange(request: ConfirmPasswordChangeRequest): Promise<boolean> {
    try {
      const response = await apiService.post<void>('/user/confirm-password-change', request);
      if (response.isSuccess) {
        console.log('[UserService] Password changed successfully');
        return true;
      }
      console.error('[UserService] Failed to confirm password change:', response.error);
      return false;
    } catch (error) {
      console.error('[UserService] Error confirming password change:', error);
      return false;
    }
  }

  /**
   * Подтверждение email
   */
  public async confirmEmail(token: string, returnUrl?: string): Promise<boolean> {
    try {
      const url = returnUrl ? `/user/confirm-email/${token}?returnUrl=${encodeURIComponent(returnUrl)}` : `/user/confirm-email/${token}`;
      const response = await apiService.get<void>(url);
      if (response.isSuccess) {
        console.log('[UserService] Email confirmed successfully');
        return true;
      }
      console.error('[UserService] Failed to confirm email:', response.error);
      return false;
    } catch (error) {
      console.error('[UserService] Error confirming email:', error);
      return false;
    }
  }
}

export const userService = UserService.getInstance(); 