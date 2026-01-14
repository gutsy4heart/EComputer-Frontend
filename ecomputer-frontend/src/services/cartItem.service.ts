 
import { apiService } from './api';
import { CartItem, AddCartItemRequest, UpdateCartItemRequest } from '../types';

export class CartItemService {
  private static instance: CartItemService;

  private constructor() {}

 
  public static getInstance(): CartItemService {
    if (!CartItemService.instance) {
      CartItemService.instance = new CartItemService();
    }
    return CartItemService.instance;
  }

 
  public async getCartItemById(id: number): Promise<CartItem | null> {
    const response = await apiService.get<CartItem>(`/cart-item/${id}`);
    
    if (response.isSuccess && response.value) {
      return response.value;
    }
    
    return null;
  }

 
  public async addProductToCart(cartItemData: AddCartItemRequest): Promise<boolean> {
    const response = await apiService.post<void>('/cart-item', cartItemData);
    return response.isSuccess;
  }

 
  public async updateCartItemQuantity(updateData: UpdateCartItemRequest): Promise<boolean> {
    const response = await apiService.put<void>('/cart-item', updateData);
    return response.isSuccess;
  }

  
  public async removeCartItem(cartItemId: number): Promise<boolean> {
    try {
    
      if (!cartItemId || isNaN(cartItemId)) {
        console.error('Invalid cartItemId provided:', cartItemId);
        throw new Error('Invalid cartItemId provided');
      }
  
      console.log('Removing cart item with ID:', cartItemId);
      
      const response = await apiService.delete<{ success: boolean }>(
        `/cart-item/${cartItemId}`  
      );
  
  
      if (!response.isSuccess) {
        console.error('Failed to remove cart item:', response.error);
        return false;
      }
  
      console.log('Cart item removed successfully');
      return true;
      
    } catch (error) {
      console.error('Error removing cart item:', error);
      return false;
    }
  }
}
 
export const cartItemService = CartItemService.getInstance();
