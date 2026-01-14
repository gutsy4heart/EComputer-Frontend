'use client';

import React from 'react';
import { Discount } from '../../types/promotion';
import { formatPrice } from '../../utils';

interface ProductDiscountProps {
  productId: number;
  originalPrice: number;
  discounts: Discount[];
  className?: string;
}

export default function ProductDiscount({ 
  productId, 
  originalPrice, 
  discounts, 
  className = '' 
}: ProductDiscountProps) {
  
  if (!Array.isArray(discounts)) {
    return null;
  }
  
  const activeDiscount = discounts.find(d => 
    d.isActive && d.productIds.includes(productId)
  );

  if (!activeDiscount) return null;

  const discountedPrice = originalPrice * (1 - activeDiscount.percentage / 100);

  return (
    <div className={`product-discount ${className} w-full`}>
      <div className="flex flex-wrap items-center gap-2 w-full">
        <span className="text-white/60 line-through text-lg font-medium flex-shrink-0">
          {formatPrice(originalPrice)}
        </span>
        <span className="text-2xl font-bold text-emerald-400 flex-shrink-0 min-w-0 break-words">
          {formatPrice(discountedPrice)}
        </span>
        <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full animate-pulse shadow-lg flex-shrink-0 whitespace-nowrap">
          -{activeDiscount.percentage}%
        </span>
      </div>
      <div className="mt-2 w-full">
        <span className="text-emerald-400 text-sm font-medium break-words">
          {activeDiscount.name}
        </span>
      </div>
    </div>
  );
}
