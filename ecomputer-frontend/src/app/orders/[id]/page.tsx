'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthContext } from '../../../context';
import { useOrders } from '../../../hooks/useOrders';
import { usePromotions } from '../../../hooks/usePromotions';
import { Order } from '../../../types/order';
import { OrderService } from '../../../services/order.service';
import { calculateOrderDetails, formatOrderPrice } from '../../../utils/orderCalculator';
import { calculateFinalPrice } from '../../../utils/promotionCalculator';
import { formatPrice } from '../../../utils';

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthContext();
  const { getOrderById, loading: ordersLoading, error: ordersError } = useOrders();
  const { getActiveDiscounts } = usePromotions();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const orderService = OrderService.getInstance();

  const orderId = params.id ? parseInt(params.id as string) : null;

  const loadOrder = useCallback(async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      setError(null);

      // Используем метод с категорией для обычных пользователей
      const order = await orderService.getOrderByIdWithCategory(orderId);

      if (order) {
        console.log('[OrderDetails] Order loaded:', order);
        console.log('[OrderDetails] Order createdAt:', order.createdAt);
        setOrder(order);
      } else {
        setError('Заказ не найден');
      }
    } catch (error) {
      console.error('Error loading order:', error);
      setError('Ошибка при загрузке заказа');
    } finally {
      setLoading(false);
    }
  }, [orderId, orderService]);

  useEffect(() => {
    if (orderId && user) {
      loadOrder();
    }
  }, [orderId, user, loadOrder]);

  // Показываем loading из hook если он активен
  const isLoading = loading || ordersLoading;
  const currentError = error || ordersError;

  const getStatusColor = (status: string | number) => {
    const statusStr = typeof status === 'number' ? status.toString() : status;

    switch (statusStr) {
      case '0':
      case 'Pending':
        return 'bg-gradient-to-r from-yellow-600 to-orange-500';
      case '1':
      case 'Processing':
        return 'bg-gradient-to-r from-blue-600 to-blue-500';
      case '2':
      case 'Shipped':
        return 'bg-gradient-to-r from-purple-600 to-purple-500';
      case '3':
      case 'Delivered':
        return 'bg-gradient-to-r from-green-600 to-green-500';
      case '4':
      case 'Cancelled':
        return 'bg-gradient-to-r from-red-600 to-red-500';
      default:
        return 'bg-gradient-to-r from-gray-600 to-gray-500';
    }
  };

  const getStatusText = (status: string | number) => {
    const statusStr = typeof status === 'number' ? status.toString() : status;

    switch (statusStr) {
      case '0':
      case 'Pending':
        return 'Pending';
      case '1':
      case 'Processing':
        return 'Processing';
      case '2':
      case 'Shipped':
        return 'Shipped';
      case '3':
      case 'Delivered':
        return 'Delivered';
      case '4':
      case 'Cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (currentError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-4xl mb-4">❌</div>
          <p className="text-red-300">{currentError}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <p className="text-gray-400 text-lg">Order not found</p>
        </div>
      </div>
    );
  }

  // Calculate order details with promotions
  const calculateOrderPricing = (order: Order) => {
    // Use the new order structure with pre-calculated totals
    return {
      originalTotal: order.originalTotal || 0,
      finalTotal: order.finalTotal || 0,
      totalSavings: order.totalSavings || 0
    };
  };

  const pricing = calculateOrderPricing(order);
  const { originalTotal, finalTotal, totalSavings } = pricing;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.push('/orders')}
              className="p-3 rounded-2xl bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/40 transition-all duration-300"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-4xl font-bold text-white">Order #{order.id}</h1>
            <div className="w-12"></div> {/* Spacer for centering */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Information */}
              <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Order Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <span className="text-white/60 text-sm">Order ID:</span>
                      <p className="text-white font-semibold">#{order.id}</p>
                    </div>
                    <div>
                      <span className="text-white/60 text-sm">Date:</span>
                      <p className="text-white font-semibold">
                        {order.createdDate ? new Date(order.createdDate).toLocaleDateString() :
                          order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-white/60 text-sm">Status:</span>
                      <div className="mt-1">
                        <span className={`px-3 py-1 text-white text-sm rounded-full font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-white/60 text-sm">Items Count:</span>
                      <p className="text-white font-semibold">
                        {(order.items || order.orderItems || []).length} items
                      </p>
                    </div>
                    <div>
                      <span className="text-white/60 text-sm">Total Quantity:</span>
                      <p className="text-white font-semibold">
                        {(order.items || order.orderItems || []).reduce((sum, item) => sum + item.quantity, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-2xl font-bold text-white">Order Items</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="py-4 px-6 text-left text-white font-bold text-sm">Product</th>
                        <th className="py-4 px-6 text-left text-white font-bold text-sm">Category</th>
                        <th className="py-4 px-6 text-left text-white font-bold text-sm">Quantity</th>
                        <th className="py-4 px-6 text-left text-white font-bold text-sm">Price</th>
                        <th className="py-4 px-6 text-left text-white font-bold text-sm">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(order.items || order.orderItems || []).map((item, index) => (
                        <tr
                          key={index}
                          className={`border-b border-white/5 ${index % 2 === 0 ? 'bg-white/5' : 'bg-white/2'
                            }`}
                        >
                          <td className="py-4 px-6 text-white font-semibold">
                            {item.productName || 'Unknown Product'}
                          </td>
                          <td className="py-4 px-6 text-white/80">
                            {item.categoryName || 'Unknown Category'}
                          </td>
                          <td className="py-4 px-6 text-white font-medium">
                            {item.quantity}
                          </td>
                          <td className="py-4 px-6">
                            {(() => {
                              // Use the new structure with pre-calculated prices
                              const originalPrice = item.priceAtPurchase || item.price || 0;
                              const finalPrice = item.finalPriceAtPurchase || item.price || 0;
                              const hasDiscount = item.discountAtPurchase > 0;

                              if (hasDiscount) {
                                return (
                                  <div className="space-y-1">
                                    <div className="text-white/60 text-sm line-through">
                                      {formatOrderPrice(originalPrice)}
                                    </div>
                                    <div className="text-emerald-400 font-bold">
                                      {formatOrderPrice(finalPrice)}
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <div className="text-emerald-400 font-bold">
                                  {formatOrderPrice(finalPrice)}
                                </div>
                              );
                            })()}
                          </td>
                          <td className="py-4 px-6">
                            {(() => {
                              // Use the new structure with pre-calculated prices
                              const originalPrice = item.priceAtPurchase || item.price || 0;
                              const finalPrice = item.finalPriceAtPurchase || item.price || 0;
                              const hasDiscount = item.discountAtPurchase > 0;

                              if (hasDiscount) {
                                const originalTotal = originalPrice * item.quantity;
                                const finalTotal = finalPrice * item.quantity;
                                return (
                                  <div className="space-y-1">
                                    <div className="text-white/60 text-sm line-through">
                                      {formatOrderPrice(originalTotal)}
                                    </div>
                                    <div className="text-emerald-400 font-bold">
                                      {formatOrderPrice(finalTotal)}
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <div className="text-emerald-400 font-bold">
                                  {formatOrderPrice(finalPrice * item.quantity)}
                                </div>
                              );
                            })()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Breakdown */}
              <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Price Breakdown</h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Subtotal:</span>
                    <span className="text-white font-semibold">{formatPrice(originalTotal)}</span>
                  </div>

                  {totalSavings > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Discount:</span>
                      <span className="text-emerald-400 font-semibold">-{formatPrice(totalSavings)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Shipping:</span>
                    <span className="text-green-400 font-semibold">Free</span>
                  </div>

                  <div className="border-t border-white/20 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold text-lg">Total:</span>
                      <span className="text-emerald-300 font-bold text-xl">{formatPrice(finalTotal)}</span>
                    </div>

                    {totalSavings > 0 && (
                      <div className="mt-2 text-center">
                        <span className="text-emerald-300 text-sm">
                          You saved: {formatPrice(totalSavings)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Applied Codes */}
                {(order.appliedCouponCode || order.appliedPromoCode) && (
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <h3 className="text-lg font-semibold text-white mb-4">Applied Codes</h3>
                    <div className="space-y-3">
                      {order.appliedCouponCode && (
                        <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-white/80 font-medium">Coupon Code:</span>
                          </div>
                          <span className="text-blue-300 font-bold text-lg">{order.appliedCouponCode}</span>
                        </div>
                      )}
                      {order.appliedPromoCode && (
                        <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span className="text-white/80 font-medium">Promo Code:</span>
                          </div>
                          <span className="text-purple-300 font-bold text-lg">{order.appliedPromoCode}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Info */}
              {order.user && (
                <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Customer Information</h2>

                  <div className="space-y-4">
                    <div>
                      <span className="text-white/60 text-sm">Name:</span>
                      <p className="text-white font-semibold">{order.user.name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-white/60 text-sm">Email:</span>
                      <p className="text-white font-semibold">{order.user.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
