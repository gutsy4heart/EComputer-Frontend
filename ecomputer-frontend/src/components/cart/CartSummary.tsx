'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui';
import { formatPrice } from '../../utils';
import { useCartContext, useAuthContext } from '../../context';
import { OrderCalculationDto } from '../../types/order';
import { usePromotions } from '../../hooks/usePromotions';
import { calculateFinalPrice } from '../../utils/promotionCalculator';
import { Icons } from '../ui/icons'; // Импорт централизованных иконок

interface CartSummaryProps {
  discountCalculation?: OrderCalculationDto | null;
}

const CartSummaryComponent: React.FC<CartSummaryProps> = ({ discountCalculation = null }) => {
  const router = useRouter();
  const { cart, totalItems, totalQuantity, totalPrice, clearCart } = useCartContext();
  const { isAuthenticated } = useAuthContext();
  const { getActiveDiscounts } = usePromotions();

  const handleCheckout = useCallback(() => {
    router.push('/checkout');
  }, [router]);

  const handleClearCart = useCallback(() => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  }, [clearCart]);

  if (!cart || totalItems === 0) {
    return null;
  }

  let originalTotal = totalPrice;
  let finalTotal = totalPrice;
  let totalSavings = 0;

  if (discountCalculation) {
    originalTotal = discountCalculation.originalTotal;
    finalTotal = discountCalculation.finalTotal;
    totalSavings = discountCalculation.totalSavings;
  } else {
    const activeDiscounts = getActiveDiscounts();
    const cartItems = cart.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      originalPrice: item.price
    }));

    const calculation = calculateFinalPrice(cartItems, {
      discount: activeDiscounts.length > 0 ? activeDiscounts[0] : undefined,
      promoCode: undefined,
      coupon: undefined
    });

    originalTotal = calculation.subtotal;
    finalTotal = calculation.total;
    totalSavings = calculation.savings;
  }

  return (
    <div className="w-full">
      <div className="flex items-center mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mr-4">
          <Icons.Cart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Cart Summary</h2>
          <p className="text-white/60 text-sm mt-1">
            {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <Icons.Cart className="w-4 h-4 text-white/60" />
              </div>
              <span className="text-white/80 font-medium">Subtotal ({totalQuantity} items):</span>
            </div>
            <span className="text-white font-semibold text-lg">{formatPrice(originalTotal)}</span>
          </div>

          {discountCalculation?.appliedDiscounts?.map(discount => (
            <div key={discount.discountId} className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Icons.Money className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-white/80 font-medium">{discount.discountName}:</span>
              </div>
              <span className="text-emerald-400 font-semibold text-lg">-{formatPrice(discount.discountAmount)}</span>
            </div>
          ))}

          {discountCalculation?.appliedCoupon && (
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Icons.Money className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-white/80 font-medium">Coupon ({discountCalculation.appliedCoupon.couponCode}):</span>
              </div>
              <span className="text-blue-400 font-semibold text-lg">-{formatPrice(discountCalculation.appliedCoupon.discountAmount)}</span>
            </div>
          )}

          {discountCalculation?.appliedPromoCode && (
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Icons.Money className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-white/80 font-medium">Promo ({discountCalculation.appliedPromoCode.promoCode}):</span>
              </div>
              <span className="text-purple-400 font-semibold text-lg">-{formatPrice(discountCalculation.appliedPromoCode.discountAmount)}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Icons.Shipping className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-white/80 font-medium">Shipping:</span>
            </div>
            <span className="text-green-400 font-semibold text-lg">Free</span>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                <Icons.Money className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">Total:</span>
            </div>
            <span className="text-emerald-400 font-bold text-2xl">{formatPrice(finalTotal)}</span>
          </div>

          {totalSavings > 0 && (
            <div className="mt-3 text-center">
              <span className="text-emerald-300 text-sm font-medium">
                You save: {formatPrice(totalSavings)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Button
          onClick={handleCheckout}
          disabled={!isAuthenticated}
          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isAuthenticated ? (
            <div className="flex items-center justify-center space-x-2">
              <Icons.Shipping className="w-5 h-5" />
              <span>Proceed to Checkout</span>
            </div>
          ) : (
            <span>Sign in to Checkout</span>
          )}
        </Button>

        <Button
          onClick={handleClearCart}
          variant="outline"
          className="w-full py-3 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          <div className="flex items-center justify-center space-x-2">
            <Icons.Close className="w-4 h-4" />
            <span>Clear Cart</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default CartSummaryComponent;
