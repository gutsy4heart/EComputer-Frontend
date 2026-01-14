'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthContext } from '../../../../context';
import { usePromotions } from '../../../../hooks/usePromotions';
import { UserRole } from '../../../../types/user';
import { Order } from '../../../../types/order';
import { OrderService } from '../../../../services/order.service';
import { calculateOrderDetails, formatOrderPrice } from '../../../../utils/orderCalculator';
import { calculateFinalPrice } from '../../../../utils/promotionCalculator';
import { formatPrice } from '../../../../utils';
import { Icons } from '../../../../components/ui/icons';

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuthContext();
  const { getActiveDiscounts } = usePromotions();
  const [order, setOrder] = useState<Order | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const orderService = OrderService.getInstance();

  const orderId = params.id ? parseInt(params.id as string) : null;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin/orders');
    } else if (!loading && user && user.role !== UserRole.Admin) {
      router.push('/');
    } else if (!loading && user && user.role === UserRole.Admin && orderId) {
      loadOrder();
    }
  }, [user, loading, router, orderId]);

  const loadOrder = async () => {
    if (!orderId) return;

    try {
      setOrdersLoading(true);
      setError(null);

      console.log('[AdminOrderDetails] Loading order:', orderId);
      const order = await orderService.getOrderByIdForAdmin(orderId);

      if (order) {
        console.log('[AdminOrderDetails] Order loaded:', order);
        setOrder(order);
      } else {
        setError('Заказ не найден');
      }
    } catch (err) {
      console.error('[AdminOrderDetails] Error loading order:', err);
      setError('Ошибка при загрузке заказа');
    } finally {
      setOrdersLoading(false);
    }
  };

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

  if (loading || ordersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
          <p className="text-white/70 mb-8">{error || 'Order not found'}</p>
          <button
            onClick={() => router.push('/admin/orders')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
          >
            Back to Orders
          </button>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/admin/orders')}
              className="p-3 rounded-2xl bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/40 transition-all duration-300 group"
            >
              <Icons.ArrowLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
            </button>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Order #{order.id}
              </h1>
              <p className="text-white/70 text-lg mt-2">
                Admin Order Details
              </p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary Card */}
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10 animate-pulse"></div>
              <div className="relative z-10">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white">Order Summary</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white font-semibold mb-2">Order Information</h3>
                    <div className="space-y-2 text-white/80">
                      <p><span className="font-medium">Order ID:</span> #{order.id}</p>
                      <p><span className="font-medium">Date:</span> {order.createdDate ? new Date(order.createdDate).toLocaleDateString() :
                        order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                      <p><span className="font-medium">Time:</span> {order.createdDate ? new Date(order.createdDate).toLocaleTimeString() :
                        order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : 'N/A'}</p>
                      <p><span className="font-medium">Status:</span>
                        <span className={`ml-2 px-3 py-1 text-white text-sm rounded-full font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-2">Price Breakdown</h3>
                    <div className="space-y-2 text-white/80">
                      <p><span className="font-medium">Subtotal:</span> <span className="text-white font-semibold">{formatPrice(originalTotal)}</span></p>
                      {totalSavings > 0 && (
                        <p><span className="font-medium">Discount:</span> <span className="text-emerald-400 font-semibold">-{formatPrice(totalSavings)}</span></p>
                      )}
                      <p><span className="font-medium">Total Amount:</span> <span className="text-emerald-300 font-bold text-lg">{formatPrice(finalTotal)}</span></p>
                    </div>

                    {/* Applied Codes */}
                    {(order.appliedCouponCode || order.appliedPromoCode) && (
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <h4 className="text-white font-semibold mb-3">Applied Codes</h4>
                        <div className="space-y-2">
                          {order.appliedCouponCode && (
                            <div className="flex items-center justify-between p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                              <span className="text-white/80 font-medium">Coupon:</span>
                              <span className="text-blue-300 font-bold">{order.appliedCouponCode}</span>
                            </div>
                          )}
                          {order.appliedPromoCode && (
                            <div className="flex items-center justify-between p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                              <span className="text-white/80 font-medium">Promo Code:</span>
                              <span className="text-purple-300 font-bold">{order.appliedPromoCode}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-emerald-600/10 to-teal-600/10 animate-pulse"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-6">Customer Information</h2>

                <div>
                  <h3 className="text-white font-semibold mb-2">Customer Details</h3>
                  <div className="space-y-2 text-white/80">
                    <p><span className="font-medium">Name:</span> {order.user?.name || 'N/A'}</p>
                    <p><span className="font-medium">Email:</span> {order.user?.email || 'N/A'}</p>
                    <p><span className="font-medium">User ID:</span> #{order.userId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-red-600/10 animate-pulse"></div>
              <div className="relative z-10">
                <div className="p-8 border-b border-white/10">
                  <h2 className="text-2xl font-bold text-white">Order Items</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-800/50 to-purple-800/50 border-b border-white/10">
                        <th className="py-4 px-6 text-left text-white font-bold">Product</th>
                        <th className="py-4 px-6 text-left text-white font-bold">Category</th>
                        <th className="py-4 px-6 text-left text-white font-bold">Quantity</th>
                        <th className="py-4 px-6 text-left text-white font-bold">Price</th>
                        <th className="py-4 px-6 text-left text-white font-bold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(order.orderItems || order.items) && (order.orderItems || order.items)!.length > 0 ? (
                        (order.orderItems || order.items)!.map((item, index) => (
                          <tr
                            key={index}
                            className={`border-b border-white/5 hover:bg-white/5 transition-all duration-300 ${index % 2 === 0 ? 'bg-white/5' : 'bg-white/2'
                              }`}
                          >
                            <td className="py-4 px-6 text-white font-semibold">
                              {item.productName || (item as any).product?.name || 'Unknown Product'}
                            </td>
                            <td className="py-4 px-6 text-white/80">
                              {item.categoryName || (item as any).product?.category?.name || (item as any).product?.categoryName || 'Unknown Category'}
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
                                        {formatPrice(originalPrice)}
                                      </div>
                                      <div className="text-emerald-400 font-bold">
                                        {formatPrice(finalPrice)}
                                      </div>
                                    </div>
                                  );
                                }

                                return (
                                  <div className="text-emerald-400 font-bold">
                                    {formatPrice(finalPrice)}
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
                                        {formatPrice(originalTotal)}
                                      </div>
                                      <div className="text-emerald-400 font-bold">
                                        {formatPrice(finalTotal)}
                                      </div>
                                    </div>
                                  );
                                }

                                return (
                                  <div className="text-emerald-400 font-bold">
                                    {formatPrice(finalPrice * item.quantity)}
                                  </div>
                                );
                              })()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-white/40">
                            No items found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Order Statistics */}
          <div className="space-y-6">
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 animate-pulse"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-4">Order Statistics</h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Items Count:</span>
                    <span className="text-white font-semibold">
                      {(order.orderItems || order.items)?.length || 0}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Total Quantity:</span>
                    <span className="text-white font-semibold">
                      {(order.orderItems || order.items)?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                    </span>
                  </div>

                  {totalSavings > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Savings:</span>
                      <span className="text-emerald-400 font-semibold">
                        {formatPrice(totalSavings)}
                      </span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">Final Total:</span>
                      <span className="text-emerald-300 font-bold text-xl">
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
