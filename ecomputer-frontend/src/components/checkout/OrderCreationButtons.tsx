'use client';

import React, { useState } from 'react';
import { useOrderDiscounts } from '../../hooks/useOrderDiscounts';
import { Button } from '../ui/Button';

interface OrderCreationButtonsProps {
  cartId: number;
  onOrderCreated?: (result: any) => void;
  onError?: (error: string) => void;
}

export const OrderCreationButtons: React.FC<OrderCreationButtonsProps> = ({
  cartId,
  onOrderCreated,
  onError
}) => {
  const { createOrder, createOrderWithDiscounts, loading, error } = useOrderDiscounts();
  const [couponCode, setCouponCode] = useState('');
  const [promoCode, setPromoCode] = useState('');

  const handleSimpleOrder = async () => {
    try {
      const result = await createOrder(cartId);
      onOrderCreated?.(result);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Ошибка создания заказа');
    }
  };

  const handleOrderWithDiscounts = async () => {
    try {
      const result = await createOrderWithDiscounts(
        cartId, 
        couponCode || undefined, 
        promoCode || undefined
      );
      onOrderCreated?.(result);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Ошибка создания заказа со скидками');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-white/20 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-white mb-6">Создать заказ</h3>

        <div className="mb-6 space-y-3">
          <Button
            onClick={handleSimpleOrder}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl py-3 flex justify-center items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Создание заказа...</span>
              </>
            ) : (
              <span>Создать заказ (без скидок)</span>
            )}
          </Button>
          <p className="text-white/60 text-sm">Создать заказ по обычным ценам без применения скидок</p>
        </div>

        <div className="border-t border-white/20 pt-6 space-y-4">
          <h4 className="font-semibold text-white text-lg mb-3">Создать заказ со скидками</h4>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Код купона (необязательно)</label>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Введите код купона"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Промокод (необязательно)</label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Введите промокод"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300"
              />
            </div>

            <Button
              onClick={handleOrderWithDiscounts}
              disabled={loading || (!couponCode.trim() && !promoCode.trim())}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold rounded-xl py-3 flex justify-center items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Создание заказа...</span>
                </>
              ) : (
                <span>Создать заказ со скидками</span>
              )}
            </Button>
            <p className="text-white/60 text-sm">
              Создать заказ с применением указанных скидок, купонов и промокодов
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};
