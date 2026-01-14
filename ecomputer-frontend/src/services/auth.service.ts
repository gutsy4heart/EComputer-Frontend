import { apiService } from './api';
import {
  LoginRequest,
  RegisterRequest,
  User,
  LoginResponse,
  UserRole,
  UploadUserImageRequest,
  UploadUserImageResponse,
  RegisterResponse,
} from '../types';

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }
 
  public async register(registerData: RegisterRequest): Promise<RegisterResponse | null> {
    try {
      const response = await apiService.post<RegisterResponse>(
        '/user/register',
        registerData
      );
      if (!response.isSuccess) return null;

      return response.value || null;
    } catch (e) {
      console.error('[Auth] Registration error:', e);
      return null;
    }
  }

 
  public async login(loginData: LoginRequest): Promise<User | null> {
    try {
      console.log('[AuthService] Starting login process for:', loginData.email);
      
      const response = await apiService.post<LoginResponse>(
        '/user/login',
        loginData
      );
      
      console.log('[AuthService] Login response:', response);
      
      if (!response.isSuccess || !response.value) {
        console.log('[AuthService] Login failed - no success or no value');
        return null;
      }

      const { token, refreshToken } = response.value;
      console.log('[AuthService] Got token and refresh token');

      apiService.setToken(token);
      if (refreshToken) apiService.setRefreshToken(refreshToken);
      apiService.startTokenRefresh();

      const { userId, role } = this.decodeToken(token);
      console.log('[AuthService] Decoded token - userId:', userId, 'role:', role);
      
      if (!userId) {
        console.log('[AuthService] No userId in token');
        return null;
      }

      localStorage.setItem('registeredUserId', userId);

      if (role) {
        document.cookie = `userRole=${role}; path=/; max-age=86400; SameSite=Strict`;
        console.log('[AuthService] Set userRole cookie:', role);
      }

      const user = await this.getUserById(+userId);
      console.log('[AuthService] Got user by ID:', user);
      
      if (user && role && !user.role) {
        user.role = role;
      }

      console.log('[AuthService] Returning user:', user);
      return user;
    } catch (e) {
      console.error('[Auth] Login error:', e);
      return null;
    }
  }

 
  public async getCurrentUser(): Promise<User | null> {
    const token = apiService.getToken();
    if (!token) return null;

    const { userId, role } = this.decodeToken(token);
    if (!userId) return null;

    const localId = localStorage.getItem('registeredUserId');
    const idToUse = userId === '1' && localId && localId !== '1' ? localId : userId;

    localStorage.setItem('registeredUserId', idToUse);

    try {
      const user = await this.getUserById(+idToUse);
      if (user && role && !user.role) {
        user.role = role;
      }

      if (role) {
        document.cookie = `userRole=${role}; path=/; max-age=86400; SameSite=Strict`;
      }

      return user;
    } catch (e) {
      console.error('[Auth] Failed to fetch current user:', e);
      return null;
    }
  }

 
  public async getUserById(id: number): Promise<User | null> {
    try {
      const response = await apiService.get<User>(`/user/${id}`);
      if (response.isSuccess && response.value) {
        const user = response.value;
        console.log('[Auth] Got user from backend:', user);
        
        // Если бэкенд возвращает imageUrl, но не image, копируем imageUrl в image для совместимости
        if (user.imageUrl && !user.image) {
          user.image = user.imageUrl;
        }
        
        return user;
      }
      console.error('[Auth] Failed to get user:', response.error);
      return null;
    } catch (e) {
      console.error('[Auth] Error fetching user:', e);
      return null;
    }
  }

  
  public async updateUser(id: number, data: { name?: string; address?: string; password?: string }): Promise<boolean> {
    try {
      const response = await apiService.put<void>(`/user/${id}`, { id, ...data });
      return response.isSuccess;
    } catch (e) {
      console.error('[Auth] Error updating user:', e);
      return false;
    }
  }

 
  public async logout(): Promise<boolean> {
    const token = apiService.getToken();
    const response = await apiService.post<void>('/user/logout', { token });
    apiService.logout();
    return response.isSuccess;
  }

  
  public async confirmEmail(token: string, returnUrl: string): Promise<boolean> {
    const response = await apiService.get<void>(`/user/confirm-email/${token}`, { returnUrl });
    return response.isSuccess;
  }

  
  public async updateRefreshToken(token: string, refreshToken: string): Promise<boolean> {
    const response = await apiService.post<void>('/user/update-refresh-token', { token, refreshToken });
    return response.isSuccess;
  }

 
  private decodeToken(token: string): { userId: string | null; role: UserRole | null } {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return { userId: null, role: null };

      const payload = JSON.parse(atob(parts[1]));
      const userId = payload.sub || null;

      const roleStr = payload[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ] || payload.role;

      let role: UserRole | null = null;
      if (roleStr === 'Admin') role = UserRole.Admin;
      else if (roleStr === 'User') role = UserRole.User;

      return { userId, role };
    } catch (e) {
      console.error('[Auth] Error decoding token:', e);
      return { userId: null, role: null };
    }
  }

 public async getAllUsers(): Promise<User[] | null> {
  try {
    const response = await apiService.get<{
      value: User[];
      error: string | null;
      isSuccess: boolean;
      isFailure: boolean;
    }>('/user');

    console.log('getAllUsers response:', response);

    if (response.isSuccess && response.value) {
      console.log('Users array:', response.value);
      return response.value.value;
    }

    console.error('Не удалось получить всех пользователей:', response.error);
    return null;
  } catch (error) {
    console.error('Ошибка при получении всех пользователей:', error);
    return null;
  }
}

/**
 * Uploads a user profile image
 * @param request The upload request containing userId and file
 * @returns The response with image URL or null if failed
 */
public async uploadUserImage(request: UploadUserImageRequest): Promise<UploadUserImageResponse | null> {
  try {
    console.log('[Auth] Uploading user image for user ID:', request.userId);

    // Создаём форму для multipart/form-data
    const formData = new FormData();
    formData.append('ImageFile', request.file); // ← ключевой момент: именно 'ImageFile', как в C#

    const token = apiService.getToken();
    const headers: HeadersInit = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['x-auth-token'] = token;
    }

    console.log('[Auth] Sending image upload request with token:', token ? 'Present' : 'Missing');
    console.log('[Auth] File details - Name:', request.file.name, 'Type:', request.file.type, 'Size:', request.file.size);

    const response = await fetch('/api/user/upload-image', {
      method: 'POST',
      headers, // Не добавляем Content-Type вручную — браузер установит boundary сам
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Auth] Failed to upload user image:', response.status, response.statusText);
      console.error('[Auth] Error details:', errorText);

      try {
        const errorData = JSON.parse(errorText);
        console.error('[Auth] Parsed error:', errorData);
      } catch (e) {
        // Ошибка при парсинге JSON, логируем текст
      }

      return null;
    }

    const data = await response.json();
    console.log('[Auth] Image upload successful:', data);

    // Бэкенд возвращает URL изображения напрямую или в объекте
    const imageUrl = typeof data === 'string' ? data : data.imageUrl || data.value;
    
    if (!imageUrl) {
      console.error('[Auth] No image URL in response:', data);
      return null;
    }

    console.log('[Auth] Extracted image URL:', imageUrl);

    return {
      imageUrl,
      success: true
    };
  } catch (error) {
    console.error('[Auth] Error uploading user image:', error);
    return null;
  }
}



}

export const authService = AuthService.getInstance();
