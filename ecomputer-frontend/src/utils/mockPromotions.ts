import { Coupon, Discount, PromoCode } from '../types/promotion';

// Мок-данные для тестирования системы промоций
export const mockCoupons: Coupon[] = [
  {
    id: 1,
    code: 'SUMMER2024',
    discountAmount: 500,
    validFrom: '2024-06-01T00:00:00Z',
    validTo: '2024-08-31T23:59:59Z',
    isActive: true,
    productIds: [1, 2, 3]
  },
  {
    id: 2,
    code: 'WELCOME10',
    discountAmount: 1000,
    validFrom: '2024-01-01T00:00:00Z',
    validTo: '2024-12-31T23:59:59Z',
    isActive: true,
    productIds: [1, 4, 5]
  },
  {
    id: 3,
    code: 'EXPIRED',
    discountAmount: 200,
    validFrom: '2024-01-01T00:00:00Z',
    validTo: '2024-02-01T23:59:59Z',
    isActive: false,
    productIds: [1, 2]
  }
];

export const mockDiscounts: Discount[] = [
  {
    id: 1,
    name: 'Летняя распродажа',
    percentage: 15,
    startDate: '2024-06-01T00:00:00Z',
    endDate: '2024-08-31T23:59:59Z',
    isActive: true,
    productIds: [1, 2, 3, 4]
  },
  {
    id: 2,
    name: 'Скидка на ноутбуки',
    percentage: 20,
    startDate: '2024-07-01T00:00:00Z',
    endDate: '2024-07-31T23:59:59Z',
    isActive: true,
    productIds: [2, 3]
  },
  {
    id: 3,
    name: 'Черная пятница',
    percentage: 25,
    startDate: '2024-11-29T00:00:00Z',
    endDate: '2024-11-30T23:59:59Z',
    isActive: false,
    productIds: [1, 2, 3, 4, 5]
  }
];

export const mockPromoCodes: PromoCode[] = [
  {
    id: 1,
    code: 'SAVE20',
    discountPercentage: 20,
    validFrom: '2024-06-01T00:00:00Z',
    validTo: '2024-12-31T23:59:59Z',
    isActive: true,
    applicableProductIds: [1, 2, 3, 4, 5]
  },
  {
    id: 2,
    code: 'NEWUSER',
    discountPercentage: 10,
    validFrom: '2024-01-01T00:00:00Z',
    validTo: '2024-12-31T23:59:59Z',
    isActive: true,
    applicableProductIds: [1, 2, 3, 4, 5]
  },
  {
    id: 3,
    code: 'SPECIAL50',
    discountPercentage: 50,
    validFrom: '2024-12-01T00:00:00Z',
    validTo: '2024-12-31T23:59:59Z',
    isActive: false,
    applicableProductIds: [1, 2]
  }
];

// Функция для получения активных промоций
export const getActiveCoupons = () => mockCoupons.filter(c => c.isActive);
export const getActiveDiscounts = () => mockDiscounts.filter(d => d.isActive);
export const getActivePromoCodes = () => mockPromoCodes.filter(p => p.isActive);

// Функция для поиска промокода по коду
export const findPromoCodeByCode = (code: string) => 
  mockPromoCodes.find(p => p.code.toLowerCase() === code.toLowerCase() && p.isActive);

// Функция для поиска купона по коду
export const findCouponByCode = (code: string) => 
  mockCoupons.find(c => c.code.toLowerCase() === code.toLowerCase() && c.isActive);

// Функция для получения скидки для конкретного продукта
export const getDiscountForProduct = (productId: number) => 
  mockDiscounts.find(d => d.isActive && d.productIds.includes(productId));
