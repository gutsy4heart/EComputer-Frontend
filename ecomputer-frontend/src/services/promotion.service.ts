import { apiService } from './api';
import { 
  Coupon, 
  Discount, 
  PromoCode, 
  CreateCouponRequest, 
  CreateDiscountRequest, 
  CreatePromoCodeRequest,
  UpdateCouponRequest,
  UpdateDiscountRequest,
  UpdatePromoCodeRequest
} from '../types/promotion';

class PromotionService {
  private static instance: PromotionService;

  public static getInstance(): PromotionService {
    if (!PromotionService.instance) {
      PromotionService.instance = new PromotionService();
    }
    return PromotionService.instance;
  }

  // Coupons
  async getCoupons(): Promise<Coupon[]> {
    try {
      const response = await apiService.get<Coupon[]>('/coupon/');
      console.log('[PromotionService] getCoupons response:', response);
      
      if (response.isSuccess && response.value) {
        return Array.isArray(response.value) ? response.value : [];
      }
      
      console.error('[PromotionService] getCoupons failed:', response.error);
      return [];
    } catch (error) {
      console.error('[PromotionService] Error fetching coupons:', error);
      return [];
    }
  }

  async getCouponById(id: number): Promise<Coupon | null> {
    try {
      const response = await apiService.get<Coupon>(`/coupon/${id}`);
      if (response.isSuccess && response.value) {
        return response.value;
      }
      return null;
    } catch (error) {
      console.error('[PromotionService] Error fetching coupon:', error);
      return null;
    }
  }

  async getCouponByCode(code: string): Promise<Coupon | null> {
    try {
      const response = await apiService.get<Coupon>(`/coupon/code/${code}`);
      if (response.isSuccess && response.value) {
        return response.value;
      }
      return null;
    } catch (error) {
      console.error('[PromotionService] Error fetching coupon by code:', error);
      return null;
    }
  }

  async createCoupon(data: CreateCouponRequest): Promise<Coupon | null> {
    try {
      const response = await apiService.post<Coupon>('/coupon/', data);
      if (response.isSuccess && response.value) {
        return response.value;
      }
      return null;
    } catch (error) {
      console.error('[PromotionService] Error creating coupon:', error);
      return null;
    }
  }

  async updateCoupon(id: number, data: UpdateCouponRequest): Promise<Coupon | null> {
    try {
      const response = await apiService.put<Coupon>(`/coupon/${id}`, data);
      
      if (response.isSuccess && response.value) {
        return response.value;
      }
      
      throw new Error(response.error || 'Не удалось обновить купон');
    } catch (error) {
      console.error('[PromotionService] Error updating coupon:', error);
      throw error;
    }
  }

  async deleteCoupon(id: number): Promise<boolean> {
    try {
      const response = await apiService.delete(`/coupon/${id}`);
      return response.isSuccess;
    } catch (error) {
      console.error('[PromotionService] Error deleting coupon:', error);
      return false;
    }
  }

  // Discounts
  async getDiscounts(): Promise<Discount[]> {
    try {
      const response = await apiService.get<Discount[]>('/discount/');
      
      if (response.isSuccess && response.value) {
        return Array.isArray(response.value) ? response.value : [];
      }
      
      return [];
    } catch (error) {
      console.error('[PromotionService] Error fetching discounts:', error);
      return [];
    }
  }

  async getDiscountById(id: number): Promise<Discount | null> {
    try {
      const response = await apiService.get<Discount>(`/discount/${id}`);
      if (response.isSuccess && response.value) {
        return response.value;
      }
      return null;
    } catch (error) {
      console.error('[PromotionService] Error fetching discount:', error);
      return null;
    }
  }

  async createDiscount(data: CreateDiscountRequest): Promise<Discount | null> {
    try {
      const response = await apiService.post<Discount>('/discount/', data);
      if (response.isSuccess && response.value) {
        return response.value;
      }
      return null;
    } catch (error) {
      console.error('[PromotionService] Error creating discount:', error);
      return null;
    }
  }

  async updateDiscount(id: number, data: UpdateDiscountRequest): Promise<Discount | null> {
    try {
      const response = await apiService.put<Discount>(`/discount/${id}`, data);
      
      if (response.isSuccess && response.value) {
        return response.value;
      }
      
      throw new Error(response.error || 'Не удалось обновить скидку');
    } catch (error) {
      console.error('[PromotionService] Error updating discount:', error);
      throw error;
    }
  }

  async deleteDiscount(id: number): Promise<boolean> {
    try {
      const response = await apiService.delete(`/discount/${id}`);
      return response.isSuccess;
    } catch (error) {
      console.error('[PromotionService] Error deleting discount:', error);
      return false;
    }
  }

  // PromoCodes
  async getPromoCodes(): Promise<PromoCode[]> {
    try {
      const response = await apiService.get<PromoCode[]>('/promocode/');
      
      if (response.isSuccess && response.value) {
        return Array.isArray(response.value) ? response.value : [];
      }
      
      return [];
    } catch (error) {
      console.error('[PromotionService] Error fetching promocodes:', error);
      return [];
    }
  }

  async getPromoCodeById(id: number): Promise<PromoCode | null> {
    try {
      const response = await apiService.get<PromoCode>(`/promocode/${id}`);
      if (response.isSuccess && response.value) {
        return response.value;
      }
      return null;
    } catch (error) {
      console.error('[PromotionService] Error fetching promocode:', error);
      return null;
    }
  }

  async getPromoCodeByCode(code: string): Promise<PromoCode | null> {
    try {
      const response = await apiService.get<PromoCode>(`/promocode/code/${code}`);
      if (response.isSuccess && response.value) {
        return response.value;
      }
      return null;
    } catch (error) {
      console.error('[PromotionService] Error fetching promocode by code:', error);
      return null;
    }
  }

  async createPromoCode(data: CreatePromoCodeRequest): Promise<PromoCode | null> {
    try {
      const response = await apiService.post<PromoCode>('/promocode/', data);
      if (response.isSuccess && response.value) {
        return response.value;
      }
      return null;
    } catch (error) {
      console.error('[PromotionService] Error creating promocode:', error);
      return null;
    }
  }

  async updatePromoCode(id: number, data: UpdatePromoCodeRequest): Promise<PromoCode | null> {
    try {
      const response = await apiService.put<PromoCode>(`/promocode/${id}`, data);
      
      if (response.isSuccess && response.value) {
        return response.value;
      }
      
      throw new Error(response.error || 'Не удалось обновить промокод');
    } catch (error) {
      console.error('[PromotionService] Error updating promocode:', error);
      throw error;
    }
  }

  async deletePromoCode(id: number): Promise<boolean> {
    try {
      const response = await apiService.delete(`/promocode/${id}`);
      return response.isSuccess;
    } catch (error) {
      console.error('[PromotionService] Error deleting promocode:', error);
      return false;
    }
  }
}

export const promotionService = PromotionService.getInstance();
