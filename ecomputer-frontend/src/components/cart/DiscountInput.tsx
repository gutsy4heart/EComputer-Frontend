'use client';

import React, { useState } from 'react';
import { useOrderDiscounts } from '../../hooks/useOrderDiscounts';
import { useCartContext } from '../../context';
import { OrderCalculationDto } from '../../types/order';
import { Icons } from '../ui/icons'; // Импорт централизованных иконок

interface DiscountInputProps {
  onDiscountsCalculated?: (calculation: OrderCalculationDto) => void;
  onDiscountsCleared?: () => void;
}

export default function DiscountInput({ onDiscountsCalculated, onDiscountsCleared }: DiscountInputProps) {
  const [couponCode, setCouponCode] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const { cart } = useCartContext();
  const { discountCalculation, loading, error, calculateDiscounts, clearDiscountCalculation } = useOrderDiscounts();

  const handleApplyDiscounts = async () => {
    if (!cart?.id) return;

    try {
      const result = await calculateDiscounts(
        cart.id,
        couponCode.trim() || undefined,
        promoCode.trim() || undefined
      );

      onDiscountsCalculated?.(result);
    } catch (err) {
      console.error('Error applying discounts:', err);
    }
  };

  const handleClearDiscounts = () => {
    setCouponCode('');
    setPromoCode('');
    clearDiscountCalculation();
    onDiscountsCleared?.();
  };

  const hasDiscounts = discountCalculation && (
    (discountCalculation.appliedDiscounts?.length ?? 0) > 0 ||
    discountCalculation.appliedCoupon ||
    discountCalculation.appliedPromoCode
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Coupon Code
          </label>
          <input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Promo Code
          </label>
          <input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleApplyDiscounts}
          disabled={loading || (!couponCode.trim() && !promoCode.trim())}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Applying...</span>
            </>
          ) : (
            <>
              <Icons.Money className="w-5 h-5" />
              <span>Apply Discounts</span>
            </>
          )}
        </button>

        {hasDiscounts && (
          <button
            onClick={handleClearDiscounts}
            className="px-4 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Icons.Close className="w-4 h-4" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-2">
          <Icons.CancelIcon className="w-5 h-5 text-red-400" />
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      )}

      {hasDiscounts && discountCalculation && (
        <div className="space-y-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <h4 className="text-emerald-300 font-semibold flex items-center space-x-2">
            <Icons.Delivered className="w-5 h-5" />
            <span>Applied Discounts</span>
          </h4>

          {(discountCalculation.appliedDiscounts?.length ?? 0) > 0 && (
            <div className="space-y-2">
              <h5 className="text-white/80 text-sm font-medium">Product Discounts:</h5>
              {(discountCalculation.appliedDiscounts ?? []).map((discount) => (
                <div key={discount.discountId} className="flex justify-between items-center text-sm">
                  <span className="text-white/70">{discount.discountName}</span>
                  <span className="text-emerald-400 font-semibold">-${discount.discountAmount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          {discountCalculation.appliedCoupon && (
            <div className="space-y-2">
              <h5 className="text-white/80 text-sm font-medium">Applied Coupon:</h5>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">{discountCalculation.appliedCoupon.couponCode}</span>
                <span className="text-emerald-400 font-semibold">-${discountCalculation.appliedCoupon.discountAmount.toFixed(2)}</span>
              </div>
            </div>
          )}

          {discountCalculation.appliedPromoCode && (
            <div className="space-y-2">
              <h5 className="text-white/80 text-sm font-medium">Applied Promo Code:</h5>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">{discountCalculation.appliedPromoCode.promoCode}</span>
                <span className="text-emerald-400 font-semibold">-${discountCalculation.appliedPromoCode.discountAmount.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-emerald-500/20">
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold">Total Savings:</span>
              <span className="text-emerald-300 font-bold text-lg">-${discountCalculation.totalSavings.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
