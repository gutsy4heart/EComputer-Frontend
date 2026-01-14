'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CartItemComponent } from './CartItem';
import { Button } from '../ui';
import { useCartContext } from '../../context';
import { Icons } from '../ui/icons'; // Импорт централизованных иконок

const CartListComponent: React.FC = () => {
  const router = useRouter();
  const { cart, loading, error, totalItems, totalQuantity } = useCartContext();

  const handleContinueShopping = useCallback(() => {
    router.push('/products');
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/10 border-t-indigo-500 border-r-purple-500 border-b-pink-500"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-indigo-500 opacity-20"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-red-400 text-4xl mb-4">
            <Icons.CancelIcon className="w-10 h-10" />
          </div>
          <div className="text-red-200 text-lg">{error}</div>
        </div>
      </div>
    );
  }

  if (!cart || totalItems === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="text-white/40 text-6xl mb-4">
          <Icons.Cart className="w-16 h-16" />
        </div>
        <div className="text-white/60 text-lg font-medium mb-4">Your cart is empty.</div>
        <Button
          variant="primary"
          onClick={handleContinueShopping}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Shopping Cart</h2>
        <p className="text-white/60 text-sm">({totalQuantity} items)</p>
      </div>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <CartItemComponent key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-8">
        <Button
          variant="outline"
          onClick={handleContinueShopping}
          className="bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white transition-all duration-300"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export const CartList = React.memo(CartListComponent);
