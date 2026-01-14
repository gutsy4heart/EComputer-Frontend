import { Order, OrderItem } from '../types/order';
import { Discount } from '../types/promotion';

export interface OrderCalculation {
  subtotal: number;
  discountAmount: number;
  total: number;
  discountPercentage?: number;
  discountName?: string;
}

export function calculateOrderDetails(order: Order): OrderCalculation {
  // Use the new order structure with pre-calculated totals
  if (order.originalTotal !== undefined && order.finalTotal !== undefined) {
    return {
      subtotal: order.originalTotal,
      discountAmount: order.totalSavings || 0,
      total: order.finalTotal,
      discountPercentage: order.originalTotal > 0 ? ((order.totalSavings || 0) / order.originalTotal) * 100 : 0
    };
  }

  // Fallback to legacy calculation
  if (!order.items && !order.orderItems) {
    return {
      subtotal: order.totalAmount || 0,
      discountAmount: 0,
      total: order.totalAmount || 0
    };
  }

  const items = order.items || order.orderItems || [];
  
  // Calculate subtotal (original prices without discounts)
  const subtotal = items.reduce((sum, item) => {
    return sum + ((item.price || 0) * item.quantity);
  }, 0);

  // If totalAmount is less than subtotal, there was a discount
  const total = order.totalAmount || 0;
  const discountAmount = Math.max(0, subtotal - total);

  return {
    subtotal,
    discountAmount,
    total,
    discountPercentage: subtotal > 0 ? (discountAmount / subtotal) * 100 : 0
  };
}

export function formatOrderPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}
