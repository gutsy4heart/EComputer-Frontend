import { ApiResponse } from '../types';

const API_URL = '';  
const API_PREFIX = '/api';  
const TOKEN_REFRESH_INTERVAL = 4 * 60 * 1000;  

console.log('[API] Configuration:', {
  API_URL,
  API_PREFIX,
  fullBaseUrl: `${API_URL}${API_PREFIX}`,
});

export class ApiService {
  private static instance: ApiService;
  private refreshTokenInterval: NodeJS.Timeout | null = null;

  private constructor() {}
 
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private createHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    console.log(`[API] Processing response: ${response.url}, Status: ${response.status}`);
    
    if (!response.ok) {
      
      const token = this.getToken();
      if (token && token.startsWith('temp_token_')) {
        console.log('[API] Using temporary token, not refreshing or logging out');
        return this.processError(response);
      }
      
      if (response.status === 401) {
        console.log('[API] Unauthorized request, attempting token refresh');
        const refreshToken = this.getRefreshToken();
        if (refreshToken) {
          const newToken = await this.refreshToken(refreshToken);
          if (newToken) {
            this.setToken(newToken);
            console.log('[API] Token refreshed successfully');
            return { isSuccess: false, error: 'Token expired. Please retry your request.' };
          }
        }
        console.log('[API] Token refresh failed, logging out');
        this.logout();
      }
      
      return this.processError(response);
    }

    return this.processSuccess(response);
  }

  private async processSuccess<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const responseText = await response.text();
      console.log(`[API] Success response body: ${responseText}`);
      
      if (!responseText.trim()) {
        return { isSuccess: true, value: {} as T };  
      }

      const data = JSON.parse(responseText);
      return { isSuccess: true, value: data };
    } catch (error) {
      console.error('[API] Error parsing success response:', error);
      return { isSuccess: true, value: {} as T };  
    }
  }
 
private async processError(response: Response) {
  try {
   
    const textBody = await response.text();
    
    try {
       
      const jsonBody = JSON.parse(textBody);
      console.error('[API] Error response (JSON):', jsonBody);
      return jsonBody.message || jsonBody.title || 'Unknown error';
    } catch {
    
      console.error('[API] Error response (text):', textBody);
      
    
      if (textBody.includes('SmtpException')) {
        return 'Email service is currently unavailable. Please try again later.';
      }
      
      return textBody || `Error: ${response.status} ${response.statusText}`;
    }
  } catch (err) {
    console.error('[API] Failed to process error:', err);
    return `Error: ${response.status} ${response.statusText}`;
  }
}

  public async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      console.log(`[API] GET request to: ${url}`);
      console.log(`[API] Parameters:`, params);
      console.log(`[API] Current token:`, this.getToken());
      console.log(`[API] Registered user ID:`, localStorage.getItem('registeredUserId'));
    
      if (url.startsWith('/user/') && url === '/user/1') {
        console.log('[API] Special handling for /user/1');
        const registeredUserId = localStorage.getItem('registeredUserId');
        if (registeredUserId) {
          url = `/user/${registeredUserId}`;
          console.log(`[API] Using registered user ID (${registeredUserId}) instead of default ID 1`);
        } else {
          console.log('[API] No registered user ID found in localStorage');
          
          const token = this.getToken();
          if (token && token.startsWith('temp_token_')) {
            console.log('[API] Using temporary token, returning mock user response');
            return { 
              isSuccess: true, 
              value: { 
                id: 0, 
                name: 'New User', 
                email: '', 
                role: 0 
              } as any 
            };
          }
        }
      }
      
      const prefixedUrl = url.startsWith(API_PREFIX) ? url : `${API_PREFIX}${url}`;
      const queryString = new URLSearchParams(params).toString();
      const fullUrl = `${API_URL}${prefixedUrl}${queryString ? `?${queryString}` : ''}`;
      
      console.log(`[API] Making GET request to: ${fullUrl}`);
      console.log(`[API] Query string: ${queryString}`);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: this.createHeaders(),
        credentials: 'include',
      });
      
      console.log(`[API] Response status: ${response.status}`);
      console.log(`[API] Response headers:`, Object.fromEntries(response.headers.entries()));
      
      return this.handleResponse<T>(response);
    } catch (error: any) {
      console.error('[API] GET request failed:', error);
      return { isSuccess: false, error: error.message || 'Unknown error' };
    }
  }

  public async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const prefixedUrl = url.startsWith(API_PREFIX) ? url : `${API_PREFIX}${url}`;
      const fullUrl = `${API_URL}${prefixedUrl}`;
      
      console.log(`[API] Making POST request to: ${fullUrl}`, data);
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          ...this.createHeaders(),
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
        body: data ? JSON.stringify(data) : undefined,
        mode: 'cors',
        credentials: 'include',
      });
      
      return this.handleResponse<T>(response);
    } catch (error: any) {
      console.error('[API] POST request failed:', error);
      return { isSuccess: false, error: error.message || 'Unknown error' };
    }
  }

  public async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const prefixedUrl = url.startsWith(API_PREFIX) ? url : `${API_PREFIX}${url}`;
      const fullUrl = `${API_URL}${prefixedUrl}`;
      
      console.log(`[API] Making PUT request to: ${fullUrl}`, data);
      
      const response = await fetch(fullUrl, {
        method: 'PUT',
        headers: this.createHeaders(),
        body: data ? JSON.stringify(data) : undefined,
        credentials: 'include',
      });
      
      return this.handleResponse<T>(response);
    } catch (error: any) {
      console.error('[API] PUT request failed:', error);
      return { isSuccess: false, error: error.message || 'Unknown error' };
    }
  }

  public async delete<T>(url: string, params?: Record<string, any>, body?: any): Promise<ApiResponse<T>> {
    try {
      const prefixedUrl = url.startsWith(API_PREFIX) ? url : `${API_PREFIX}${url}`;
      const queryString = params ? new URLSearchParams(params).toString() : '';
      const fullUrl = `${API_URL}${prefixedUrl}${queryString ? `?${queryString}` : ''}`;
      
      console.log(`[API] Making DELETE request to: ${fullUrl}`, body);
      
      const response = await fetch(fullUrl, {
        method: 'DELETE',
        headers: this.createHeaders(),
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include',
      });
      
      return this.handleResponse<T>(response);
    } catch (error: any) {
      console.error('[API] DELETE request failed:', error);
      return { isSuccess: false, error: error.message || 'Unknown error' };
    }
  }

  public setToken(token: string): void {
    console.log('[API] Setting token:', token ? 'Present' : 'Missing');
    localStorage.setItem('token', token);
    document.cookie = `accessToken=${token}; path=/; max-age=86400; SameSite=Strict`;
  }

  public getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('[API] Getting token:', token ? 'Present' : 'Missing');
    return token;
  }

  public setRefreshToken(refreshToken: string): void {
    console.log('[API] Setting refresh token');
    localStorage.setItem('refreshToken', refreshToken);
  }

  public getRefreshToken(): string | null {
    const refreshToken = localStorage.getItem('refreshToken');
    console.log('[API] Getting refresh token:', refreshToken ? 'Present' : 'Missing');
    return refreshToken;
  }

  private async refreshToken(refreshToken: string): Promise<string | null> {
    try {
      const response = await fetch(`${API_URL}${API_PREFIX}/user/update-refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (!response.ok) {
        console.error(`[API] Token refresh failed: ${response.status} ${response.statusText}`);
        return null;
      }
      
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('[API] Error refreshing token:', error);
      return null;
    }
  }

  public startTokenRefresh(): void {
    this.stopTokenRefresh();
    
    this.refreshTokenInterval = setInterval(async () => {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        const newToken = await this.refreshToken(refreshToken);
        if (newToken) {
          this.setToken(newToken);
        } else {
          this.logout();
        }
      }
    }, TOKEN_REFRESH_INTERVAL);
  }

  public stopTokenRefresh(): void {
    if (this.refreshTokenInterval) {
      clearInterval(this.refreshTokenInterval);
      this.refreshTokenInterval = null;
    }
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('registeredUserId');
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
    document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
    this.stopTokenRefresh();
    window.location.href = '/';
  }


}

export const apiService = ApiService.getInstance();
