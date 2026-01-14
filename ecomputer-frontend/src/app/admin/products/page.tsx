'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '../../../components';
import { useAuthContext } from '../../../context';
import { UserRole } from '../../../types/user';
import { Product } from '../../../types/product';
import { productService } from '../../../services/product.service';
import { Category } from '../../../types/category';
import { categoryService } from '../../../services/category.service';

export default function AdminProductsPage() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin/products');
    } else if (!loading && user && user.role !== UserRole.Admin) {
      router.push('/');
    } else if (!loading && user && user.role === UserRole.Admin) {
      loadProducts();
      loadCategories();
    }
  }, [user, loading, router]);

  // Auto-refresh products when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.role === UserRole.Admin) {
        loadProducts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    if (user?.role === UserRole.Admin) {
      const interval = setInterval(() => {
        loadProducts();
        loadCategories();
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [user]);

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      setError(null);
      setSuccess(null);
      
      console.log('[AdminProducts] Loading products...');
      const fetchedProducts = await productService.getAllProducts();
      console.log('[AdminProducts] Fetched products:', fetchedProducts);
      
      setProducts(fetchedProducts);
    } catch (err) {
      console.error('[AdminProducts] Error loading products:', err);
      setError('Failed to load products');
    } finally {
      setProductsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const fetchedCategories = await categoryService.getAllCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('[AdminProducts] Error loading categories:', error);
    }
  };

  // Функция для получения названия категории по ID
  const getCategoryName = (categoryId: number): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'N/A';
  };

  // Функция для расчета общей стоимости инвентаря
  const calculateTotalValue = (): string => {
    const totalValue = products.reduce((sum, p) => {
      // Убеждаемся, что price и quantity являются числами
      const price = typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0;
      const quantity = typeof p.quantity === 'number' ? p.quantity : parseInt(p.quantity) || 0;
      const productValue = price * quantity;
      
      // Проверяем на разумные значения
      if (price > 1000000 || quantity > 1000000) {
        console.warn(`[TotalValue] Suspicious values for product ${p.id}: price=${price}, quantity=${quantity}`);
      }
      
      console.log(`[TotalValue] Product ${p.id} (${p.name}): price=${price} (${typeof price}), quantity=${quantity} (${typeof quantity}), value=${productValue}`);
      return sum + productValue;
    }, 0);
    
    console.log(`[TotalValue] Total inventory value: ${totalValue}`);
    
    // Проверяем, не слишком ли большая сумма
    if (totalValue > 10000000) {
      console.warn(`[TotalValue] Very large total value: ${totalValue}. This might indicate data issues.`);
    }
    
    return totalValue.toFixed(2);
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

  if (loading || productsLoading) {
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
                <h1 className="text-4xl md:text-5xl font-bold text-white bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                  Products Management
                </h1>
                <p className="text-white/70 text-lg mt-2">
                  Manage your product catalog and inventory
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/admin/products/add')}
                className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:bg-black/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-600/30 to-green-600/30 border border-emerald-500/40">
                  <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-white">{products.length}</span>
              </div>
              <h3 className="text-white font-semibold mb-1">Total Products</h3>
              <p className="text-white/60 text-sm">In catalog</p>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:bg-black/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border border-blue-500/40">
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-white">
                  {products.filter(p => p.quantity > 0).length}
                </span>
              </div>
              <h3 className="text-white font-semibold mb-1">In Stock</h3>
              <p className="text-white/60 text-sm">Available</p>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:bg-black/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-600/30 to-orange-600/30 border border-yellow-500/40">
                  <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-white">
                  ${calculateTotalValue()}
                </span>
              </div>
              <h3 className="text-white font-semibold mb-1">Total Value</h3>
              <p className="text-white/60 text-sm">Inventory</p>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/5 p-6 hover:bg-black/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-red-600/30 to-pink-600/30 border border-red-500/40">
                  <svg className="w-6 h-6 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-white">
                  {products.filter(p => p.quantity === 0).length}
                </span>
              </div>
              <h3 className="text-white font-semibold mb-1">Out of Stock</h3>
              <p className="text-white/60 text-sm">Need restock</p>
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

          {/* Products Table */}
          <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden">
            {/* Inner animated gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-green-600/10 to-teal-600/10 animate-pulse"></div>
            
            <div className="relative z-10">
              {error ? (
                <div className="text-center py-16">
                  <div className="text-red-400 text-5xl mb-4">⚠️</div>
                  <p className="text-red-200 text-lg font-medium">{error}</p>
                  <button
                    onClick={loadProducts}
                    className="mt-4 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300"
                  >
                    Try Again
                  </button>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-white/40 text-6xl mb-4">🖥️</div>
                  <p className="text-white/60 text-lg font-medium">No products found</p>
                  <p className="text-white/40 text-sm mt-2">Start by adding your first product</p>
                  <button
                    onClick={() => router.push('/admin/products/add')}
                    className="mt-4 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300"
                  >
                    Add First Product
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-4 px-6 text-left text-white font-bold">ID</th>
                        <th className="py-4 px-6 text-left text-white font-bold">Name</th>
                        <th className="py-4 px-6 text-left text-white font-bold">Category</th>
                        <th className="py-4 px-6 text-left text-white font-bold">Price</th>
                        <th className="py-4 px-6 text-left text-white font-bold">Stock</th>
                        <th className="py-4 px-6 text-left text-white font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                        <tr 
                          key={product.id} 
                          className={`border-b border-white/10 hover:bg-white/5 transition-all duration-300 ${
                            index % 2 === 0 ? 'bg-white/5' : 'bg-white/2'
                          }`}
                        >
                          <td className="py-4 px-6 text-white font-semibold">#{product.id}</td>
                          <td className="py-4 px-6 text-white font-medium">{product.name}</td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full font-medium">
                              {getCategoryName(product.categoryId)}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-emerald-300 font-bold">${product.price.toFixed(2)}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 text-white text-sm rounded-full font-medium ${
                              product.quantity > 10 
                                ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                                : product.quantity > 0 
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                                : 'bg-gradient-to-r from-red-500 to-pink-500'
                            }`}>
                              {product.quantity}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-2">
                              <button 
                                className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm rounded-lg transition-all duration-300 hover:scale-105 font-medium"
                                onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                              >
                                Edit
                              </button>
                                                             <button 
                                 className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm rounded-lg transition-all duration-300 hover:scale-105 font-medium"
                                 onClick={async () => {
                                   if (window.confirm('Are you sure you want to delete this product?')) {
                                     try {
                                       console.log(`[AdminProducts] Attempting to delete product ${product.id}`);
                                       const success = await productService.deleteProduct(product.id);
                                       console.log(`[AdminProducts] Delete result:`, success);
                                       
                                       if (success) {
                                         setSuccess('Product deleted successfully!');
                                         // Reload data from server to ensure consistency
                                         await loadProducts();
                                       } else {
                                         setError('Failed to delete product. Please check console for details.');
                                       }
                                     } catch (error) {
                                       console.error('[AdminProducts] Error deleting product:', error);
                                       setError(`Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`);
                                     }
                                   }
                                 }}
                               >
                                Delete
                              </button>
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
