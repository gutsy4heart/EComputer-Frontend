'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '../../../components';
import { useAuthContext } from '../../../context';
import { UserRole } from '../../../types/user';

export default function AdminSettingsPage() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin/settings');
    } else if (!loading && user && user.role !== UserRole.Admin) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSuccess('Settings saved successfully!');
      setIsSubmitting(false);
    }, 1000);
  };

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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="p-3 rounded-2xl bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/40 transition-all duration-300 group"
              >
                <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white bg-gradient-to-r from-gray-300 to-slate-300 bg-clip-text text-transparent">
                  Settings
                </h1>
                <p className="text-white/70 text-lg mt-2">
                  Configure platform settings and preferences
                </p>
              </div>
            </div>
          </div>

          {/* Settings Form */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden">
              {/* Inner animated gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-600/10 via-slate-600/10 to-zinc-600/10 animate-pulse"></div>
              
              <div className="relative z-10">
                {success && (
                  <div className="mb-6 p-4 bg-emerald-600/20 border border-emerald-500/40 rounded-xl">
                    <p className="text-emerald-200 text-center">{success}</p>
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-6">
                  {/* General Settings */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-4">General Settings</h2>
                    
                    <div>
                      <label htmlFor="siteName" className="block text-white/90 font-medium mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        id="siteName"
                        name="siteName"
                        defaultValue="E-Computer Store"
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-gray-500 focus:outline-none transition-all duration-300"
                        placeholder="Enter site name"
                      />
                    </div>

                    <div>
                      <label htmlFor="siteDescription" className="block text-white/90 font-medium mb-2">
                        Site Description
                      </label>
                      <textarea
                        id="siteDescription"
                        name="siteDescription"
                        rows={3}
                        defaultValue="Your trusted source for computer hardware and accessories"
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-gray-500 focus:outline-none transition-all duration-300 resize-none"
                        placeholder="Enter site description"
                      />
                    </div>
                  </div>

                  {/* Email Settings */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-4">Email Settings</h2>
                    
                    <div>
                      <label htmlFor="smtpHost" className="block text-white/90 font-medium mb-2">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        id="smtpHost"
                        name="smtpHost"
                        defaultValue="smtp.gmail.com"
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-gray-500 focus:outline-none transition-all duration-300"
                        placeholder="Enter SMTP host"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="smtpPort" className="block text-white/90 font-medium mb-2">
                          SMTP Port
                        </label>
                        <input
                          type="number"
                          id="smtpPort"
                          name="smtpPort"
                          defaultValue="587"
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-gray-500 focus:outline-none transition-all duration-300"
                          placeholder="587"
                        />
                      </div>

                      <div>
                        <label htmlFor="smtpUser" className="block text-white/90 font-medium mb-2">
                          SMTP Username
                        </label>
                        <input
                          type="email"
                          id="smtpUser"
                          name="smtpUser"
                          defaultValue="admin@ecomputer.com"
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-gray-500 focus:outline-none transition-all duration-300"
                          placeholder="Enter SMTP username"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Settings */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-4">Payment Settings</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="currency" className="block text-white/90 font-medium mb-2">
                          Currency
                        </label>
                        <select
                          id="currency"
                          name="currency"
                          defaultValue="USD"
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-gray-500 focus:outline-none transition-all duration-300"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="JPY">JPY (¥)</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="taxRate" className="block text-white/90 font-medium mb-2">
                          Tax Rate (%)
                        </label>
                        <input
                          type="number"
                          id="taxRate"
                          name="taxRate"
                          defaultValue="8.5"
                          min="0"
                          max="100"
                          step="0.1"
                          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-gray-500 focus:outline-none transition-all duration-300"
                          placeholder="0.0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-gradient-to-r from-gray-600 to-slate-700 hover:from-gray-700 hover:to-slate-800 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Save Settings</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
