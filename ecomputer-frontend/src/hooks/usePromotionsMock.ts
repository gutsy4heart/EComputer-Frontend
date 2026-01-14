import { useState, useEffect, useCallback } from 'react';
import { Coupon, Discount, PromoCode } from '../types/promotion';
import { 
  mockCoupons, 
  mockDiscounts, 
  mockPromoCodes,
  getActiveCoupons,
  getActiveDiscounts,
  getActivePromoCodes,
  findPromoCodeByCode as mockFindPromoCodeByCode,
  findCouponByCode as mockFindCouponByCode
} from '../utils/mockPromotions';


export const usePromotionsMock = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPromotions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
    
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('[usePromotionsMock] Loading mock data...');
      
      setCoupons(mockCoupons);
      setDiscounts(mockDiscounts);
      setPromoCodes(mockPromoCodes);
      
      console.log('[usePromotionsMock] Mock data loaded:', { 
        coupons: mockCoupons.length, 
        discounts: mockDiscounts.length, 
        promoCodes: mockPromoCodes.length 
      });
      
    } catch (err) {
      console.error('[usePromotionsMock] Error loading mock data:', err);
      setError('Failed to load mock promotions');
    } finally {
      setLoading(false);
    }
  }, []);

  const getActiveDiscounts = useCallback(() => {
    return Array.isArray(discounts) ? discounts.filter(d => d.isActive) : [];
  }, [discounts]);

  const getActivePromoCodes = useCallback(() => {
    return Array.isArray(promoCodes) ? promoCodes.filter(p => p.isActive) : [];
  }, [promoCodes]);

  const getActiveCoupons = useCallback(() => {
    return Array.isArray(coupons) ? coupons.filter(c => c.isActive) : [];
  }, [coupons]);

  const findPromoCodeByCode = useCallback((code: string) => {
    return Array.isArray(promoCodes) ? promoCodes.find(p => p.code.toLowerCase() === code.toLowerCase() && p.isActive) : undefined;
  }, [promoCodes]);

  const findCouponByCode = useCallback((code: string) => {
    return Array.isArray(coupons) ? coupons.find(c => c.code.toLowerCase() === code.toLowerCase() && c.isActive) : undefined;
  }, [coupons]);

  useEffect(() => {
    loadPromotions();
  }, [loadPromotions]);

  return {
    coupons,
    discounts,
    promoCodes,
    loading,
    error,
    loadPromotions,
    getActiveDiscounts,
    getActivePromoCodes,
    getActiveCoupons,
    findPromoCodeByCode,
    findCouponByCode
  };
};
