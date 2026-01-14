

import { User, UserRole } from '../types/user';
import { Product } from '../types/product';
import { Category } from '../types/category';
import { Cart } from '../types/cart';
import { CartItem } from '../types/cartItem';
import { Order, OrderCalculationDto } from '../types/order';


const API_BASE_URL = '/api';

const TOKEN_STORAGE_KEY = 'token';

 
export interface ApiResponse<T> {
  value: T | null;
  error: string | null;
  isSuccess: boolean;
  isFailure: boolean;
}
 
function success<T>(value: T): ApiResponse<T> {
  return {
    value,
    error: null,
    isSuccess: true,
    isFailure: false
  };
}

 
function failure<T>(error: string): ApiResponse<T> {
  return {
    value: null,
    error,
    isSuccess: false,
    isFailure: true
  };
}

 
export interface AddProductRequest {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId: number;
  quantity: number;
  isInStock: boolean;
}

export interface UpdateProductRequest {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId: number;
  quantity: number;
  isInStock: boolean;
}

export interface GetProductsRequest {
  categoryId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}


export interface AddCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest {
  id: number;
  name: string;
  description?: string;
}


export interface AddCartItemRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  id: number;
  quantity: number;
}


export interface AddFavoriteRequest {
  productId: number;
}

// Order
export interface CreateOrderRequest {
  userId: number;
  items: {
    productId: number;
    quantity: number;
  }[];
  shippingAddress: string;
}

export interface UpdateOrderStatusRequest {
  id: number;
  status: string;
}

// Review
export interface AddProductReviewRequest {
  productId: number;
  rating: number;
  comment: string;
}

export interface UpdateProductReviewRequest {
  id: number;
  rating: number;
  comment: string;
}

// Image Upload
export interface UploadImageRequest {
  file: File;
}

export interface UploadUserImageRequest {
  userId: number;
  file: File;
}

// Response models
export interface ImageUploadResponse {
  imageUrl: string;
  message: string;
}

export interface OrderStatistics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number; // Средняя стоимость заказа
  pendingOrders: number;
  completedOrders: number;
  uniqueUsers: number;
  averageCheck: number; // Среднее количество товаров в заказе
}

export interface TopProduct {
  id: number;
  name: string;
  totalSold: number;
  revenue: number;
  imageUrl?: string;
}

/**
 * API Client class
 */
class ApiClient {
  private token: string | null = null;

  constructor() {
    // Initialize token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_STORAGE_KEY);
    }
  }

  /**
   * Set the authentication token
   */
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
  }

  /**
   * Get the current authentication token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Clear the authentication token (for logout)
   */
  clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }

  /**
   * Ensure token is up-to-date from localStorage (for client-side calls)
   */
  ensureTokenFromStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (stored && stored !== this.token) {
        this.token = stored;
      }
    }
  }

  /**
   * Create headers for API requests
   */
  private createHeaders(includeContentType: boolean = true): HeadersInit {
    const headers: HeadersInit = {};
    
    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  /**
   * Make an API request
   */
  private async request<T>(
    endpoint: string,
    method: string = 'GET',
    body?: any,
    isFormData: boolean = false
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const headers = this.createHeaders(!isFormData);
      
      const options: RequestInit = {
        method,
        headers,
        credentials: 'include'
      };
      
      if (body) {
        if (isFormData) {
          options.body = body;
        } else {
          options.body = JSON.stringify(body);
        }
      }
      
      const response = await fetch(url, options);
      
      // Handle 204 No Content
      if (response.status === 204) {
        return success<T>(undefined as T);
      }
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') === -1) {
        if (!response.ok) {
          return failure<T>(`Request failed with status: ${response.status}`);
        }
        // For non-JSON successful responses, return an empty success response
        return success({} as T);
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.error || data.message || 'Unknown error occurred';
        return failure<T>(errorMessage);
      }
      
      return success<T>(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return failure<T>(errorMessage);
    }
  }

  // ===== Product Endpoints =====

  /**
   * Get a product by ID
   */
  async getProduct(id: number): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/product/${id}/`);
  }

  /**
   * Get filtered products
   */
  async getProducts(params: GetProductsRequest): Promise<ApiResponse<Product[]>> {
    const queryParams = new URLSearchParams();
    
    if (params.categoryId) queryParams.append('categoryId', params.categoryId.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `/product/${queryString ? `?${queryString}` : ''}`;
    
    return this.request<Product[]>(endpoint);
  }

  /**
   * Get all products
   */
  async getAllProducts(): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>('/product/all/');
  }

  /**
   * Add a new product (Admin only)
   */
  async addProduct(product: AddProductRequest): Promise<ApiResponse<Product>> {
    return this.request<Product>('/product/', 'POST', {
      ...product,
      // Map isInStock to isAvailable for the backend API
      isAvailable: product.isInStock
    });
  }

  /**
   * Update a product (Admin only)
   */
  async updateProduct(product: UpdateProductRequest): Promise<ApiResponse<Product>> {
    return this.request<Product>('/product/', 'PUT', {
      ...product,
      // Map isInStock to isAvailable for the backend API
      isAvailable: product.isInStock
    });
  }

  /**
   * Delete a product (Admin only)
   */
  async deleteProduct(id: number): Promise<ApiResponse<void>> {
    return this.request<void>('/product/', 'DELETE', { id });
  }

  /**
   * Upload a product image (Admin only)
   */
  async uploadProductImage(request: UploadImageRequest): Promise<ApiResponse<ImageUploadResponse>> {
    const formData = new FormData();
    formData.append('file', request.file);
    
    return this.request<ImageUploadResponse>('/product/upload-image', 'POST', formData, true);
  }

  // ===== Category Endpoints =====

  /**
   * Get a category by ID
   */
  async getCategory(id: number): Promise<ApiResponse<Category>> {
    return this.request<Category>(`/category/${id}`);
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>('/category/');
  }

  /**
   * Add a new category (Admin only)
   */
  async addCategory(category: AddCategoryRequest): Promise<ApiResponse<Category>> {
    return this.request<Category>('/category/', 'POST', category);
  }

  /**
   * Delete a category (Admin only)
   */
  async deleteCategory(id: number): Promise<ApiResponse<void>> {
    return this.request<void>('/category/', 'DELETE', { id });
  }

  // ===== CartItem Endpoints =====

  /**
   * Add a product to cart
   */
  async addCartItem(item: AddCartItemRequest): Promise<ApiResponse<CartItem>> {
    return this.request<CartItem>('/cart-item/', 'POST', item);
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(item: UpdateCartItemRequest): Promise<ApiResponse<CartItem>> {
    return this.request<CartItem>('/cart-item/', 'PUT', item);
  }

  /**
   * Remove a cart item
   */
  async removeCartItem(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/cart-item/${id}`, 'DELETE');
  }

  /**
   * Get a cart item
   */
  async getCartItem(id: number): Promise<ApiResponse<CartItem>> {
    return this.request<CartItem>(`/cart-item/${id}`);
  }

  // ===== Cart Endpoints =====

  /**
   * Get the user's cart
   */
  async getCart(): Promise<ApiResponse<Cart>> {
    console.log('[ApiClient] Getting cart...');
    const response = await this.request<Cart>('/cart/');
    console.log('[ApiClient] Cart response:', response);
    return response;
  }

  /**
   * Clear the user's cart
   */
  async clearCart(): Promise<ApiResponse<void>> {
    return this.request<void>('/cart/', 'POST');
  }

  // ===== Favorite Endpoints =====

  /**
   * Get user's favorites
   */
  async getFavorites(): Promise<ApiResponse<any>> {
    return this.request<any>('/favorite/');
  }

  /**
   * Add a product to favorites
   */
  async addFavorite(request: AddFavoriteRequest): Promise<ApiResponse<void>> {
    return this.request<void>('/favorite/', 'POST', request);
  }

  /**
   * Remove a product from favorites
   */
  async removeFavorite(productId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/favorite/${productId}`, 'DELETE');
  }

  // ===== OrderItem Endpoints =====

  /**
   * Get order items
   */
  async getOrderItems(): Promise<ApiResponse<CartItem[]>> {
    return this.request<CartItem[]>('/orderitem/');
  }

  /**
   * Create order items
   */
  async createOrderItems(items: AddCartItemRequest[]): Promise<ApiResponse<CartItem[]>> {
    return this.request<CartItem[]>('/orderitem/', 'POST', items);
  }

  /**
   * Create simple order (without discounts)
   */
  async createOrder(cartId: number): Promise<ApiResponse<OrderCalculationDto>> {
    return this.request<OrderCalculationDto>('/orderitem/', 'POST', { cartId });
  }

  /**
   * Create order with discounts
   */
  async createOrderWithDiscounts(cartId: number, couponCode?: string, promoCode?: string): Promise<ApiResponse<OrderCalculationDto>> {
    return this.request<OrderCalculationDto>('/order/create-with-discounts', 'POST', { 
      cartId, 
      couponCode, 
      promoCode 
    });
  }

  /**
   * Calculate cart discounts
   */
  async calculateCartDiscounts(cartId: number, couponCode?: string, promoCode?: string): Promise<ApiResponse<OrderCalculationDto>> {
    return this.request<OrderCalculationDto>('/order/calculate-discounts', 'POST', { 
      cartId, 
      couponCode, 
      promoCode 
    });
  }

  // ===== Order Endpoints =====

  /**
   * Update order status (Admin only)
   */
  async updateOrderStatus(id: number, status: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/order/order-status/${id}`, 'PUT', { status });
  }

  /**
   * Get order history by user ID (Admin only)
   */
  async getOrderHistory(userId?: number): Promise<ApiResponse<Order[]>> {
    const queryParams = userId ? `?userId=${userId}` : '';
    return this.request<Order[]>(`/order/get-orderHistory${queryParams}`);
  }

  /**
   * Get orders for specific user
   */
  async getUserOrders(userId: number): Promise<ApiResponse<Order[]>> {
    return this.request<Order[]>(`/order/get-user-orders/${userId}`);
  }

  /**
   * Get top purchased products
   */
  async getTopProducts(limit?: number): Promise<ApiResponse<TopProduct[]>> {
    const queryParams = limit ? `?limit=${limit}` : '';
    return this.request<TopProduct[]>(`/order/get-top-products${queryParams}`);
  }

  /**
   * Get order statistics (Admin only)
   */
  async getOrderStatistics(startDate?: string, endDate?: string): Promise<ApiResponse<OrderStatistics>> {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    const queryString = queryParams.toString();
    const endpoint = `/order/get-order-statistics${queryString ? `?${queryString}` : ''}`;
    
    return this.request<OrderStatistics>(endpoint);
  }

  async getProductReviews(productId: number): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/productreviews/${productId}`);
  }

  
  async addProductReview(review: AddProductReviewRequest): Promise<ApiResponse<any>> {
    return this.request<any>('/productreviews/', 'POST', review);
  }


  async updateProductReview(review: UpdateProductReviewRequest): Promise<ApiResponse<any>> {
    return this.request<any>('/productreviews/', 'PUT', review);
  }

 
  async deleteProductReview(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/productreviews/${id}`, 'DELETE');
  }


  async getTopRatedProducts(): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>('/productreviews/top-rated');
  }

  async uploadUserImage(request: UploadUserImageRequest): Promise<ApiResponse<ImageUploadResponse>> {
    const formData = new FormData();
    formData.append('userId', request.userId.toString());
    formData.append('file', request.file);
    
    return this.request<ImageUploadResponse>('/user/upload-image', 'POST', formData, true);
  }
}

// Create a singleton instance of the API client
export const apiClient = new ApiClient();

// Export types
export type {
  Product,
  Category,
  Cart,
  CartItem,
  Order,
  User,
  UserRole
};
