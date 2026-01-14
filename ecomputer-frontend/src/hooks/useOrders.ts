import { useState, useEffect, useCallback } from 'react';
import { OrderService, OrderStatistics, TopProduct } from '../services/order.service';
import { Order, CreateOrderRequest, UpdateOrderRequest, UserRole } from '../types';
import { CartItem } from '../types/cartItem';
import { useAuthContext, useCartContext } from '../context';


const orderService = OrderService.getInstance();

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [orderStatistics, setOrderStatistics] = useState<OrderStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();
  const { loadCart } = useCartContext();

 
  const loadOrders = useCallback(async () => {
    if (!user) {
      console.log('[useOrders] No user, skipping loadOrders');
      return;
    }
    
    console.log('[useOrders] Loading orders for user:', user.id, 'role:', user.role);
    
    try {
      setLoading(true);
      setError(null);
      
      let fetchedOrders: Order[] = [];
      
      if (user.role === UserRole.Admin) {
        console.log('[useOrders] Admin user - getting all orders');
        fetchedOrders = await orderService.getOrders();
      } else {
        console.log('[useOrders] Regular user - getting user-specific orders');
        fetchedOrders = await orderService.getOrdersByUserId(user.id);
      }
      
      console.log('[useOrders] Fetched orders:', fetchedOrders);
      setOrders(fetchedOrders);
    } catch (err) {
      console.error('[useOrders] Error loading orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [user]);

 
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

 
  const getOrderById = useCallback(async (id: number): Promise<Order | null> => {
    if (!user) return null;
    
    try {
      setLoading(true);
      setError(null);
      
      let order: Order | null = null;
      
      if (user.role === UserRole.Admin) {
        // Для админов используем специальный метод
        order = await orderService.getOrderByIdForAdmin(id);
      } else {
        // Для обычных пользователей используем метод с категорией
        order = await orderService.getOrderByIdWithCategory(id);
      }
      
      if (order) {
        // setSelectedOrder(order); // This line was removed as per the new_code, as there's no state for selectedOrder
        return order;
      } else {
        setError('Заказ не найден');
        return null;
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Ошибка при загрузке заказа');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, orderService]);

 
  const createOrder = useCallback(async (data: { cartId: number; items: CartItem[]; shippingAddress: string }): Promise<Order | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }
    try {
      setLoading(true);
      setError(null);
      const request: CreateOrderRequest = {
        cartId: data.cartId,
        userId: user.id,
        items: data.items,
        shippingAddress: data.shippingAddress,
      };
      const newOrder = await orderService.createOrder(request);
      if (newOrder && 'id' in newOrder && 'userId' in newOrder && 'createdDate' in newOrder && 'status' in newOrder && 'items' in newOrder) {
        setOrders(prevOrders => [...prevOrders, newOrder as Order]);
        return newOrder as Order;
      }
      return null;
    } catch (err: any) {
      if (err?.response?.data?.error?.includes('Недостаточно товара')) {
        alert(err.response.data.error + ' Количество в корзине будет скорректировано.');
        await loadCart();
      } else {
        setError('Failed to create order');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [loadCart, user]);

 
  const updateOrder = useCallback(async (orderData: UpdateOrderRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const success = await orderService.updateOrder(orderData);
      
      if (success) {
 
        await loadOrders();
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error updating order:', err);
      setError('Failed to update order');
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadOrders]);

 
  const deleteOrder = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const success = await orderService.deleteOrder(id);
      
      if (success) {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error deleting order:', err);
      setError('Failed to delete order');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get order history (Admin only)
  const getOrderHistory = useCallback(async (userId?: number): Promise<Order[]> => {
    if (!user) {
      setError('User not authenticated');
      return [];
    }
    
    try {
      setLoading(true);
      setError(null);
      
      let history: Order[];
      
      if (user.role === UserRole.Admin) {
        // For admins, get all orders or specific user's orders
        history = await orderService.getOrderHistory(userId);
      } else {
        // For regular users, get their own orders
        history = await orderService.getOrdersByUserId(user.id);
      }
      
      setOrderHistory(history);
      return history;
    } catch (err) {
      console.error('Error getting order history:', err);
      setError('Failed to get order history');
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Get top products
  const getTopProducts = useCallback(async (limit: number = 10): Promise<TopProduct[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const products = await orderService.getTopProducts(limit);
      setTopProducts(products);
      return products;
    } catch (err) {
      console.error('Error getting top products:', err);
      setError('Failed to get top products');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get order statistics (Admin only)
  const getOrderStatistics = useCallback(async (startDate?: string, endDate?: string): Promise<OrderStatistics | null> => {
    if (!user || user.role !== UserRole.Admin) {
      setError('Only admins can access order statistics');
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('[useOrders] getOrderStatistics called');
      
      const stats = await orderService.getOrderStatistics();
      
      console.log('[useOrders] Order statistics result:', stats);
      
      setOrderStatistics(stats);
      return stats;
    } catch (err) {
      console.error('[useOrders] Error getting order statistics:', err);
      setError('Failed to get order statistics');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);


  const updateOrderStatus = useCallback(async (id: number, status: string): Promise<boolean> => {
    if (!user || user.role !== UserRole.Admin) {
      setError('Only admins can update order status');
      return false;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const success = await orderService.updateOrderStatus(id, status);
      
      if (success) {
        // Refresh orders after status update
        await loadOrders();
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, loadOrders]);

  return {
    orders,
    orderHistory,
    topProducts,
    orderStatistics,
    loading,
    error,
    loadOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrderHistory,
    getTopProducts,
    getOrderStatistics,
    updateOrderStatus,
  };
};

export const useOrderItems = () => {
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const items = await OrderService.getInstance().getOrderItemsForCurrentUser();
        setOrderItems(items as CartItem[]);
      } catch (err) {
        setError('Failed to load order items');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderItems();
  }, []);

  return { orderItems, loading, error };
};
