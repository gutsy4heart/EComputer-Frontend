'use client';
 
import { createContext, useContext, ReactNode } from 'react';
import { useCart } from '../hooks';
import { Cart } from '../types';

 
interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  itemsLoading: boolean;
  error: string | null;
  loadCart: () => Promise<void>;
  forceReloadCart: () => Promise<boolean>;
  addProductToCart: (productId: number, quantity?: number) => Promise<boolean>;
  updateCartItemQuantity: (cartItemId: number, quantity: number) => Promise<boolean>;
  removeCartItem: (cartItemId: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  fixCartQuantities: () => Promise<void>;
  totalItems: number;
  totalQuantity: number;
  totalPrice: number;
}

 
const CartContext = createContext<CartContextType | undefined>(undefined);

 
interface CartProviderProps {
  children: ReactNode;
}
 
export const CartProvider = ({ children }: CartProviderProps) => {
  const cartHook = useCart();

  return (
    <CartContext.Provider value={cartHook}>
      {children}
    </CartContext.Provider>
  );
};

 
export const useCartContext = () => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  
  return context;
};
