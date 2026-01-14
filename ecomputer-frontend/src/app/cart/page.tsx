'use client';

import React, { memo } from 'react';
import { Layout, CartList, CartSummary } from '../../components';
import { useRouter } from 'next/navigation';
import { AnimatedParticles } from '../../components/ui/AnimatedParticles';

function CartPageComponent() {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
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
        <AnimatedParticles count={30} particleClassName="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse" />

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Header Section */}
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={handleBackClick}
              className="p-3 rounded-2xl bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/40 transition-all duration-300 group"
            >
              <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Shopping Cart
              </h1>
              <p className="text-white/70 text-lg mt-2">
                Review your items and proceed to checkout
              </p>
            </div>
          </div>

          {/* Main Cart Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Cart List */}
            <div className="lg:w-2/3">
              <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden">
                {/* Inner animated gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-red-600/10 animate-pulse"></div>
                
                <div className="relative z-10">
                  <CartList />
                </div>
              </div>
            </div>

            {/* Right Column - Cart Summary */}
            <div className="lg:w-1/3">
              <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden transform perspective-1000">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10 rounded-3xl"></div>
                <div className="relative z-10 p-8" style={{
                  clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)',
                  transform: 'perspective(1000px) rotateY(-5deg)',
                  transformOrigin: 'center'
                }}>
                  <CartSummary />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default memo(CartPageComponent);
