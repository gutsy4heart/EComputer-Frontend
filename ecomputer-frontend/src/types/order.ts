 
import { User } from './user';
import { Product } from './product';
 
export enum OrderStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled'
}
 
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  categoryName: string;
  quantity: number;
  price: number;
  priceAtPurchase: number;
  discountAtPurchase: number;
  finalPriceAtPurchase: number;
  appliedDiscountId?: number;
  appliedCouponId?: number;
  appliedPromoCodeId?: number;
}

// Новые интерфейсы для системы скидок
export interface AppliedDiscountDto {
  discountId: number;
  discountName: string;
  percentage: number;
  discountAmount: number;
  productIds: number[];
}

export interface AppliedCouponDto {
  couponId: number;
  couponCode: string;
  discountAmount: number;
  productIds: number[];
}

export interface AppliedPromoCodeDto {
  promoCodeId: number;
  promoCode: string;
  discountPercentage: number;
  discountAmount: number;
  applicableProductIds: number[];
}

export interface OrderCalculationDto {
  originalTotal: number;
  discountedTotal: number;
  finalTotal: number;
  totalSavings: number;
  appliedDiscounts?: AppliedDiscountDto[];
  appliedCoupon?: AppliedCouponDto;
  appliedPromoCode?: AppliedPromoCodeDto;
}

export interface Order {
  id: number;
  userId: number;
  user?: User;
  createdDate: string;
  status: OrderStatus;
  items: OrderItem[];
  originalTotal: number;
  discountedTotal: number;
  finalTotal: number;
  totalSavings: number;
  appliedCouponCode?: string;
  appliedPromoCode?: string;
  // Legacy fields for backward compatibility
  totalAmount?: number;
  orderItems?: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
  shippingAddress?: string;
}
 
export interface CreateOrderRequest {
  userId: number;
  items: {
    productId: number;
    quantity: number;
  }[];
  shippingAddress: string;
}
 
export interface UpdateOrderRequest {
  id: number;
  status?: OrderStatus;
  shippingAddress?: string;
}

// Новые интерфейсы для API запросов со скидками
export interface CalculateDiscountsRequest {
  cartId: number;
  couponCode?: string;
  promoCode?: string;
}

export interface CreateOrderWithDiscountsRequest {
  cartId: number;
  couponCode?: string;
  promoCode?: string;
}

export interface CreateOrderRequest {
  cartId: number;
}