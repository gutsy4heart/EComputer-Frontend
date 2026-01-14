'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '../../components';
import { useAuthContext } from '../../context';
import { UserRole } from '../../types/user';


export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin');
    } else if (!loading && user && user.role !== UserRole.Admin) {
      router.push('/');
    } else if (!loading && user && user.role === UserRole.Admin) {
      setIsAdmin(true);
    }
  }, [user, loading, router]);

  if (loading) {
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

  if (!isAdmin) {
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
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Manage your e-commerce platform with powerful administrative tools
            </p>
          </div>

          {/* Admin Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Products Management */}
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden group hover:bg-black/40 transition-all duration-300 h-full">
              {/* Inner animated gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-green-600/10 to-teal-600/10 animate-pulse"></div>
              
              {/* Inner floating elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-4 left-4 w-16 h-16 border border-white/5 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 border border-white/5 rotate-45 animate-pulse"></div>
    </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600/30 to-green-600/30 border border-emerald-500/40">
                    <svg className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Products</h3>
                    <p className="text-white/60 text-sm">Manage inventory</p>
                  </div>
                </div>

                <p className="text-white/70 mb-6 flex-grow">
                  Add, edit, and manage your product catalog with full control over pricing, inventory, and descriptions.
                </p>
                
                <button
                  onClick={() => router.push('/admin/products')}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg group-hover:shadow-emerald-500/25 mt-auto"
                >
                  Manage Products
                </button>
              </div>
            </div>

            {/* Categories Management */}
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden group hover:bg-black/40 transition-all duration-300 h-full">
              {/* Inner animated gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 via-cyan-600/10 to-blue-600/10 animate-pulse"></div>
              
              {/* Inner floating elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-4 left-4 w-16 h-16 border border-white/5 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 border border-white/5 rotate-45 animate-pulse"></div>
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-600/30 to-cyan-600/30 border border-teal-500/40">
                    <svg className="w-8 h-8 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Categories</h3>
                    <p className="text-white/60 text-sm">Organize products</p>
                  </div>
                </div>
                
                <p className="text-white/70 mb-6 flex-grow">
                  Create and manage product categories to organize your inventory and improve customer navigation.
                </p>
                
                <button 
                  onClick={() => router.push('/admin/categories')}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg group-hover:shadow-teal-500/25 mt-auto"
                >
                  Manage Categories
                </button>
              </div>
            </div>

            {/* Orders Management */}
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden group hover:bg-black/40 transition-all duration-300 h-full">
              {/* Inner animated gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10 animate-pulse"></div>
              
              {/* Inner floating elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-4 left-4 w-16 h-16 border border-white/5 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 border border-white/5 rotate-45 animate-pulse"></div>
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border border-blue-500/40">
                    <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Orders</h3>
                    <p className="text-white/60 text-sm">Track shipments</p>
                  </div>
                </div>
                
                <p className="text-white/70 mb-6 flex-grow">
                  Monitor order status, process payments, and manage customer deliveries efficiently.
                </p>
                
                <button 
                  onClick={() => router.push('/admin/orders')}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg group-hover:shadow-blue-500/25 mt-auto"
                >
                  View Orders
                </button>
              </div>
            </div>

            {/* Users Management */}
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden group hover:bg-black/40 transition-all duration-300 h-full">
              {/* Inner animated gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-red-600/10 animate-pulse"></div>
              
              {/* Inner floating elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-4 left-4 w-16 h-16 border border-white/5 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 border border-white/5 rotate-45 animate-pulse"></div>
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/40">
                    <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Users</h3>
                    <p className="text-white/60 text-sm">Manage accounts</p>
                  </div>
                </div>
                
                <p className="text-white/70 mb-6 flex-grow">
                  View user profiles, manage permissions, and monitor customer activity across your platform.
                </p>
                
                <button 
                  onClick={() => router.push('/admin/users')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg group-hover:shadow-purple-500/25 mt-auto"
                >
                  Manage Users
                </button>
              </div>
            </div>

            {/* Promotions Management */}
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden group hover:bg-black/40 transition-all duration-300 h-full">
              {/* Inner animated gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-green-600/10 to-teal-600/10 animate-pulse"></div>
              
              {/* Inner floating elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-4 left-4 w-16 h-16 border border-white/5 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 border border-white/5 rotate-45 animate-pulse"></div>
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600/30 to-green-600/30 border border-emerald-500/40">
                    <svg className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Promotions</h3>
                    <p className="text-white/60 text-sm">Manage offers</p>
                  </div>
                </div>
                
                <p className="text-white/70 mb-6 flex-grow">
                  Create and manage coupons, discounts, and promo codes to boost sales and attract customers.
                </p>
                
                <button 
                  onClick={() => router.push('/admin/promotions')}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg group-hover:shadow-emerald-500/25 mt-auto"
                >
                  Manage Promotions
                </button>
              </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden group hover:bg-black/40 transition-all duration-300 h-full">
              {/* Inner animated gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 via-orange-600/10 to-red-600/10 animate-pulse"></div>
              
              {/* Inner floating elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-4 left-4 w-16 h-16 border border-white/5 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 border border-white/5 rotate-45 animate-pulse"></div>
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-600/30 to-orange-600/30 border border-yellow-500/40">
                    <svg className="w-8 h-8 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Analytics</h3>
                    <p className="text-white/60 text-sm">View insights</p>
                  </div>
                </div>
                
                <p className="text-white/70 mb-6 flex-grow">
                  Track sales performance, customer behavior, and business metrics with detailed analytics.
                </p>
                
                <button 
                  onClick={() => router.push('/admin/analytics')}
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-700 hover:from-yellow-700 hover:to-orange-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg group-hover:shadow-yellow-500/25 mt-auto"
                >
                  View Analytics
                </button>
              </div>
            </div>
        </div>


          

        </div>
    </div>
    </Layout>
  );
}
