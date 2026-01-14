'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, ProfileForm } from '../../components';
import { useAuthContext } from '../../context';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthContext();
  
 
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login?redirect=/profile');
    }
  }, [isAuthenticated, loading, router]);
  
 
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
 
  if (!isAuthenticated) {
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
              Profile Settings
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Manage your account information and personalize your profile
            </p>
          </div>

          {/* Profile Form Container */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden">
              {/* Inner animated gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 animate-pulse"></div>
              
              {/* Inner floating elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-4 left-4 w-16 h-16 border border-white/5 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 border border-white/5 rotate-45 animate-pulse"></div>
              </div>

              <div className="relative z-10">
                <ProfileForm />
              </div>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Security Card */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:bg-black/40 transition-all duration-300 group">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-600/30 to-green-600/30 border border-emerald-500/40">
                  <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Security</h3>
              </div>
              <p className="text-white/70 text-sm">Your account is protected with industry-standard security measures.</p>
            </div>

            {/* Privacy Card */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:bg-black/40 transition-all duration-300 group">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/40">
                  <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Privacy</h3>
              </div>
              <p className="text-white/70 text-sm">Your personal information is kept private and secure at all times.</p>
            </div>

            {/* Support Card */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:bg-black/40 transition-all duration-300 group">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-pink-600/30 to-red-600/30 border border-pink-500/40">
                  <svg className="w-6 h-6 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Support</h3>
              </div>
              <p className="text-white/70 text-sm">Need help? Our support team is available 24/7 to assist you.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
