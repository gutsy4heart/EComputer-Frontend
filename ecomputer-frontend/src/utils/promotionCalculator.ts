import { Coupon, Discount, PromoCode } from '../types/promotion';

export interface CartItem {
  productId: number;
  quantity: number;
  originalPrice: number;
}

export interface AppliedPromotions {
  discount?: Discount;
  promoCode?: PromoCode;
  coupon?: Coupon;
}

export interface PriceCalculation {
  subtotal: number;
  discountAmount: number;
  promoCodeAmount: number;
  couponAmount: number;
  total: number;
  savings: number;
}

export const calculateFinalPrice = (
  cartItems: CartItem[], 
  promotions: AppliedPromotions
): PriceCalculation => {
  let subtotal = cartItems.reduce((sum, item) => 
    sum + (item.originalPrice * item.quantity), 0
  );

  let discountAmount = 0;
  let promoCodeAmount = 0;
  let couponAmount = 0;

  // Применяем скидки к товарам
  if (promotions.discount) {
    const discountPercentage = (promotions.discount as any).percentage || (promotions.discount as any).discountPercentage || 0;
    cartItems.forEach(item => {
      if (promotions.discount!.productIds.includes(item.productId)) {
        const itemDiscount = item.originalPrice * (discountPercentage / 100);
        discountAmount += itemDiscount * item.quantity;
      }
    });
  }

  // Применяем промокод к общей сумме (после скидок)
  if (promotions.promoCode) {
    const promoPercentage = (promotions.promoCode as any).percentage || (promotions.promoCode as any).discountPercentage || 0;
    const amountAfterDiscounts = subtotal - discountAmount;
    promoCodeAmount = amountAfterDiscounts * (promoPercentage / 100);
  }

  // Применяем купон (фиксированная сумма)
  if (promotions.coupon) {
    couponAmount = promotions.coupon.discountAmount;
  }

  const total = Math.max(0, subtotal - discountAmount - promoCodeAmount - couponAmount);
  const savings = discountAmount + promoCodeAmount + couponAmount;

  return {
    subtotal,
    discountAmount,
    promoCodeAmount,
    couponAmount,
    total,
    savings
  };
};

export const validatePromoCodeForCart = (
  promoCode: PromoCode, 
  cartItems: CartItem[]
) => {
  // Проверяем, есть ли товары в корзине, к которым применим промокод
  const applicableItems = cartItems.filter(item =>
    promoCode.applicableProductIds.includes(item.productId)
  );

  if (applicableItems.length === 0) {
    return {
      isValid: false,
      message: "Промокод не применим к товарам в корзине"
    };
  }

  // Проверяем минимальную сумму заказа (если есть)
  const applicableTotal = applicableItems.reduce((sum, item) =>
    sum + (item.originalPrice * item.quantity), 0
  );

  return {
    isValid: true,
    applicableItems,
    applicableTotal
  };
};

export const getActiveDiscountForProduct = (
  productId: number,
  discounts: Discount[]
): Discount | null => {
  return discounts.find(d => 
    d.isActive && d.productIds.includes(productId)
  ) || null;
};

export const getDiscountedPrice = (
  originalPrice: number,
  discount: Discount
): number => {
  const percentage = (discount as any).percentage || (discount as any).discountPercentage || 0;
  return originalPrice * (1 - percentage / 100);
};

export const formatPrice = (price: number): string => {
  return `${price.toFixed(2)} ₽`;
};

export const formatSavings = (savings: number): string => {
  return `Экономия: ${formatPrice(savings)}`;
};
