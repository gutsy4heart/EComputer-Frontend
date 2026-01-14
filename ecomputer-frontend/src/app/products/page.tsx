'use client';

import React, { useState, useEffect } from 'react';
import { Layout, ProductList, ProductFilter, Pagination } from '../../components';
import { useProducts } from '../../hooks';
import { FilterProductsRequest } from '../../types';
import { useAuthContext } from '../../context';
import { UserRole } from '../../types/user';
import Link from 'next/link';
import { AnimatedParticles } from '../../components/ui/AnimatedParticles';

export default function ProductsPage() {
  const { user } = useAuthContext();
  const isAdmin = user?.role === UserRole.Admin;
  
 
  const initialFilters: FilterProductsRequest = {
    page: 1,
    pageSize: 12,
  };
  
 
  const {
    products,
    totalPages,
    currentPage,
    filters,
    loading,
    error,
    updateFilters,
    changePage,
  } = useProducts(initialFilters);
  
 
  const handleFilterChange = (newFilters: FilterProductsRequest) => {
    updateFilters(newFilters);
  };
  
 
  const handlePageChange = (page: number) => {
    changePage(page);
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
        <AnimatedParticles count={40} particleClassName="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse" />

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                Our Products
              </h1>
              <p className="text-white/70 text-lg max-w-2xl">
                Discover amazing products at great prices
              </p>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters */}
            <div className="lg:w-1/4">
              <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-6 sticky top-8 relative overflow-hidden">
                {/* Inner animated gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 animate-pulse"></div>
                
                {/* Inner floating elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-4 left-4 w-16 h-16 border border-white/5 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
                  <div className="absolute bottom-4 right-4 w-12 h-12 border border-white/5 rotate-45 animate-pulse"></div>
                </div>

                <div className="relative z-10">
                  <ProductFilter
                    initialFilters={filters}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Products */}
            <div className="lg:w-3/4">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/10 border-t-indigo-500 border-r-purple-500 border-b-pink-500"></div>
                    <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-indigo-500 opacity-20"></div>
                  </div>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-64">
                  <div className="bg-gradient-to-r from-red-600/20 to-red-700/20 border border-red-500/40 rounded-2xl p-8 text-center backdrop-blur-sm">
                    <div className="text-red-300 text-5xl mb-4">⚠️</div>
                    <p className="text-red-100 text-xl font-medium mb-2">Error loading products</p>
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                </div>
              ) : products && products.length > 0 ? (
                <>
                  <div className="mb-8">
                    <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-4">
                      <p className="text-white/90 text-center">
                        Showing <span className="font-bold text-indigo-400">{products.length}</span> products
                        {filters.name && (
                          <span> for "<span className="font-bold text-purple-400">{filters.name}</span>"</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <ProductList
                    products={products}
                    loading={loading}
                    error={error}
                  />
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-4">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <div className="bg-black/30 backdrop-blur-sm border border-white/5 rounded-2xl p-12 text-center">
                    <div className="text-white/30 text-6xl mb-4">📦</div>
                    <p className="text-white/70 text-xl font-medium mb-2">No products found</p>
                    <p className="text-white/50 text-sm">Try adjusting your filters or search terms</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
