'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../context';
import { useOrders } from '../../hooks/useOrders';
import { usePromotions } from '../../hooks/usePromotions';
import { Order } from '../../types/order';
import { formatPrice } from '../../utils';
import { calculateFinalPrice } from '../../utils/promotionCalculator';

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { orders, loading, error, loadOrders } = useOrders();
  const { getActiveDiscounts } = usePromotions();

  useEffect(() => {
    console.log('[OrdersPage] useEffect triggered, user:', user);
    if (user) {
      console.log('[OrdersPage] User found, calling loadOrders');
      loadOrders();
    } else {
      console.log('[OrdersPage] No user found');
    }
  }, [user, loadOrders]);

  const handleViewOrder = (id: number) => {
    router.push(`/orders/${id}`);
  };

  // Функция для расчета скидок для заказа
  const calculateOrderPricing = (order: Order) => {
    // Use the new order structure with pre-calculated totals
    return {
      originalTotal: order.originalTotal || 0,
      finalTotal: order.finalTotal || 0,
      totalSavings: order.totalSavings || 0
    };
  };

  const getStatusColor = (status: string | number) => {
    // Handle both string and numeric status values
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
    console.log('[OrdersPage] getStatusText input:', status, 'type:', typeof status);
    const statusStr = typeof status === 'number' ? status.toString() : status;
    console.log('[OrdersPage] getStatusText converted:', statusStr);
    
    switch (statusStr) {
      case '0':
        return 'Pending';
      case '1':
        return 'Processing';
      case '2':
        return 'Shipped';
      case '3':
        return 'Delivered';
      case '4':
        return 'Cancelled';
      default:
        console.warn('[OrdersPage] Unknown status value:', statusStr);
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string | undefined) => {
    try {
      // Проверяем, что dateString не пустой и не null
      if (!dateString || dateString === 'null' || dateString === 'undefined') {
        return 'N/A';
      }
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return 'N/A';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-4xl mb-4">❌</div>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with back button */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.push('/')}
              className="p-3 rounded-2xl bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/40 transition-all duration-300 group"
            >
              <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-4xl font-bold text-white">
              Order History
            </h1>
            <div className="w-12"></div> {/* Spacer for centering */}
          </div>
          
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <p className="text-gray-400 text-lg">No orders found</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-6 hover:bg-black/40 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-xl font-bold text-white">Order #{order.id}</h3>
                        <span className={`px-3 py-1 text-white text-xs rounded-full font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-white/60">Customer:</span>
                          <span className="text-white ml-2">{order.user?.name || 'Unknown'}</span>
                        </div>
                        <div>
                          <span className="text-white/60">Date:</span>
                          <span className="text-white ml-2">{formatDate(order.createdDate || order.createdAt || '')}</span>
                        </div>
                        <div>
                          <span className="text-white/60">Items:</span>
                          <span className="text-white ml-2">
                            {(order.items || order.orderItems || []).length} items
                          </span>
                        </div>
                        <div>
                          <span className="text-white/60">Total Quantity:</span>
                          <span className="text-white ml-2">
                            {(order.items || order.orderItems || []).reduce((sum, item) => sum + item.quantity, 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Information */}
                    <div className="text-right">
                      {(() => {
                        const pricing = calculateOrderPricing(order);
                        return (
                          <div className="space-y-2">
                            {/* Original Total */}
                            {pricing.totalSavings > 0 && (
                              <div className="text-white/60 text-sm line-through">
                                {formatPrice(pricing.originalTotal)}
                              </div>
                            )}
                            
                            {/* Final Total */}
                            <div className="text-emerald-300 font-bold text-xl">
                              {formatPrice(pricing.finalTotal)}
                            </div>
                            
                            {/* Savings */}
                            {pricing.totalSavings > 0 && (
                              <div className="text-emerald-400 text-sm font-medium">
                                Saved: {formatPrice(pricing.totalSavings)}
                              </div>
                            )}
                            
                            {/* Applied Codes */}
                            {(order.appliedCouponCode || order.appliedPromoCode) && (
                              <div className="flex flex-wrap gap-2 justify-end mt-2">
                                {order.appliedCouponCode && (
                                  <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs rounded-full font-medium">
                                    Coupon: {order.appliedCouponCode}
                                  </span>
                                )}
                                {order.appliedPromoCode && (
                                  <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs rounded-full font-medium">
                                    Promo: {order.appliedPromoCode}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* View Button */}
                    <div className="lg:ml-4">
                      <button
                        onClick={() => handleViewOrder(order.id)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
