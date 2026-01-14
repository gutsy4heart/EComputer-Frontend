'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import { CartItem as CartItemType } from '../../types';
import { Button } from '../ui';
import { formatPrice, getProxiedImageUrl } from '../../utils';
import { useCartContext } from '../../context';

interface CartItemProps {
  item: CartItemType;
}

const CartItemBase = ({ item }: CartItemProps) => {
  const { updateCartItemQuantity, removeCartItem } = useCartContext();

  const handleQuantityChange = useCallback((newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= item.stock && newQuantity !== item.quantity) {
      updateCartItemQuantity(item.id, newQuantity);
    } else if (newQuantity === 0) {
      removeCartItem(item.id);
    }
  }, [item.id, item.quantity, item.stock, updateCartItemQuantity, removeCartItem]);

  const handleRemoveItem = useCallback(() => {
    removeCartItem(item.id);
  }, [item.id, removeCartItem]);

  return (
    <div className="flex items-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
    
      <div className="w-20 h-20 flex-shrink-0 bg-white/10 rounded-xl overflow-hidden flex items-center justify-center">
        {item.imageUrl ? (
          <Image
            src={getProxiedImageUrl(item.imageUrl)}
            alt={item.productName}
            width={80}
            height={80}
            className="object-cover w-full h-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.endsWith('/no-image.png')) {
                target.src = '/no-image.png';
              }
            }}
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="ml-4 flex-grow">
        <h3 className="text-lg font-semibold text-white mb-1">{item.productName}</h3>
        <p className="text-sm text-white/80 mb-1">Price: <span className="text-emerald-300 font-medium">{formatPrice(item.price)}</span></p>
        <p className="text-xs text-white/60">Available: {item.stock} items</p>
        {item.stock === 0 && (
          <p className="text-xs text-red-400 font-semibold">Out of Stock</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="bg-transparent text-white border-white/20 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          -
        </Button>
        <span className="w-8 text-center text-white font-semibold">{item.quantity}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={item.quantity >= item.stock || item.stock === 0}
          className="bg-transparent text-white border-white/20 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </Button>
      </div>

      <div className="ml-6 w-24 text-right">
        <p className="text-lg font-bold text-emerald-300">{formatPrice(item.totalSum)}</p>
      </div>

      <div className="ml-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemoveItem}
          className="text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export const CartItemComponent = React.memo(CartItemBase);
