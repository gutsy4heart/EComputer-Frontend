export interface Coupon {
  id: number;
  code: string;
  discountAmount: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  productIds: number[];
}

export interface Discount {
  id: number;
  name: string;
  percentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  productIds: number[];
}

export interface PromoCode {
  id: number;
  code: string;
  discountPercentage: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  applicableProductIds: number[];
}

export interface CreateCouponRequest {
  code: string;
  discountAmount: number;
  validFrom: string; // Format: "YYYY-MM-DDTHH:mm:ss.sssZ"
  validTo: string; // Format: "YYYY-MM-DDTHH:mm:ss.sssZ"
  productIds: number[];
}

export interface CreateDiscountRequest {
  name: string;
  percentage: number;
  startDate: string; // Format: "YYYY-MM-DDTHH:mm:ss.sssZ"
  endDate: string; // Format: "YYYY-MM-DDTHH:mm:ss.sssZ"
  productIds: number[];
}

export interface CreatePromoCodeRequest {
  code: string;
  discountPercentage: number;
  validFrom: string; // Format: "YYYY-MM-DDTHH:mm:ss.sssZ"
  validTo: string; // Format: "YYYY-MM-DDTHH:mm:ss.sssZ"
  applicableProductIds: number[];
}

export interface UpdateCouponRequest extends CreateCouponRequest {}
export interface UpdateDiscountRequest extends CreateDiscountRequest {}
export interface UpdatePromoCodeRequest extends CreatePromoCodeRequest {}
