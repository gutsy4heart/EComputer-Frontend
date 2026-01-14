'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '../../../components';
import { useAuthContext } from '../../../context';
import { usePromotions } from '../../../hooks/usePromotions';
import { UserRole } from '../../../types/user';
import { Order } from '../../../types/order';
import { OrderService } from '../../../services/order.service';
import { calculateFinalPrice } from '../../../utils/promotionCalculator';
import { formatPrice } from '../../../utils';
import { Icons } from '../../../components/ui/icons';

const orderService = OrderService.getInstance();

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const { getActiveDiscounts } = usePromotions();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin/orders');
    } else if (!loading && user && user.role !== UserRole.Admin) {
      router.push('/');
    } else if (!loading && user && user.role === UserRole.Admin) {
      loadOrders();
    }
  }, [user, loading, router]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    if (user?.role === UserRole.Admin) {
      const interval = setInterval(() => {
        loadOrders();
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [user]);

  // Auto-refresh data when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.role === UserRole.Admin) {
        loadOrders();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      setError(null);
      setSuccess(null);
      
      console.log('[AdminOrders] Loading orders...');
      const fetchedOrders = await orderService.getOrders();
      console.log('[AdminOrders] Fetched orders:', fetchedOrders);
      
      setOrders(fetchedOrders);
    } catch (err) {
      console.error('[AdminOrders] Error loading orders:', err);
      setError('Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      console.log('[AdminOrders] Updating order status:', orderId, newStatus);
      const success = await orderService.updateOrderStatus(orderId, newStatus);
      
      if (success) {
        setSuccess('Order status updated successfully!');
        // Reload orders to get updated data
        await loadOrders();
      } else {
        setError('Failed to update order status');
      }
    } catch (err) {
      console.error('[AdminOrders] Error updating order status:', err);
      setError('Failed to update order status');
    }
  };

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (loading || ordersLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
          {/* Animated background particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 50 }, (_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
          
          <div className="container mx-auto px-4 py-8 relative z-10">
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/10 border-t-indigo-500 border-r-purple-500 border-b-pink-500"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-indigo-500 opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user || user.role !== UserRole.Admin) {
    return null;
  }

  const getStatusText = (status: any) => {
    // Handle both numeric and string status values
    const statusStr = typeof status === 'number' ? status.toString() : String(status);
    
    switch (statusStr) {
      case '0':
      case 'pending':
        return 'Pending';
      case '1':
      case 'processing':
        return 'Processing';
      case '2':
      case 'shipped':
        return 'Shipped';
      case '3':
      case 'delivered':
        return 'Delivered';
      case '4':
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: any) => {
    // Convert status to string and handle different types
    const statusStr = typeof status === 'string' ? status : String(status);
    
    switch (statusStr.toLowerCase()) {
      case 'pending':
        return 'bg-gradient-to-r from-amber-500 to-orange-500';
      case 'processing':
        return 'bg-gradient-to-r from-indigo-500 to-purple-500';
      case 'shipped':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'delivered':
        return 'bg-gradient-to-r from-emerald-500 to-green-500';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-500 to-pink-500';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/5 rounded-full animate-spin" style={{ animationDuration: '30s' }}></div>
          <div className="absolute top-40 right-40 w-24 h-24 border border-white/5 rotate-45 animate-pulse"></div>
          <div className="absolute bottom-40 left-40 w-20 h-20 border border-white/5 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 right-20 w-36 h-36 border border-white/5 rotate-12 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/3 rounded-full animate-spin" style={{ animationDuration: '60s' }}></div>
        </div>

        {/* Animated background particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="p-3 rounded-2xl bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/40 transition-all duration-300 group"
              >
                <Icons.ArrowLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
              </button>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
                  Orders Management
                </h1>
                <p className="text-white/70 text-lg mt-2">
                  Monitor and manage customer orders
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:bg-black/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border border-blue-500/40">
                  <Icons.FileText className="w-6 h-6 text-blue-300" />
                </div>
                <span className="text-2xl font-bold text-white">{orders.length}</span>
              </div>
              <h3 className="text-white font-semibold mb-1">Total Orders</h3>
              <p className="text-white/60 text-sm">All time</p>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:bg-black/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-600/30 to-orange-600/30 border border-amber-500/40">
                  <Icons.Pending className="w-6 h-6 text-amber-300" />
                </div>
                <span className="text-2xl font-bold text-white">
                  {orders.filter(o => {
                    const statusText = getStatusText(o.status);
                    return statusText.toLowerCase() === 'pending';
                  }).length}
                </span>
              </div>
              <h3 className="text-white font-semibold mb-1">Pending</h3>
              <p className="text-white/60 text-sm">Awaiting processing</p>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:bg-black/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-600/30 to-green-600/30 border border-emerald-500/40">
                  <Icons.Delivered className="w-6 h-6 text-emerald-300" />
                </div>
                <span className="text-2xl font-bold text-white">
                  {orders.filter(o => {
                    const statusText = getStatusText(o.status);
                    return statusText.toLowerCase() === 'delivered';
                  }).length}
                </span>
              </div>
              <h3 className="text-white font-semibold mb-1">Delivered</h3>
              <p className="text-white/60 text-sm">Completed</p>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:bg-black/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-600/30 to-orange-600/30 border border-yellow-500/40">
                  <Icons.Money className="w-6 h-6 text-yellow-300" />
                </div>
                <span className="text-2xl font-bold text-white">
                  {formatPrice(orders.reduce((sum, o) => {
                    const pricing = calculateOrderPricing(o);
                    return sum + pricing.finalTotal;
                  }, 0))}
                </span>
              </div>
              <h3 className="text-white font-semibold mb-1">Total Revenue</h3>
              <p className="text-white/60 text-sm">All orders</p>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-emerald-600/20 border border-emerald-500/40 rounded-xl">
              <p className="text-emerald-200 text-center">{success}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-600/20 border border-red-500/40 rounded-xl">
              <p className="text-red-200 text-center">{error}</p>
            </div>
          )}

          {/* Orders Table */}
          <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden">
            {/* Inner animated gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10 animate-pulse"></div>
            
            <div className="relative z-10">
              {error ? (
                <div className="text-center py-16">
                  <div className="text-red-400 text-5xl mb-4">⚠️</div>
                  <p className="text-red-200 text-lg font-medium">{error}</p>
                  <button
                    onClick={loadOrders}
                    className="mt-4 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300"
                  >
                    Try Again
                  </button>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-white/40 text-6xl mb-4">📦</div>
                  <p className="text-white/60 text-lg font-medium">No orders found</p>
                  <p className="text-white/40 text-sm mt-2">Orders will appear here when customers make purchases</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-4 px-6 text-left text-white font-bold">ID</th>
                        <th className="py-4 px-6 text-left text-white font-bold">Customer</th>
                        <th className="py-4 px-6 text-left text-white font-bold">Date</th>
                        <th className="py-4 px-6 text-left text-white font-bold">Total</th>
                        <th className="py-4 px-6 text-left text-white font-bold">Codes</th>
                        <th className="py-4 px-6 text-left text-white font-bold">Status</th>
                        <th className="py-4 px-6 text-left text-white font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <tr 
                          key={order.id} 
                          className={`border-b border-white/10 hover:bg-white/5 transition-all duration-300 ${
                            index % 2 === 0 ? 'bg-white/5' : 'bg-white/2'
                          }`}
                        >
                          <td className="py-4 px-6 text-white font-semibold">#{order.id}</td>
                                                     <td className="py-4 px-6 text-white font-medium">
                             {order.user?.name || order.user?.email || `User ${order.userId}`}
                           </td>
                                                     <td className="py-4 px-6 text-white/80">
                             {order.createdDate ? new Date(order.createdDate).toLocaleDateString() : 
                              order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                           </td>
                          <td className="py-4 px-6">
                            {(() => {
                              const pricing = calculateOrderPricing(order);
                              return (
                                <div className="space-y-1">
                                  {pricing.totalSavings > 0 && (
                                    <div className="text-white/60 text-sm line-through">
                                      {formatPrice(pricing.originalTotal)}
                                    </div>
                                  )}
                                  <div className="text-emerald-300 font-bold">
                                    {formatPrice(pricing.finalTotal)}
                                  </div>
                                  {pricing.totalSavings > 0 && (
                                    <div className="text-emerald-400 text-xs">
                                      Saved: {formatPrice(pricing.totalSavings)}
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </td>
                          <td className="py-4 px-6">
                            {(order.appliedCouponCode || order.appliedPromoCode) && (
                              <div className="flex flex-wrap gap-1">
                                {order.appliedCouponCode && (
                                  <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs rounded-full font-medium">
                                    {order.appliedCouponCode}
                                  </span>
                                )}
                                {order.appliedPromoCode && (
                                  <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs rounded-full font-medium">
                                    {order.appliedPromoCode}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                                                     <td className="py-4 px-6">
                             <span className={`px-3 py-1 text-white text-sm rounded-full font-medium ${getStatusColor(order.status || '')}`}>
                               {getStatusText(order.status)}
                             </span>
                           </td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-2">
                              <button 
                                className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm rounded-lg transition-all duration-300 hover:scale-105 font-medium"
                                onClick={() => router.push(`/admin/orders/${order.id}`)}
                              >
                                View
                              </button>
                                                             <select
                                 className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm rounded-lg transition-all duration-300 hover:scale-105 font-medium border-none outline-none cursor-pointer"
                                 value={getStatusText(order.status)}
                                 onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                               >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
