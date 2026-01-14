import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { cartService, cartItemService } from '../services';
import { Cart, AddCartItemRequest, UpdateCartItemRequest } from '../types';
import { useAuth } from './useAuth';

export const useCart = () => {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previousUserId = useRef<number | null>(null);

  const loadCart = useCallback(async () => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setCart(null);
      setItemsLoading(false);
      return;
    }

    if (previousUserId.current !== null && previousUserId.current !== user.id) {
      setCart(null);
    }
    previousUserId.current = user.id;

    try {
      setItemsLoading(true);
      const cartData = await cartService.getCartById(user.id);
      setCart(cartData);
    } catch (err) {
      console.error('[Cart] Failed to load cart:', err);
    } finally {
      setItemsLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!authLoading) {
      setLoading(true);
      loadCart().finally(() => setLoading(false));
    }
  }, [user, authLoading]);

  useEffect(() => {
    const handleUserChanged = () => {
      setLoading(true);
      setCart(null);
      previousUserId.current = null;
      loadCart().finally(() => setLoading(false));
    };

    window.addEventListener('userChanged', handleUserChanged);
    
    return () => {
      window.removeEventListener('userChanged', handleUserChanged);
    };
  }, [loadCart]);

  const updateCartItemQuantity = useCallback(async (cartItemId: number, quantity: number) => {
    if (!cart) return false;
    const item = cart.items.find(i => i.id === cartItemId);
    if (!item) return false;
    
    if (item.quantity === quantity) return true;
    
    if (quantity === 0) return false;

    try {
      setItemsLoading(true);
      const success = await cartItemService.updateCartItemQuantity({ id: cartItemId, quantity });
      if (success) {
        await loadCart();
      }
      return success;
    } catch (err) {
      console.error(err);
      await loadCart();
      return false;
    } finally {
      setItemsLoading(false);
    }
  }, [cart, loadCart]);

  const addProductToCart = useCallback(async (productId: number, quantity = 1) => {
    if (authLoading) return false;
    if (!user) return false;
    if (!cart) {
      setLoading(true);
      await loadCart();
      setLoading(false);
      if (!cart) return false;
    }

    // Найти товар в корзине
    const existingItem = cart.items.find(i => i.productId === productId);
    if (existingItem) {
      // Увеличить количество, но не больше stock
      const newQuantity = Math.min(existingItem.quantity + quantity, existingItem.stock);
      if (newQuantity > existingItem.quantity) {
        return await updateCartItemQuantity(existingItem.id, newQuantity);
      }
      return false;
    }

    // Если товара нет в корзине — добавить новый CartItem
    try {
      setItemsLoading(true);
      const success = await cartItemService.addProductToCart({
        cartId: cart.id,
        productId,
        quantity,
      });
      if (success) {
        await loadCart();
      }
      return success;
    } catch (err) {
      console.error('[Cart] Error adding product to cart:', err);
      await loadCart();
      return false;
    } finally {
      setItemsLoading(false);
    }
  }, [cart, loadCart, user, authLoading, updateCartItemQuantity]);

  const removeCartItem = useCallback(async (cartItemId: number) => {
    if (!cart) return false;
    
    try {
      setItemsLoading(true);
      
      // Optimistic update - immediately update the cart state
      const itemToRemove = cart.items.find(item => item.id === cartItemId);
      if (!itemToRemove) return false;
      
      const updatedCart = {
        ...cart,
        items: cart.items.filter(item => item.id !== cartItemId),
        totalSum: cart.items.reduce((sum, item) => {
          if (item.id !== cartItemId) {
            return sum + item.totalSum;
          }
          return sum;
        }, 0)
      };
      
      setCart(updatedCart);
      
      const success = await cartItemService.removeCartItem(cartItemId);
      if (success) {
        // Reload cart to get the actual data
        await loadCart();
      } else {
        // Revert optimistic update on failure
        setCart(cart);
      }
      return success;
    } catch (err) {
      console.error(err);
      // Revert optimistic update on error
      setCart(cart);
      return false;
    } finally {
      setItemsLoading(false);
    }
  }, [cart, loadCart]);

  const clearCart = useCallback(async () => {
    if (!cart) return false;
    try {
      setItemsLoading(true);
      const success = await cartService.clearCart(cart.id);
      if (success) await loadCart();
      return success;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setItemsLoading(false);
    }
  }, [cart, loadCart]);

  const forceReloadCart = useCallback(async () => {
    if (!user) {
      return false;
    }

    try {
      setLoading(true);
      setCart(null);
      previousUserId.current = null;
      await loadCart();
      return true;
    } catch (err) {
      console.error('[Cart] Error force reloading cart:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, loadCart]);

  // Функция для автоматической коррекции количества в корзине, если оно превышает остаток на складе
  const fixCartQuantities = useCallback(async () => {
    if (!cart) return;
    let changed = false;
    for (const item of cart.items) {
      // Если на складе стало меньше, чем в корзине, корректируем
      if (item.quantity > item.stock) {
        if (item.stock <= 0) {
          await removeCartItem(item.id);
        } else {
          await updateCartItemQuantity(item.id, item.stock);
        }
        changed = true;
      }
    }
    if (changed) {
      // alert('Some items in your cart have been updated due to stock changes.');
      await loadCart();
    }
  }, [cart, updateCartItemQuantity, removeCartItem, loadCart]);

  const totalItems = useMemo(() => cart?.items.length ?? 0, [cart]);
  const totalQuantity = useMemo(() => cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0, [cart]);
  const totalPrice = useMemo(() => cart?.totalSum ?? 0, [cart]);

  useEffect(() => {
    if (!loading && cart) {
      fixCartQuantities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return {
    cart,
    loading,
    itemsLoading,
    error,
    loadCart,
    forceReloadCart,
    addProductToCart,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
    totalItems,
    totalQuantity,
    totalPrice,
    fixCartQuantities,
  };
};

