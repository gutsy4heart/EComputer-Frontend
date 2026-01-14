'use client';

import React, { useState } from 'react';
import { PromoCode } from '../../types/promotion';
import { promotionService } from '../../services/promotion.service';
import { Icons } from '../ui/icons';

interface PromoCodeInputProps {
  onPromoCodeApplied: (promoCode: PromoCode) => void;
  onPromoCodeRemoved: () => void;
  appliedPromoCode?: PromoCode | null;
  className?: string;
}

export default function PromoCodeInput({ 
  onPromoCodeApplied, 
  onPromoCodeRemoved, 
  appliedPromoCode,
  className = '' 
}: PromoCodeInputProps) {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validatePromoCode = async () => {
    if (!code.trim()) {
      setError('Введите код промокода');
      return;
    }

    setIsValidating(true);
    setError('');
    setSuccess('');

    try {
      const promoCode = await promotionService.getPromoCodeByCode(code.trim());
      
      if (promoCode && promoCode.isActive) {
        setSuccess(`Промокод "${promoCode.code}" применен! Скидка: ${promoCode.discountPercentage}%`);
        onPromoCodeApplied(promoCode);
        setCode('');
      } else {
        setError('Промокод не найден или недействителен');
      }
    } catch (err) {
      setError('Ошибка при проверке промокода');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemovePromoCode = () => {
    onPromoCodeRemoved();
    setSuccess('');
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') validatePromoCode();
  };

  return (
    <div className={`promo-code-input ${className}`}>
      {appliedPromoCode ? (
        <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-emerald-500/30 rounded-lg flex items-center justify-center">
                  <Icons.Delivered className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-emerald-400 font-semibold text-lg">
                  Промокод применен
                </span>
                <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                  {appliedPromoCode.code}
                </span>
              </div>
              <p className="text-emerald-300 text-sm font-medium ml-11">
                Скидка: {appliedPromoCode.discountPercentage}%
              </p>
            </div>
            <button
              onClick={handleRemovePromoCode}
              className="p-3 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 rounded-xl transition-all duration-300 ml-4"
            >
              <Icons.Close className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Введите промокод"
                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-lg font-medium"
                disabled={isValidating}
              />
            </div>
            <button
              onClick={validatePromoCode}
              disabled={isValidating || !code.trim()}
              className="px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-800 text-white font-bold rounded-2xl transition-all duration-300 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105 disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isValidating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Проверка...</span>
                </>
              ) : (
                <>
                  <Icons.Money className="w-5 h-5" />
                  <span>Применить</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-2xl p-4 backdrop-blur-sm flex items-center space-x-3">
              <Icons.CancelIcon className="w-6 h-6 text-red-400" />
              <p className="text-red-300 text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-2xl p-4 backdrop-blur-sm flex items-center space-x-3">
              <Icons.Delivered className="w-6 h-6 text-white" />
              <p className="text-emerald-300 text-sm font-medium">{success}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
