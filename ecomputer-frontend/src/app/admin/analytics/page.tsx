'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '../../../components';
import { useAuthContext } from '../../../context';
import { UserRole } from '../../../types/user';
import { OrderService, OrderStatistics, TopProduct } from '../../../services/order.service';
import { productService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';
import { formatPrice } from '../../../utils';
import { Icons } from '../../../components/ui/icons';

const orderService = OrderService.getInstance();
const authService = AuthService.getInstance();

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const [statistics, setStatistics] = useState<OrderStatistics | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useExtendedAnalytics, setUseExtendedAnalytics] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin/analytics');
    } else if (!loading && user && user.role !== UserRole.Admin) {
      router.push('/');
    } else if (!loading && user && user.role === UserRole.Admin) {
      loadAnalytics();
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === UserRole.Admin && !loading) {
      loadAnalytics();
    }
  }, [useExtendedAnalytics]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    if (user?.role === UserRole.Admin) {
      const interval = setInterval(() => {
        loadAnalytics();
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [user]);

  // Auto-refresh data when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.role === UserRole.Admin) {
        loadAnalytics();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  const loadAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      setError(null);

      // Load all data in parallel
      const [statsData, topProductsData, productsData, usersData] = await Promise.all([
        useExtendedAnalytics ? orderService.getDiscountAnalytics() : orderService.getOrderStatistics(),
        orderService.getTopProducts(10),
        productService.getAllProducts(),
        authService.getAllUsers()
      ]);

      setStatistics(statsData);
      setTopProducts(topProductsData);
      setProducts(productsData || []);
      setUsers(usersData || []);
    } catch (err) {
      console.error('[AdminAnalytics] Error loading analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  if (loading || analyticsLoading) {
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
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="p-3 rounded-2xl bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/40 transition-all duration-300 group"
              >
                <Icons.ArrowLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
              </button>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
                <p className="text-white/70 text-lg mt-2">
                  Track performance and business insights
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setUseExtendedAnalytics(!useExtendedAnalytics);
                }}
                className={`px-4 py-2 rounded-xl transition-all duration-300 font-medium $ useExtendedAnalytic 
                     ? 'bg-gradient-to-r from-emerald-600 to-green-700 text-white 
                     : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white'
                   }`}
              >
                {useExtendedAnalytics ? 'Extended Analytics' : 'Basic Analytics'}
              </button>


            </div>
          </div>

          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-8 hover:bg-black/40 transition-all duration-300 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-600/30 to-green-600/30 border border-emerald-500/40 shadow-lg">
                  <Icons.Shopping className="w-6 h-6 text-emerald-300" />
                </div>
                <span className="text-3xl font-bold text-white">{products.length}</span>
              </div>
              <h3 className="text-white font-semibold mb-2 text-lg">Total Products</h3>
              <p className="text-white/60 text-sm">In catalog</p>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-8 hover:bg-black/40 transition-all duration-300 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/40 shadow-lg">
                  <Icons.Users className="w-6 h-6 text-purple-300" />
                </div>
                <span className="text-3xl font-bold text-white">{users.length}</span>
              </div>
              <h3 className="text-white font-semibold mb-2 text-lg">Total Users</h3>
              <p className="text-white/60 text-sm">Registered</p>
            </div>
          </div>

          {/* Discount Analytics Cards */}
          {statistics && useExtendedAnalytics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-20">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-8 hover:bg-black/40 transition-all duration-300 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-600/30 to-green-600/30 border border-emerald-500/40 shadow-lg">
                    <Icons.Money className="w-6 h-6 text-emerald-300" />
                  </div>
                  <span className="text-3xl font-bold text-white">
                    {formatPrice(statistics.totalSavings || 0)}
                  </span>
                </div>
                <h3 className="text-white font-semibold mb-2 text-lg">Total Savings</h3>
                <p className="text-white/60 text-sm">From discounts</p>
                {(statistics.totalSavings || 0) === 0 && (
                  <p className="text-emerald-400 text-xs mt-3 font-medium">No discounts applied yet</p>
                )}
              </div>

              <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-8 hover:bg-black/40 transition-all duration-300 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-red-600/30 to-pink-600/30 border border-red-500/40 shadow-lg">
                    <Icons.CheckCircle className="w-6 h-6 text-red-300" />
                  </div>
                  <span className="text-3xl font-bold text-white">
                    {(statistics.discountPercentage || 0).toFixed(1)}%
                  </span>
                </div>
                <h3 className="text-white font-semibold mb-2 text-lg">Discount Rate</h3>
                <p className="text-white/60 text-sm">Average savings</p>
              </div>

              <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-8 hover:bg-black/40 transition-all duration-300 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/40 shadow-lg">
                    <Icons.Coupon className="w-6 h-6 text-indigo-300" />
                  </div>
                  <span className="text-3xl font-bold text-white">
                    {statistics.ordersWithDiscounts || 0}
                  </span>
                </div>
                <h3 className="text-white font-semibold mb-2 text-lg">Orders with Discounts</h3>
                <p className="text-white/60 text-sm">Applied discounts</p>
              </div>

              <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-8 hover:bg-black/40 transition-all duration-300 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-600/30 to-orange-600/30 border border-amber-500/40 shadow-lg">
                    <Icons.Money className="w-6 h-6 text-amber-300" />
                  </div>
                  <span className="text-3xl font-bold text-white">
                    {formatPrice(statistics.averageDiscountPerOrder || 0)}
                  </span>
                </div>
                <h3 className="text-white font-semibold mb-2 text-lg">Avg. Discount/Order</h3>
                <p className="text-white/60 text-sm">Per order savings</p>
              </div>
            </div>
          )}

          {/* Analytics Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            {/* Top Products */}
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden">
              {/* Inner animated gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 via-orange-600/10 to-red-600/10 animate-pulse"></div>

              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Icons.TrendingUp className="w-6 h-6 text-yellow-300 mr-3" />
                  Top Products
                </h2>

                {topProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-white/40 text-4xl mb-4"><Icons.Calendar/></div>
                    <p className="text-white/60 text-lg">No product data available</p>
                    <p className="text-white/40 text-sm mt-2">No products have been ordered yet</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {topProducts.slice(0, 5).map((product, index) => (
                      <div key={product.id || product.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/5">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                              index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                                index === 2 ? 'bg-gradient-to-r from-amber-600 to-orange-600' :
                                  'bg-gradient-to-r from-blue-500 to-purple-500'
                            }`}>
                            {index === 0 ? (
                              <Icons.Star className="w-5 h-5" />
                            ) : index === 1 ? (
                              <Icons.Star className="w-5 h-5" />
                            ) : index === 2 ? (
                              <Icons.Star className="w-5 h-5" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium text-lg">{product.name || `Product ${product.id}`}</p>
                            <p className="text-white/60 text-sm">ID: {product.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-300 font-bold text-lg">{product.totalSold || 0} sold</p>
                          <p className="text-white/60 text-sm font-medium">${(product.revenue || 0).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Order Statistics */}
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden">
              {/* Inner animated gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10 animate-pulse"></div>

              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Icons.BarChart className="w-6 h-6 text-blue-300 mr-3" />
                  Order Statistics
                </h2>

                {!statistics ? (
                  <div className="text-center py-8">
                    <div className="text-white/40 text-4xl mb-4">📈</div>
                    <p className="text-white/60 text-lg">No statistics available</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/60 text-sm font-medium">Total Orders</p>
                            <p className="text-3xl font-bold text-white">{statistics.totalOrders}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-blue-500/20">
                            <Icons.FileText className="w-6 h-6 text-blue-300" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/60 text-sm font-medium">Total Revenue</p>
                            <p className="text-3xl font-bold text-emerald-300">{formatPrice(statistics.totalRevenue || 0)}</p>
                            {statistics.totalSavings && statistics.totalSavings > 0 && (
                              <p className="text-emerald-400 text-sm font-medium">Saved: {formatPrice(statistics.totalSavings)}</p>
                            )}
                          </div>
                          <div className="p-2 rounded-lg bg-emerald-500/20">
                            <Icons.Money className="w-6 h-6 text-emerald-300" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/60 text-sm font-medium">Average Order</p>
                            <p className="text-3xl font-bold text-blue-300">
                              {formatPrice(statistics.totalOrders > 0 ? (statistics.totalRevenue / statistics.totalOrders) : 0)}
                            </p>
                          </div>
                          <div className="p-2 rounded-lg bg-blue-500/20">
                            <Icons.BarChart className="w-6 h-6 text-blue-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Discount Analytics Details */}
          {statistics && useExtendedAnalytics && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-16">
              {/* Coupon Statistics */}
              <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-emerald-600/10 to-teal-600/10 animate-pulse"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Icons.Coupon className="w-6 h-6 text-green-300 mr-3" />
                    Coupon Analytics
                  </h2>

                  <div className="space-y-8">
                    <div className="bg-white/5 rounded-xl p-6">
                      <p className="text-white/60 text-sm">Total Coupons Used</p>
                      <p className="text-2xl font-bold text-green-300">{statistics.couponStatistics?.totalCouponsUsed || 0}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-6">
                      <p className="text-white/60 text-sm">Total Coupon Savings</p>
                      <p className="text-2xl font-bold text-emerald-300">{formatPrice(statistics.couponStatistics?.totalCouponAmount || 0)}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-6">
                      <p className="text-white/60 text-sm">Average Coupon Value</p>
                      <p className="text-2xl font-bold text-blue-300">{formatPrice(statistics.couponStatistics?.averageCouponAmount || 0)}</p>
                    </div>
                    {(statistics.couponStatistics?.totalCouponsUsed || 0) === 0 && (
                      <div className="text-center py-4">
                        <p className="text-white/40 text-sm">No coupons used yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Promo Code Statistics */}
              <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-red-600/10 animate-pulse"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Icons.Money className="w-6 h-6 text-purple-300 mr-3" />
                    Promo Code Analytics
                  </h2>

                  <div className="space-y-8">
                    <div className="bg-white/5 rounded-xl p-6">
                      <p className="text-white/60 text-sm">Total Promo Codes Used</p>
                      <p className="text-2xl font-bold text-purple-300">{statistics.promoCodeStatistics?.totalPromoCodesUsed || 0}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-6">
                      <p className="text-white/60 text-sm">Total Promo Savings</p>
                      <p className="text-2xl font-bold text-pink-300">{formatPrice(statistics.promoCodeStatistics?.totalPromoCodeAmount || 0)}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-6">
                      <p className="text-white/60 text-sm">Average Promo Value</p>
                      <p className="text-2xl font-bold text-red-300">{formatPrice(statistics.promoCodeStatistics?.averagePromoCodeAmount || 0)}</p>
                    </div>
                    {(statistics.promoCodeStatistics?.totalPromoCodesUsed || 0) === 0 && (
                      <div className="text-center py-4">
                        <p className="text-white/40 text-sm">No promo codes used yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Discount Statistics */}
              <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10 animate-pulse"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Icons.CheckCircle className="w-6 h-6 text-blue-300 mr-3" />
                    Discount Analytics
                  </h2>

                  <div className="space-y-8">
                    <div className="bg-white/5 rounded-xl p-6">
                      <p className="text-white/60 text-sm">Total Discounts Used</p>
                      <p className="text-2xl font-bold text-blue-300">{statistics.discountStatistics?.totalDiscountsUsed || 0}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-6">
                      <p className="text-white/60 text-sm">Total Discount Amount</p>
                      <p className="text-2xl font-bold text-indigo-300">{formatPrice(statistics.discountStatistics?.totalDiscountAmount || 0)}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-6">
                      <p className="text-white/60 text-sm">Average Discount</p>
                      <p className="text-2xl font-bold text-purple-300">{formatPrice(statistics.discountStatistics?.averageDiscountAmount || 0)}</p>
                    </div>
                    {(statistics.discountStatistics?.totalDiscountsUsed || 0) === 0 && (
                      <div className="text-center py-4">
                        <p className="text-white/40 text-sm">No discounts applied yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-8 bg-red-600/20 border border-red-500/40 rounded-2xl p-6 text-center">
              <div className="text-red-400 text-4xl mb-4">⚠️</div>
              <p className="text-red-200 text-lg font-medium">{error}</p>
              <button
                onClick={loadAnalytics}
                className="mt-4 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
