// CheckoutPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Button, Input } from '../../components';
import { useAuthContext, useCartContext } from '../../context';
import { formatPrice } from '../../utils';
import { useOrders } from '../../hooks/useOrders';
import { usePromotions } from '../../hooks/usePromotions';
import { calculateFinalPrice } from '../../utils/promotionCalculator';
import DiscountInput from '../../components/cart/DiscountInput';
import { OrderCalculationDto } from '../../types/order';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuthContext();
  const { cart, totalPrice, loading: cartLoading, clearCart } = useCartContext();
  const { getActiveDiscounts } = usePromotions();
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    general: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [discountCalculation, setDiscountCalculation] = useState<OrderCalculationDto | null>(null);

  // Calculate totals with discounts
  const activeDiscounts = getActiveDiscounts();
  const cartItems = cart?.items.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
    originalPrice: item.price
  })) || [];

  // Use discountCalculation if available, otherwise use basic calculation
  let originalTotal, finalTotal, totalSavings;

  if (discountCalculation) {
    originalTotal = discountCalculation.originalTotal;
    finalTotal = discountCalculation.finalTotal;
    totalSavings = discountCalculation.totalSavings;
  } else {
    const calculation = calculateFinalPrice(cartItems, {
      discount: activeDiscounts.length > 0 ? activeDiscounts[0] : undefined,
      promoCode: undefined,
      coupon: undefined
    });
    originalTotal = calculation.subtotal;
    finalTotal = calculation.total;
    totalSavings = calculation.savings;
  }
 
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        address: user.address || '',
      }));
    }
  }, [user]);
 
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log('[CheckoutPage] User is not authenticated, but allowing guest checkout');
    }
  }, [isAuthenticated, authLoading]);
  
  
  useEffect(() => {
    if (!cartLoading && (!cart || cart.items.length === 0) && !orderComplete) {
      router.push('/cart');
    }
  }, [cart, cartLoading, orderComplete, router]);
  
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleDiscountsCalculated = (calculation: OrderCalculationDto) => {
    setDiscountCalculation(calculation);
  };

  const handleDiscountsCleared = () => {
    setDiscountCalculation(null);
  };
  
 
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      address: '',
      city: '',
      zipCode: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      general: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      valid = false;
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
      valid = false;
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
      valid = false;
    }

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
      valid = false;
    } else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
      valid = false;
    }

    if (!formData.cardExpiry.trim()) {
      newErrors.cardExpiry = 'Card expiry is required';
      valid = false;
    } else {
      const [month, year] = formData.cardExpiry.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.cardExpiry = 'Invalid month';
        valid = false;
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.cardExpiry = 'Card has expired';
        valid = false;
      }
    }

    if (!formData.cardCvc.trim()) {
      newErrors.cardCvc = 'CVC is required';
      valid = false;
    } else if (formData.cardCvc.length !== 3) {
      newErrors.cardCvc = 'CVC must be 3 digits';
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!cart?.id) {
      setFormErrors(prev => ({ ...prev, general: 'Cart not found' }));
      return;
    }
    
    setIsSubmitting(true);
    setFormErrors(prev => ({ ...prev, general: '' }));
    
    try {
      // Create order using new order service with discounts
      const { OrderService } = await import('../../services/order.service');
      const orderService = OrderService.getInstance();
      
      // Extract coupon and promo codes from discount calculation
      const couponCode = discountCalculation?.appliedCoupon?.couponCode;
      const promoCode = discountCalculation?.appliedPromoCode?.promoCode;
      
      const result = await orderService.createOrderWithDiscounts({
        cartId: cart.id,
        couponCode: couponCode,
        promoCode: promoCode
      });
      
      console.log('[CheckoutPage] Order created successfully with discounts:', result);
      
      // Clear cart and show success
      clearCart();
      setOrderComplete(true);
      
      // Redirect to success page or orders page
      setTimeout(() => {
        router.push('/orders');
      }, 2000);
      
    } catch (error) {
      console.error('[CheckoutPage] Error creating order:', error);
      setFormErrors(prev => ({ 
        ...prev, 
        general: error instanceof Error ? error.message : 'Failed to create order' 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">
              Checkout
            </h1>
            
            {orderComplete ? (
              <div className="text-center py-12">
                <div className="text-green-400 text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-white mb-4">Order Placed Successfully!</h2>
                <p className="text-white/70">Redirecting to your orders...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Checkout Form */}
                <div className="lg:col-span-2 bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Shipping Information</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={formErrors.name}
                        required
                      />
                      <Input
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        error={formErrors.address}
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="City"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          error={formErrors.city}
                          required
                        />
                        <Input
                          label="ZIP Code"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          error={formErrors.zipCode}
                          required
                        />
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Payment Information</h3>
                      <Input
                        label="Card Number"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          setFormData(prev => ({ ...prev, cardNumber: formatted }));
                          setFormErrors(prev => ({ ...prev, cardNumber: '' }));
                        }}
                        error={formErrors.cardNumber}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Expiry Date"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={(e) => {
                            const formatted = formatExpiry(e.target.value);
                            setFormData(prev => ({ ...prev, cardExpiry: formatted }));
                            setFormErrors(prev => ({ ...prev, cardExpiry: '' }));
                          }}
                          error={formErrors.cardExpiry}
                          placeholder="MM/YY"
                          required
                        />
                        <Input
                          label="CVC"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleChange}
                          error={formErrors.cardCvc}
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>

                    {formErrors.general && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <p className="text-red-400 text-sm">{formErrors.general}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold text-lg rounded-xl transition-all duration-300"
                    >
                      {isSubmitting ? 'Processing...' : `Place Order - ${formatPrice(finalTotal)}`}
                    </Button>
                  </form>
                </div>

                {/* Discounts & Promotions Section */}
                <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Discounts & Promotions</h2>
                  <p className="text-white/60 text-sm mb-6">
                    Apply coupons and promo codes to save on your order
                  </p>
                  
                  <DiscountInput
                    onDiscountsCalculated={handleDiscountsCalculated}
                    onDiscountsCleared={handleDiscountsCleared}
                  />
                </div>

                {/* Order Summary */}
                <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Subtotal:</span>
                      <span className="text-white font-semibold">{formatPrice(originalTotal)}</span>
                    </div>
                    
                    {/* Applied Discounts */}
                    {discountCalculation?.appliedDiscounts && discountCalculation.appliedDiscounts.length > 0 && (
                      <div className="space-y-2">
                        {discountCalculation.appliedDiscounts.map((discount) => (
                          <div key={discount.discountId} className="flex justify-between items-center">
                            <span className="text-white/80">{discount.discountName}:</span>
                            <span className="text-emerald-400 font-semibold">-{formatPrice(discount.discountAmount)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Applied Coupon */}
                    {discountCalculation?.appliedCoupon && (
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Coupon ({discountCalculation.appliedCoupon.couponCode}):</span>
                        <span className="text-emerald-400 font-semibold">-{formatPrice(discountCalculation.appliedCoupon.discountAmount)}</span>
                      </div>
                    )}

                    {/* Applied Promo Code */}
                    {discountCalculation?.appliedPromoCode && (
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Promo Code ({discountCalculation.appliedPromoCode.promoCode}):</span>
                        <span className="text-emerald-400 font-semibold">-{formatPrice(discountCalculation.appliedPromoCode.discountAmount)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Shipping:</span>
                      <span className="text-green-400 font-semibold">Free</span>
                    </div>
                    
                    <div className="border-t border-white/20 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-bold text-lg">Total:</span>
                        <span className="text-emerald-300 font-bold text-2xl">{formatPrice(finalTotal)}</span>
                      </div>
                      
                      {totalSavings > 0 && (
                        <div className="mt-2 text-center">
                          <span className="text-emerald-300 text-sm">
                            You save: {formatPrice(totalSavings)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
