import { apiService } from './api';
import { Cart } from '../types';

export class CartService {
  private static instance: CartService;

  private constructor() {}
 
  public static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
  }

  private async getProductDetails(productId: number) {
    try {
      const response = await apiService.get<any>(`/product/${productId}`);
      if (response.isSuccess && response.value) {
        let productData = response.value;
        if (response.value.value && typeof response.value.value === 'object') {
          productData = response.value.value;
        }
        return productData;
      }
    } catch (error) {
      console.error('[CartService] Error fetching product details:', error);
    }
    return null;
  }

  public async getCartById(id: number): Promise<Cart | null> {
    const response = await apiService.get<any>(`/cart`);
    if (response.isSuccess && response.value) {
      if (response.value.value) {
        const cartData = response.value.value;
        const processedItems = await Promise.all((cartData.cartItemsDto || []).map(async (item: any) => {
          const product = item.product || item.Product;
          const price = product?.price || product?.Price || 0;
          const quantity = item.quantity || item.Quantity || 0;
          const totalSum = price * quantity;
          const imageUrl = product?.imageUrl || product?.ImageUrl || null;
          const productId = product?.id || product?.Id || item.productId || item.ProductId;
          
          // Всегда получаем актуальные данные о товаре с сервера
          let actualStock = 0;
          let available = 0;
          if (productId) {
            const productDetails = await this.getProductDetails(productId);
            if (productDetails) {
              actualStock = productDetails.quantity || productDetails.Quantity || productDetails.quantityInStock || 0;
              available = actualStock + quantity;
            }
          }
          
          const finalQuantity = typeof quantity === 'string' ? parseInt(quantity) || 0 : (quantity || 0);
          const finalPrice = typeof price === 'string' ? parseFloat(price) || 0 : (price || 0);
          const finalTotalSum = finalPrice * finalQuantity;
          
          const processedItem = {
            id: item.id || item.Id,
            productId: productId,
            productName: product?.name || product?.Name || item.productName || 'Unknown Product',
            price: finalPrice,
            totalSum: finalTotalSum,
            stock: available,
            available: available,
            quantity: finalQuantity,
            imageUrl: imageUrl
          };
          return processedItem;
        }));
        const validItems = processedItems;
        const mappedCart = {
          id: cartData.userId || cartData.UserId || id,
          userId: id,
          items: validItems,
          totalSum: validItems.reduce((sum, item) => sum + item.totalSum, 0)
        };
        return mappedCart;
      } else {
        const processedItems = await Promise.all((response.value.items || response.value.cartItemsDto || []).map(async (item: any) => {
          const product = item.product || item.Product;
          const price = product?.price || product?.Price || 0;
          const quantity = item.quantity || item.Quantity || 0;
          const totalSum = price * quantity;
          const imageUrl = product?.imageUrl || product?.ImageUrl || null;
          const productId = product?.id || product?.Id || item.productId || item.ProductId;
          
          // Всегда получаем актуальные данные о товаре с сервера
          let actualStock = 0;
          let available = 0;
          if (productId) {
            const productDetails = await this.getProductDetails(productId);
            if (productDetails) {
              actualStock = productDetails.quantity || productDetails.Quantity || productDetails.quantityInStock || 0;
              available = actualStock + quantity;
            }
          }
          
          const finalQuantity = typeof quantity === 'string' ? parseInt(quantity) || 0 : (quantity || 0);
          const finalPrice = typeof price === 'string' ? parseFloat(price) || 0 : (price || 0);
          const finalTotalSum = finalPrice * finalQuantity;
          
          const processedItem = {
            id: item.id || item.Id,
            productId: productId,
            productName: product?.name || product?.Name || item.productName || 'Unknown Product',
            price: finalPrice,
            totalSum: finalTotalSum,
            stock: available,
            available: available,
            quantity: finalQuantity,
            imageUrl: imageUrl
          };
          return processedItem;
        }));
        const validItems = processedItems;
        const mappedCart = {
          id: response.value.userId || response.value.UserId || id,
          userId: id,
          items: validItems,
          totalSum: validItems.reduce((sum, item) => sum + item.totalSum, 0)
        };
        return mappedCart;
      }
    }
    return null;
  }

  public async createCart(id: number): Promise<boolean> {
    const response = await apiService.post<void>(`/cart?Id=${id}`, {});
    return response.isSuccess;
  }

  public async clearCart(id: number): Promise<boolean> {
    try {
      const response = await this.createCart(id);
      return response;
    } catch (error) {
      console.error('[Cart] Clear cart error:', error);
      return false;
    }
  }
}

export const cartService = CartService.getInstance();
