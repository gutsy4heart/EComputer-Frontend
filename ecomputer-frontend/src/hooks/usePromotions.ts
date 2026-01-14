import { useState, useEffect, useCallback } from 'react';
import { Coupon, Discount, PromoCode } from '../types/promotion';
import { promotionService } from '../services/promotion.service';

export const usePromotions = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPromotions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [couponsData, discountsData, promoCodesData] = await Promise.all([
        promotionService.getCoupons(),
        promotionService.getDiscounts(),
        promotionService.getPromoCodes()
      ]);
      
      console.log('[usePromotions] Loaded data:', { 
        couponsData, 
        discountsData, 
        promoCodesData,
        couponsType: typeof couponsData,
        discountsType: typeof discountsData,
        promoCodesType: typeof promoCodesData
      });
      
      setCoupons(couponsData || []);
      setDiscounts(discountsData || []);
      setPromoCodes(promoCodesData || []);
    } catch (err) {
      console.error('[usePromotions] Error loading promotions:', err);
      setError('Failed to load promotions');
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
