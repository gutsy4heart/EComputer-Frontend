import { apiService } from './api';
import { apiClient } from './api-client';
import { 
  Order, 
  OrderItem,
  CreateOrderRequest, 
  UpdateOrderRequest, 
  OrderStatus,
  OrderCalculationDto,
  CalculateDiscountsRequest,
  CreateOrderWithDiscountsRequest
} from '../types';

// Define interfaces for the new admin-specific methods
export interface OrderStatistics {
  totalOrders: number;
  totalRevenue: number;
  totalOriginalRevenue?: number;
  totalSavings?: number;
  discountPercentage?: number;
  ordersWithDiscounts?: number;
  ordersWithCoupons?: number;
  ordersWithPromoCodes?: number;
  averageDiscountPerOrder?: number;
  averageOrderValue: number; // Средняя стоимость заказа
  pendingOrders: number;
  completedOrders: number;
  uniqueUsers: number;
  averageCheck: number; // Среднее количество товаров в заказе
  totalItems?: number;
  discountStatistics?: DiscountStatistics;
  couponStatistics?: CouponStatistics;
  promoCodeStatistics?: PromoCodeStatistics;
}

export interface DiscountStatistics {
  totalDiscountsUsed: number;
  totalDiscountAmount: number;
  averageDiscountAmount: number;
  topDiscounts: any[];
}

export interface CouponStatistics {
  totalCouponsUsed: number;
  totalCouponAmount: number;
  averageCouponAmount: number;
  topCoupons: any[];
}

export interface PromoCodeStatistics {
  totalPromoCodesUsed: number;
  totalPromoCodeAmount: number;
  averagePromoCodeAmount: number;
  topPromoCodes: any[];
}

export interface TopProduct {
  id: number;
  name: string;
  totalSold: number;
  revenue: number;
  imageUrl?: string;
}

export class OrderService {
  private static instance: OrderService;

  private constructor() {}

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  // Новые методы для работы со скидками
  public async calculateCartDiscounts(request: CalculateDiscountsRequest): Promise<OrderCalculationDto> {
    try {
      console.log('[OrderService] Calculating cart discounts:', request);
      
      const response = await apiService.post<OrderCalculationDto>('/order/calculate-discounts', request);
      
      console.log('[OrderService] Calculate discounts response:', response);
      
      if (response.isSuccess && response.value) {
        return response.value;
      }
      
      throw new Error(response.error || 'Failed to calculate discounts');
    } catch (error) {
      console.error('[OrderService] Error calculating discounts:', error);
      throw error;
    }
  }

  public async createOrder(request: CreateOrderRequest): Promise<OrderCalculationDto> {
    try {
      console.log('[OrderService] Creating order:', request);
      
      const response = await apiService.post<OrderCalculationDto>('/orderitem/', request);
      
      console.log('[OrderService] Create order response:', response);
      
      if (response.isSuccess && response.value) {
        return response.value;
      }
      
      throw new Error(response.error || 'Failed to create order');
    } catch (error) {
      console.error('[OrderService] Error creating order:', error);
      throw error;
    }
  }

  public async createOrderWithDiscounts(request: CreateOrderWithDiscountsRequest): Promise<OrderCalculationDto> {
    try {
      console.log('[OrderService] Creating order with discounts:', request);
      
      const response = await apiService.post<OrderCalculationDto>('/order/create-with-discounts', request);
      
      console.log('[OrderService] Create order with discounts response:', response);
      
      if (response.isSuccess && response.value) {
        return response.value;
      }
      
      throw new Error(response.error || 'Failed to create order with discounts');
    } catch (error) {
      console.error('[OrderService] Error creating order with discounts:', error);
      throw error;
    }
  }

  public async getOrders(): Promise<Order[]> {
    try {
      console.log('[OrderService] Getting all orders...');
      
      // Используем backend API endpoint для получения истории заказов
      const response = await apiService.get<any>('/order/get-orderHistory');
      
      console.log('[OrderService] API response:', response);
      
      if (response.isSuccess && response.value) {
        // Handle different response structures
        let ordersData;
        if (response.value.value && Array.isArray(response.value.value)) {
          ordersData = response.value.value;
        } else if (Array.isArray(response.value)) {
          ordersData = response.value;
        } else {
          console.log('[OrderService] Unexpected response structure:', response.value);
          return [];
        }
        
        console.log('[OrderService] Orders data:', ordersData);
        return await this.mapOrderHistoryResponse(ordersData);
      }
      
      console.log('[OrderService] No orders found or error:', response.error);
      return [];
    } catch (error) {
      console.error('[OrderService] Error getting orders:', error);
      return [];
    }
  }
 
  public async getOrdersByUserId(userId: number): Promise<Order[]> {
    try {
      console.log(`[OrderService] Getting orders for user ${userId}`);
      
      // Используем backend endpoint для получения заказов пользователя
      const response = await apiService.get<any>(`/order/get-user-orders/${userId}`);
      
      console.log(`[OrderService] API response:`, response);
      
      if (response.isSuccess && response.value) {
        console.log(`[OrderService] Found ${response.value.length} orders for user ${userId}`);
        console.log(`[OrderService] Orders data:`, response.value);
        // Используем mapOrderHistoryResponse для правильного маппинга дат
        return await this.mapOrderHistoryResponse(response.value);
      }
      
      console.log(`[OrderService] No orders found or error:`, response.error);
      return [];
    } catch (error) {
      console.error('[OrderService] Error getting user orders:', error);
      return [];
    }
  }
 
  public async getOrderById(id: number): Promise<Order | null> {
    try {
      console.log(`[OrderService] Getting order by ID: ${id}`);
      
      // Используем backend API endpoint
      const response = await apiService.get<any>(`/order/${id}`);
      
      console.log(`[OrderService] API response:`, response);
      
      if (response.isSuccess && response.value) {
        // Handle the response structure from backend
        let orderData;
        if (response.value.value) {
          orderData = response.value.value;
        } else {
          orderData = response.value;
        }
        
        console.log(`[OrderService] Order data:`, orderData);
        
        // Map the order data using the same logic as mapOrderHistoryResponse
        if (orderData) {
          const mappedOrders = await this.mapOrderHistoryResponse([orderData]);
          const mappedOrder = mappedOrders.length > 0 ? mappedOrders[0] : null;
          console.log(`[OrderService] Mapped order:`, mappedOrder);
          return mappedOrder;
        }
      }
      
      console.log(`[OrderService] Order not found or error:`, response.error);
      return null;
    } catch (error) {
      console.error('[OrderService] Error getting order:', error);
      return null;
    }
  }

  // Специальный метод для админов - получает заказ из истории всех заказов
  public async getOrderByIdForAdmin(id: number): Promise<Order | null> {
    try {
      console.log(`[OrderService] Getting order by ID for admin: ${id}`);
      
      // Используем get-orderHistory endpoint для получения всех заказов
      const response = await apiService.get<any>('/order/get-orderHistory');
      
      console.log(`[OrderService] OrderHistory API response:`, response);
      
      if (response.isSuccess && response.value) {
        // Handle different response structures
        let ordersData;
        if (response.value.value && Array.isArray(response.value.value)) {
          ordersData = response.value.value;
        } else if (Array.isArray(response.value)) {
          ordersData = response.value;
        } else {
          console.log('[OrderService] Unexpected response structure:', response.value);
          return null;
        }
        
        console.log(`[OrderService] Found ${ordersData.length} orders in history`);
        
        // Ищем нужный заказ по ID
        const order = ordersData.find((o: any) => o.id === id || o.orderId === id);
        
        if (order) {
          console.log(`[OrderService] Found order in history:`, order);
          
          // Map the order data using the same logic as mapOrderHistoryResponse
          const mappedOrders = await this.mapOrderHistoryResponse([order]);
          const mappedOrder = mappedOrders.length > 0 ? mappedOrders[0] : null;
          console.log(`[OrderService] Mapped order for admin:`, mappedOrder);
          return mappedOrder;
        } else {
          console.log(`[OrderService] Order ${id} not found in order history`);
          return null;
        }
      }
      
      console.log(`[OrderService] No orders found or error:`, response.error);
      return null;
    } catch (error) {
      console.error('[OrderService] Error getting order for admin:', error);
      return null;
    }
  }

  // Метод для получения заказа с категорией продукта (использует тот же endpoint, но с правильным маппингом)
  public async getOrderByIdWithCategory(id: number): Promise<Order | null> {
    try {
      console.log(`[OrderService] Getting order by ID with category: ${id}`);
      
      // Используем тот же endpoint, но с правильным маппингом
      const response = await apiService.get<any>(`/order/${id}`);
      
      console.log(`[OrderService] API response:`, response);
      
      if (response.isSuccess && response.value) {
        // Handle the response structure from backend
        let orderData;
        if (response.value.value) {
          orderData = response.value.value;
        } else {
          orderData = response.value;
        }
        
        console.log(`[OrderService] Order data with category:`, orderData);
        console.log(`[OrderService] Order items:`, orderData.items);
        if (orderData.items && orderData.items.length > 0) {
          console.log(`[OrderService] First item product:`, orderData.items[0].product);
          console.log(`[OrderService] First item product category:`, orderData.items[0].product?.category);
        }
        
        // Map the order data using direct mapping (no additional API calls)
        if (orderData) {
          const mappedOrder = this.mapOrderFromGetOrderById(orderData);
          console.log(`[OrderService] Mapped order with category:`, mappedOrder);
          return mappedOrder;
        }
      }
      
      console.log(`[OrderService] Order not found or error:`, response.error);
      return null;
    } catch (error) {
      console.error('[OrderService] Error getting order with category:', error);
      return null;
    }
  }


  public async updateOrder(orderData: UpdateOrderRequest): Promise<boolean> {
    try {
      // Based on the backend route configuration, we should use the order-status endpoint for updating status
      if (orderData.status) {
        const statusValue = this.mapStatusStringToNumber(orderData.status);
        const response = await apiService.put<void>(`/order/order-status/${orderData.id}`, { status: statusValue });
        
        if (response.isSuccess) {
          return true;
        }
      }
      
      // For other updates, we'll use the Next.js API endpoint
      const fallbackResponse = await apiService.put<void>(`/order/${orderData.id}`, orderData);
      return fallbackResponse.isSuccess;
    } catch (error) {
      console.error('[OrderService] Error updating order:', error);
      return false;
    }
  }

  public async deleteOrder(id: number): Promise<boolean> {
    try {
      // Based on the backend route configuration, there's no specific endpoint for deleting an order
      // We'll use the Next.js API endpoint for this
      const response = await apiService.delete<void>(`/order/${id}`);
      return response.isSuccess;
    } catch (error) {
      console.error('[OrderService] Error deleting order:', error);
      return false;
    }
  }

  /**
   * Updates the status of an order (Admin only)
   * @param id Order ID
   * @param status New status
   * @returns Success status
   */
  public async updateOrderStatus(id: number, status: string): Promise<boolean> {
    try {
      console.log(`[OrderService] Updating order status: ID=${id}, Status=${status}`);
      
      // Convert string status to numeric if needed
      let statusValue: any = status;
      if (typeof status === 'string' && !isNaN(Number(status))) {
        statusValue = Number(status);
      } else {
        statusValue = this.mapStatusStringToNumber(status);
      }
      
      const payload = { status: statusValue };
      console.log('[OrderService] Update status payload:', payload);
      
      const response = await apiService.put<void>(`/order/order-status/${id}`, payload);
      
      console.log('[OrderService] Update status response:', response);
      
      return response.isSuccess;
    } catch (error) {
      console.error('[OrderService] Error updating order status:', error);
      return false;
    }
  }

  /**
   * Gets order history by user ID (Admin only)
   * @param userId User ID
   * @returns Order history
   */
  public async getOrderHistory(userId?: number): Promise<Order[]> {
    try {
      // The backend requires a userId parameter, so we need to ensure it's always provided
      // If no userId is provided, we'll use 1 as a default (assuming it's the admin user)
      const userIdToUse = userId || 1;
      const url = `/order/get-orderHistory?userId=${userIdToUse}`;
      
      console.log('[OrderService] Getting order history with URL:', url);
      
      const response = await apiService.get<any>(url);
      
      console.log('[OrderService] Order history response:', response);
      
      // Check if the response has a nested value property (API response structure)
      if (response.isSuccess && response.value && response.value.value) {
        // The API returns { value: [...orders], isSuccess: true }
        return await this.mapOrderHistoryResponse(response.value.value);
      }
      
      // Direct response structure
      if (response.isSuccess && response.value) {
        return await this.mapOrderHistoryResponse(response.value);
      }
      
      // If we get an error with "Заказы не найдены" (Orders not found), return an empty array
      if (response.error && (
          response.error === "Заказы не найдены." || 
          response.error.includes("Orders not found") ||
          response.error.includes("not found")
        )) {
        console.log('[OrderService] No orders found, returning empty array');
        return [];
      }
      
      return [];
    } catch (error) {
      console.error('[OrderService] Error getting order history:', error);
      return [];
    }
  }
  
  /**
   * Gets user information by ID
   * @param userId User ID
   * @returns User information or null
   */
  private async getUserById(userId: number): Promise<any> {
    try {
      const response = await apiService.get<any>(`/user/${userId}`);
      
      if (response.isSuccess && response.value) {
        return response.value;
      }
      
      return null;
    } catch (error) {
      console.error(`[OrderService] Error getting user ${userId}:`, error);
      return null;
    }
  }

  /**
   * Gets product information by ID
   * @param productId Product ID
   * @returns Product information or null
   */
  private async getProductById(productId: number): Promise<any> {
    try {
      console.log(`[OrderService] Getting product by ID: ${productId}`);
      const response = await apiService.get<any>(`/product/${productId}/`);
      console.log(`[OrderService] Product API response:`, response);
      console.log(`[OrderService] Response structure:`, {
        isSuccess: response.isSuccess,
        hasValue: !!response.value,
        valueType: typeof response.value,
        valueKeys: response.value ? Object.keys(response.value) : null
      });
      
      if (response.isSuccess && response.value) {
        console.log(`[OrderService] Product data:`, response.value);
        // Проверяем структуру ответа - возможно, данные в response.value.value
        if (response.value.value) {
          console.log(`[OrderService] Using nested value:`, response.value.value);
          return response.value.value;
        }
        console.log(`[OrderService] Using direct value:`, response.value);
        return response.value;
      }
      
      console.log(`[OrderService] Product not found or error:`, response.error);
      console.log(`[OrderService] Full response for debugging:`, response);
      return null;
    } catch (error) {
      console.error(`[OrderService] Error getting product ${productId}:`, error);
      return null;
    }
  }

  /**
   * Maps the order history response to the Order type
   * @param data The response data
   * @returns Mapped orders
   */
  private async mapOrderHistoryResponse(data: any[]): Promise<Order[]> {
    if (!Array.isArray(data)) {
      console.log('[OrderService] Data is not an array:', data);
      return [];
    }
    
    const orderPromises = data.map(async (item) => {
      
      // Обработка даты - согласно новому бэкенду это createdDate
      let createdDate = item.createdDate || item.CreatedDate || item.createdAt;
      console.log('[OrderService] Processing date for order', item.id, ':', {
        createdDate: item.createdDate,
        CreatedDate: item.CreatedDate,
        createdAt: item.createdAt,
        finalCreatedDate: createdDate
      });
      
      if (createdDate) {
        // Если дата в формате строки, пытаемся её распарсить
        if (typeof createdDate === 'string') {
          const parsedDate = new Date(createdDate);
          if (!isNaN(parsedDate.getTime())) {
            createdDate = parsedDate.toISOString();
            console.log('[OrderService] Successfully parsed date:', createdDate);
          } else {
            console.warn('[OrderService] Invalid date format:', createdDate);
            createdDate = new Date().toISOString(); // Fallback к текущей дате
          }
        } else if (createdDate instanceof Date) {
          createdDate = createdDate.toISOString();
          console.log('[OrderService] Date object converted:', createdDate);
        }
      } else {
        console.warn('[OrderService] No createdDate found, using current date');
        createdDate = new Date().toISOString(); // Fallback к текущей дате
      }
      
      // Обработка данных пользователя
      let user: any = undefined;
      if (item.user && typeof item.user === 'object') {
        user = {
          id: item.user.id || item.userId,
          name: item.user.name || 'Unknown',
          email: item.user.email || '',
          role: item.user.role || 0
        };
      } else if (item.userId) {
        // Получаем реальную информацию о пользователе через API
        const userData = await this.getUserById(item.userId);
        if (userData) {
          user = {
            id: userData.id || item.userId,
            name: userData.name || 'Unknown',
            email: userData.email || '',
            role: userData.role || 0
          };
        } else {
          // Fallback если API не вернул данные
          user = {
            id: item.userId,
            name: 'Unknown',
            email: '',
            role: 0
          };
        }
      }
      
      console.log('[OrderService] Mapped user:', user);
      
      // Обработка статуса
      let status = item.status;
      console.log('[OrderService] Processing status for order', item.id, ':', {
        originalStatus: item.status,
        statusType: typeof item.status
      });
      
      // Оставляем статус как число для совместимости с компонентами
      if (typeof status === 'string') {
        // Если статус пришел как строка, конвертируем в число
        status = this.mapStatusStringToNumber(status);
      }
      
      console.log('[OrderService] Final status:', status);
      
      // Обработка элементов заказа - используем новые поля из бэкенда
      let orderItems: OrderItem[] = [];
      if (item.items && Array.isArray(item.items)) {
        console.log('[OrderService] Processing order items:', item.items);
        orderItems = item.items.map((orderItem: any) => ({
          id: orderItem.id,
          orderId: orderItem.orderId,
          productId: orderItem.productId,
          productName: orderItem.productName || 'Неизвестный продукт',
          categoryName: orderItem.categoryName || 'Неизвестная категория',
          quantity: orderItem.quantity,
          price: orderItem.price,
          priceAtPurchase: orderItem.priceAtPurchase || orderItem.price,
          discountAtPurchase: orderItem.discountAtPurchase || 0,
          finalPriceAtPurchase: orderItem.finalPriceAtPurchase || orderItem.price,
          appliedDiscountId: orderItem.appliedDiscountId,
          appliedCouponId: orderItem.appliedCouponId,
          appliedPromoCodeId: orderItem.appliedPromoCodeId
        }));
        console.log('[OrderService] Final order items:', orderItems);
      }

      // Используем новые поля для расчета сумм
      const originalTotal = item.originalTotal || 0;
      const discountedTotal = item.discountedTotal || 0;
      const finalTotal = item.finalTotal || 0;
      const totalSavings = item.totalSavings || 0;

      const mappedOrder: Order = {
        id: item.id,
        userId: item.userId,
        user: user,
        createdDate: createdDate,
        status: status,
        items: orderItems,
        originalTotal: originalTotal,
        discountedTotal: discountedTotal,
        finalTotal: finalTotal,
        totalSavings: totalSavings,
        appliedCouponCode: item.appliedCouponCode,
        appliedPromoCode: item.appliedPromoCode,
        // Legacy fields for backward compatibility
        totalAmount: finalTotal,
        orderItems: orderItems,
        createdAt: createdDate,
        updatedAt: item.updatedAt || createdDate,
        shippingAddress: item.shippingAddress || 'No address provided'
      };
      
      return mappedOrder;
    });
    
    return Promise.all(orderPromises);
  }
  
  /**
   * Maps order data from GetOrderById endpoint (with category information)
   * @param orderData The order data from backend
   * @returns Mapped order
   */
  private mapOrderFromGetOrderById(orderData: any): Order {
    // Обработка даты
    let createdDate = orderData.createdDate || orderData.CreatedDate || orderData.createdAt;
    console.log('[OrderService] Original date from backend:', createdDate);
    
    if (createdDate) {
      if (typeof createdDate === 'string') {
        const parsedDate = new Date(createdDate);
        if (!isNaN(parsedDate.getTime())) {
          createdDate = parsedDate.toISOString();
          console.log('[OrderService] Parsed date successfully:', createdDate);
        } else {
          console.warn('[OrderService] Invalid date format:', createdDate);
          createdDate = new Date().toISOString();
        }
      } else if (createdDate instanceof Date) {
        createdDate = createdDate.toISOString();
        console.log('[OrderService] Date object converted:', createdDate);
      }
    } else {
      console.warn('[OrderService] No createdDate found, using current date');
      createdDate = new Date().toISOString();
    }
    
    // Обработка данных пользователя
    let user: any = undefined;
    if (orderData.user && typeof orderData.user === 'object') {
      user = {
        id: orderData.user.id || orderData.userId,
        name: orderData.user.name || 'Unknown',
        email: orderData.user.email || '',
        role: orderData.user.role || 0
      };
    } else if (orderData.userId) {
      user = {
        id: orderData.userId,
        name: 'Unknown',
        email: '',
        role: 0
      };
    }
    
    // Обработка статуса
    let status = orderData.status;
    console.log('[OrderService] Processing status in mapOrderFromGetOrderById:', {
      originalStatus: orderData.status,
      statusType: typeof orderData.status
    });
    
    // Оставляем статус как число для совместимости с компонентами
    if (typeof status === 'string') {
      // Если статус пришел как строка, конвертируем в число
      status = this.mapStatusStringToNumber(status);
    }
    
    console.log('[OrderService] Final status in mapOrderFromGetOrderById:', status);
    
    // Обработка элементов заказа (данные уже содержат категории)
    let orderItems: OrderItem[] = [];
    if (orderData.items && Array.isArray(orderData.items)) {
      orderItems = orderData.items.map((item: any) => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        productName: item.productName || 'Неизвестный продукт',
        categoryName: item.categoryName || 'Неизвестная категория',
        quantity: item.quantity,
        price: item.price,
        priceAtPurchase: item.priceAtPurchase || item.price,
        discountAtPurchase: item.discountAtPurchase || 0,
        finalPriceAtPurchase: item.finalPriceAtPurchase || item.price,
        appliedDiscountId: item.appliedDiscountId,
        appliedCouponId: item.appliedCouponId,
        appliedPromoCodeId: item.appliedPromoCodeId
      }));
    }
    
    // Используем новые поля для расчета сумм
    const originalTotal = orderData.originalTotal || 0;
    const discountedTotal = orderData.discountedTotal || 0;
    const finalTotal = orderData.finalTotal || 0;
    const totalSavings = orderData.totalSavings || 0;
    
    return {
      id: orderData.id,
      userId: orderData.userId,
      user: user,
      createdDate: createdDate,
      status: status,
      items: orderItems,
      originalTotal: originalTotal,
      discountedTotal: discountedTotal,
      finalTotal: finalTotal,
      totalSavings: totalSavings,
      appliedCouponCode: orderData.appliedCouponCode,
      appliedPromoCode: orderData.appliedPromoCode,
      // Legacy fields for backward compatibility
      totalAmount: finalTotal,
      orderItems: orderItems,
      createdAt: createdDate,
      updatedAt: orderData.updatedAt || createdDate,
      shippingAddress: orderData.shippingAddress || 'No address provided'
    };
  }

  /**
   * Maps a single order response to the Order type
   * @param item The order data
   * @returns Mapped order
   */
  private mapSingleOrder(item: any): Order {
    
    // Обработка даты - согласно новому бэкенду это createdDate
    let createdDate = item.createdDate || item.CreatedDate || item.createdAt;
    if (createdDate) {
      if (typeof createdDate === 'string') {
        const parsedDate = new Date(createdDate);
        if (!isNaN(parsedDate.getTime())) {
          createdDate = parsedDate.toISOString();
        } else {
          console.warn('[OrderService] Invalid date format:', createdDate);
          createdDate = new Date().toISOString();
        }
      }
    } else {
      console.warn('[OrderService] No createdDate found, using current date');
      createdDate = new Date().toISOString();
    }
    
    // Обработка данных пользователя
    let user: any = undefined;
    if (item.user && typeof item.user === 'object') {
      user = {
        id: item.user.id || item.userId,
        name: item.user.name || 'Unknown',
        email: item.user.email || '',
        role: item.user.role || 0
      };
    } else if (item.userId) {
      // Если user объект отсутствует, но есть userId, создаем базовый объект
      user = {
        id: item.userId,
        name: 'Unknown',
        email: '',
        role: 0
      };
    }
    
    // Обработка статуса
    let status = item.status;
    console.log('[OrderService] Processing status in mapSingleOrder:', {
      originalStatus: item.status,
      statusType: typeof item.status
    });
    
    // Оставляем статус как число для совместимости с компонентами
    if (typeof status === 'string') {
      // Если статус пришел как строка, конвертируем в число
      status = this.mapStatusStringToNumber(status);
    }
    
    console.log('[OrderService] Final status in mapSingleOrder:', status);
    
    // Обработка элементов заказа
    let orderItems: OrderItem[] = [];
    if (item.items && Array.isArray(item.items)) {
      orderItems = item.items.map((orderItem: any) => ({
        id: orderItem.id,
        orderId: orderItem.orderId,
        productId: orderItem.productId,
        productName: orderItem.productName || 'Неизвестный продукт',
        categoryName: orderItem.categoryName || 'Неизвестная категория',
        quantity: orderItem.quantity,
        price: orderItem.price,
        priceAtPurchase: orderItem.priceAtPurchase || orderItem.price,
        discountAtPurchase: orderItem.discountAtPurchase || 0,
        finalPriceAtPurchase: orderItem.finalPriceAtPurchase || orderItem.price,
        appliedDiscountId: orderItem.appliedDiscountId,
        appliedCouponId: orderItem.appliedCouponId,
        appliedPromoCodeId: orderItem.appliedPromoCodeId
      }));
    }
    
    // Используем новые поля для расчета сумм
    const originalTotal = item.originalTotal || 0;
    const discountedTotal = item.discountedTotal || 0;
    const finalTotal = item.finalTotal || 0;
    const totalSavings = item.totalSavings || 0;
    
    const mappedOrder: Order = {
      id: item.id,
      userId: item.userId,
      user: user,
      createdDate: createdDate,
      status: status,
      items: orderItems,
      originalTotal: originalTotal,
      discountedTotal: discountedTotal,
      finalTotal: finalTotal,
      totalSavings: totalSavings,
      appliedCouponCode: item.appliedCouponCode,
      appliedPromoCode: item.appliedPromoCode,
      // Legacy fields for backward compatibility
      totalAmount: finalTotal,
      orderItems: orderItems,
      createdAt: createdDate,
      updatedAt: item.updatedAt || createdDate,
      shippingAddress: item.shippingAddress || 'No address provided'
    };
    
    return mappedOrder;
  }
  
  /**
   * Maps numeric order status to string
   * @param status Numeric status
   * @returns String status
   */
  private mapOrderStatusToString(status: number): string {
    const statusMap: Record<number, string> = {
      0: 'Pending',
      1: 'Processing',
      2: 'Shipped',
      3: 'Delivered',
      4: 'Cancelled'
    };
    
    return statusMap[status] || 'Unknown';
  }

  /**
   * Maps string status to numeric value
   * @param status String status
   * @returns Numeric status
   */
  private mapStatusStringToNumber(status: string): number {
    const statusMap: Record<string, number> = {
      'Pending': 0,
      'Processing': 1,
      'Shipped': 2,
      'Delivered': 3,
      'Cancelled': 4
    };
    
    return statusMap[status] !== undefined ? statusMap[status] : 0;
  }

  /**
   * Gets top purchased products (Admin, User)
   * @param limit Number of products to return
   * @returns Top products
   */
  public async getTopProducts(limit: number = 10): Promise<TopProduct[]> {
    try {
      const response = await apiService.get<any>(`/order/get-top-products/`);
      
      console.log('[OrderService] Top products response:', response);
      
      // Обрабатываем разные структуры ответа
      if (response.isSuccess && response.value) {
        // Если ответ содержит value напрямую (массив)
        if (Array.isArray(response.value)) {
          return this.mapTopProductsResponse(response.value);
        }
        
        // Если ответ содержит value вложенно
        if (response.value.value && Array.isArray(response.value.value)) {
          return this.mapTopProductsResponse(response.value.value);
        }
        
        // Если response.value это объект с value
        if (response.value.value) {
          return this.mapTopProductsResponse(response.value.value);
        }
      }
      
      return [];
    } catch (error) {
      console.error('[OrderService] Error getting top products:', error);
      return [];
    }
  }

  /**
   * Gets order statistics (Admin only)
   * @returns Order statistics
   */
  public async getOrderStatistics(): Promise<OrderStatistics> {
    try {
      const response = await apiService.get<any>(`/order/get-order-statistics/`);
      
      console.log('[OrderService] Order statistics response:', response);
      
      // Обрабатываем новую структуру ответа
      if (response.isSuccess && response.value) {
        // Если ответ содержит value напрямую
        if (response.value.value) {
          return this.mapOrderStatisticsResponse(response.value.value);
        }
        
        // Если response.value это объект со статистикой
        if (typeof response.value === 'object' && response.value.totalOrders !== undefined) {
          return this.mapOrderStatisticsResponse(response.value);
        }
      }
      
      // Return default statistics if API fails
      return {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        pendingOrders: 0,
        completedOrders: 0,
        uniqueUsers: 0,
        averageCheck: 0
      };
    } catch (error) {
      console.error('[OrderService] Error getting order statistics:', error);
      return {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        pendingOrders: 0,
        completedOrders: 0,
        uniqueUsers: 0,
        averageCheck: 0
      };
    }
  }

  /**
   * Gets detailed discount analytics (Admin only)
   * @param startDate Optional start date filter
   * @param endDate Optional end date filter
   * @returns Detailed discount analytics
   */
  public async getDiscountAnalytics(startDate?: string, endDate?: string): Promise<OrderStatistics> {
    try {
      let url = '/order/analytics/discounts';
      const params = new URLSearchParams();
      
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await apiService.get<any>(url);
      
      console.log('[OrderService] Discount analytics response:', response);
      
      // Обрабатываем новую структуру ответа
      if (response.isSuccess && response.value) {
        // Если ответ содержит summary, используем его
        if (response.value.summary) {
          return this.mapOrderStatisticsResponse({
            ...response.value.summary,
            // Добавляем недостающие поля из основного ответа
            averageOrderValue: response.value.value?.averageOrderValue || 0,
            pendingOrders: response.value.value?.pendingOrders || 0,
            completedOrders: response.value.value?.completedOrders || 0,
            uniqueUsers: response.value.value?.uniqueUsers || 0,
            averageCheck: response.value.value?.averageCheck || 0,
            totalItems: response.value.value?.totalItems || 0,
            discountStatistics: response.value.discountStatistics,
            couponStatistics: response.value.couponStatistics,
            promoCodeStatistics: response.value.promoCodeStatistics
          });
        }
        
        // Если ответ содержит value напрямую
        if (response.value.value) {
          return this.mapOrderStatisticsResponse(response.value.value);
        }
        
        // Если response.value это объект со статистикой
        if (typeof response.value === 'object' && response.value.totalOrders !== undefined) {
          return this.mapOrderStatisticsResponse(response.value);
        }
        
        // Прямой ответ
        return this.mapOrderStatisticsResponse(response.value);
      }
      
      // Return default statistics if API fails
      return {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        pendingOrders: 0,
        completedOrders: 0,
        uniqueUsers: 0,
        averageCheck: 0
      };
    } catch (error) {
      console.error('[OrderService] Error getting discount analytics:', error);
      return {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        pendingOrders: 0,
        completedOrders: 0,
        uniqueUsers: 0,
        averageCheck: 0
      };
    }
  }
  
  /**
   * Maps the top products response to the TopProduct type
   * @param data The response data
   * @returns Mapped top products
   */
  private mapTopProductsResponse(data: any[]): TopProduct[] {
    if (!Array.isArray(data)) {
      console.warn('[OrderService] Expected array for top products, got:', typeof data);
      return [];
    }
    
    return data.map(item => ({
      id: item.productId || item.id,
      name: item.productName || item.name,
      totalSold: item.totalQuantity || item.totalSold,
      revenue: item.totalRevenue || item.revenue,
      imageUrl: item.imageUrl
    }));
  }


  
  /**
   * Maps the order statistics response to the OrderStatistics type
   * @param data The response data
   * @returns Mapped order statistics
   */
  private mapOrderStatisticsResponse(data: any): OrderStatistics {
    return {
      totalOrders: data.totalOrders || 0,
      totalRevenue: data.totalRevenue || 0,
      totalOriginalRevenue: data.totalOriginalRevenue || 0,
      totalSavings: data.totalSavings || 0,
      discountPercentage: data.discountPercentage || 0,
      ordersWithDiscounts: data.ordersWithDiscounts || 0,
      ordersWithCoupons: data.ordersWithCoupons || 0,
      ordersWithPromoCodes: data.ordersWithPromoCodes || 0,
      averageDiscountPerOrder: data.averageDiscountPerOrder || 0,
      averageOrderValue: data.averageOrderValue || 0,
      pendingOrders: data.pendingOrders || 0,
      completedOrders: data.completedOrders || 0,
      uniqueUsers: data.uniqueUsers || 0,
      averageCheck: data.averageCheck || data.averageOrderValue || 0, // Используем averageOrderValue как fallback
      totalItems: data.totalItems || 0,
      discountStatistics: data.discountStatistics || {
        totalDiscountsUsed: 0,
        totalDiscountAmount: 0,
        averageDiscountAmount: 0,
        topDiscounts: []
      },
      couponStatistics: data.couponStatistics || {
        totalCouponsUsed: 0,
        totalCouponAmount: 0,
        averageCouponAmount: 0,
        topCoupons: []
      },
      promoCodeStatistics: data.promoCodeStatistics || {
        totalPromoCodesUsed: 0,
        totalPromoCodeAmount: 0,
        averagePromoCodeAmount: 0,
        topPromoCodes: []
      }
    };
  }

  public async getOrderItemsForCurrentUser() {
    try {
      const response = await apiClient.getOrderItems();
      if (response.isSuccess && response.value) {
        // Преобразуем orderItemDto[] к CartItem[] с учётом новых полей
        return response.value.map((item: any) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName || 'Unknown',
          quantity: item.quantity,
          price: item.price,
          totalSum: (item.price ?? 0) * (item.quantity ?? 0),
          stock: 0 // нет информации о stock
        }));
      }
      return [];
    } catch (error) {
      console.error('[OrderService] Error getting order items:', error);
      return [];
    }
  }
}

export const orderService = OrderService.getInstance();
