import { useState } from 'react';
import { OrderService } from '../services/order.service';
import { OrderCalculationDto, CalculateDiscountsRequest, CreateOrderWithDiscountsRequest, CreateOrderRequest } from '../types/order';

export const useOrderDiscounts = () => {
  const [discountCalculation, setDiscountCalculation] = useState<OrderCalculationDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const orderService = OrderService.getInstance();

  const calculateDiscounts = async (cartId: number, couponCode?: string, promoCode?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const request: CalculateDiscountsRequest = {
        cartId,
        couponCode,
        promoCode
      };
      
      const result = await orderService.calculateCartDiscounts(request);
      setDiscountCalculation(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка расчета скидок';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (cartId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // You need to provide userId, items, and shippingAddress as required by CreateOrderRequest
      const request: CreateOrderRequest = {
        cartId,
        userId: 0, // Replace with actual userId
        items: [], // Replace with actual items array
        shippingAddress: '' // Replace with actual shipping address
      };
      
      const result = await orderService.createOrder(request);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания заказа';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createOrderWithDiscounts = async (cartId: number, couponCode?: string, promoCode?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const request: CreateOrderWithDiscountsRequest = {
        cartId,
        couponCode,
        promoCode
      };
      
      const result = await orderService.createOrderWithDiscounts(request);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания заказа';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearDiscountCalculation = () => {
    setDiscountCalculation(null);
    setError(null);
  };

  return {
    discountCalculation,
    loading,
    error,
    calculateDiscounts,
    createOrder,
    createOrderWithDiscounts,
    clearDiscountCalculation
  };
};
