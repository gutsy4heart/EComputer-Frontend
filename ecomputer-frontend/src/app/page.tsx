'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layout } from '../components';
import { AnimatedParticles } from '../components/ui/AnimatedParticles';

const macbookImage = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
        <AnimatedParticles count={50} particleClassName="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse" />

        <div className="relative z-10">
          {/* Hero Section */}
          <section className="relative py-32 overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2 space-y-8">
                  <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                      Next-Gen
                    </span>
                    <br />
                    <span className="text-white">Gaming Hardware</span>
                  </h1>
                  <p className="text-xl text-white/70 max-w-2xl leading-relaxed">
                    Unleash maximum performance with our cutting-edge components engineered for gamers and creators. 
                    Experience the future of computing technology.
                  </p>
                  <div className="flex gap-4">
                    <Link
                      href="/products"
                      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform"
                    >
                      Shop Now
                    </Link>
                    <Link
                      href="/favorites"
                      className="px-8 py-4 border-2 border-white/20 text-white rounded-xl font-bold hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                    >
                      View Favorites
                    </Link>
                  </div>
                </div>

                <div className="lg:w-1/2 relative">
                  <div className="relative w-full h-[340px] md:h-[420px] lg:h-[480px] max-w-xl flex items-center justify-center overflow-hidden rounded-3xl shadow-2xl">
                    {/* Animated border */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-3xl border border-purple-400/30 rotate-12 animate-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 rounded-3xl overflow-hidden"></div>
                    <img
                      src={macbookImage}
                      alt="MacBook Pro"
                      className="w-full h-full object-cover object-center z-10 transition-all duration-700 hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20">
            <div className="container mx-auto px-6">
              <div className="flex flex-col lg:flex-row gap-16 items-center">
                <div className="lg:w-1/2">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-lg opacity-50"></div>
                    <div className="relative bg-black/30 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                      <div className="text-center">
                        <div className="text-6xl mb-4 animate-bounce">🚀</div>
                        <h3 className="text-2xl font-bold text-white mb-2">Premium Quality</h3>
                        <p className="text-white/70">Top-tier components for ultimate performance</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2 space-y-8">
                  <h2 className="text-4xl font-bold text-white">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                      Precision
                    </span> Engineering
                  </h2>
                  <p className="text-xl text-white/70 leading-relaxed">
                    Our components are designed with cutting-edge technology to deliver unmatched performance 
                    and reliability for the most demanding applications.
                  </p>

                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { title: 'Cooling System', value: 'Liquid Cooling', icon: '❄️' },
                      { title: 'Power Efficiency', value: '80+ Platinum', icon: '⚡' },
                      { title: 'Warranty', value: '3 Years', icon: '🛡️' },
                      { title: 'Performance', value: '4K Ready', icon: '🎯' }
                    ].map((spec, index) => (
                      <div
                        key={index}
                        className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-400/30 transition-all duration-300 hover:scale-105 group shadow-xl"
                      >
                        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{spec.icon}</div>
                        <h3 className="font-bold text-white">{spec.title}</h3>
                        <p className="text-purple-300">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-32 relative">
            <div className="container mx-auto px-6 relative z-10 text-center">
              <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/10 p-12 shadow-2xl">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
                  Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">Upgrade</span>?
                </h2>
                <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed">
                  Join thousands of satisfied customers who've transformed their gaming and creative experience 
                  with our premium hardware solutions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/products"
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform"
                  >
                    Shop Now
                  </Link>
                  <Link
                    href="/register"
                    className="px-8 py-4 border-2 border-white/20 text-white rounded-xl font-bold hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                  >
                    Join Now
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
} 