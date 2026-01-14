'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '../../../components';
import { useAuthContext } from '../../../context';
import { UserRole } from '../../../types/user';
import { Category } from '../../../types/category';
import { categoryService } from '../../../services/category.service';
import { Product } from '../../../types/product';
import { productService } from '../../../services/product.service';
import { Icons } from '../../../components/ui/icons';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({ name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin/categories');
    } else if (!loading && user && user.role !== UserRole.Admin) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === UserRole.Admin) {
      loadCategories();
      loadProducts();
    }
  }, [user]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    if (user?.role === UserRole.Admin) {
      const interval = setInterval(() => {
        loadCategories();
        loadProducts();
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [user]);

  // Auto-refresh data when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.role === UserRole.Admin) {
        loadCategories();
        loadProducts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  const loadCategories = async () => {
    setCategoriesLoading(true);
    setError(null);
    try {
      const fetchedCategories = await categoryService.getAllCategories();
      setCategories(fetchedCategories);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error loading categories:', error);
      // Don't show error if we're using mock data
      if (categories.length === 0) {
        setError('Failed to load categories');
      }
    } finally {
      setCategoriesLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const fetchedProducts = await productService.getAllProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      // Don't show error for products loading
    }
  };

  // Функция для подсчета продуктов в категории
  const getProductsCountForCategory = (categoryId: number): number => {
    return products.filter(product => product.categoryId === categoryId).length;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ name: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create new category (update functionality not available in API)
      const newCategory = await categoryService.createCategory({ name: formData.name });
      setSuccess('Category created successfully!');
      
      // Reload data from server to ensure consistency
      await loadCategories();
      await loadProducts();
      
      setFormData({ name: '' });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error saving category:', error);
      setError('Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleDelete = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      await categoryService.deleteCategory(categoryId);
      setSuccess('Category deleted successfully!');
      
      // Reload data from server to ensure consistency
      await loadCategories();
      await loadProducts();
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category');
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setFormData({ name: '' });
    setError(null);
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
                <Icons.ArrowLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
              </button>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white bg-gradient-to-r from-gray-300 to-slate-300 bg-clip-text text-transparent">
                  Categories
                </h1>
                <p className="text-white/70 text-lg mt-2">
                  Manage product categories and organization
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <Icons.Add className="w-5 h-5" />
                <span>Add Category</span>
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Total Categories</p>
                  <p className="text-3xl font-bold text-white">{categories.length}</p>
                </div>
                <div className="p-3 bg-emerald-600/20 rounded-xl">
                  <Icons.Folder className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Active Categories</p>
                  <p className="text-3xl font-bold text-emerald-400">{categories.length}</p>
                </div>
                <div className="p-3 bg-blue-400/20 rounded-xl">
                  <Icons.CheckCircle className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            </div>

                         <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-white/70 text-sm">Total Products</p>
                   <p className="text-3xl font-bold text-purple-400">
                     {products.length}
                   </p>
                 </div>
                 <div className="p-3 bg-purple-400/20 rounded-xl">
                   <Icons.Shopping className="w-8 h-8 text-purple-400" />
                 </div>
               </div>
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

          {/* Categories List */}
          <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
            {categoriesLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/10 border-t-indigo-500 border-r-purple-500 border-b-pink-500 mx-auto"></div>
                <p className="text-white/70 mt-4">Loading categories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="p-8 text-center">
                <Icons.Folder className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/70 text-lg mb-4">No categories found</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl transition-all duration-300"
                >
                  Add First Category
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-white/90 font-medium">ID</th>
                      <th className="px-6 py-4 text-left text-white/90 font-medium">Name</th>
                      <th className="px-6 py-4 text-left text-white/90 font-medium">Products Count</th>
                                             <th className="px-6 py-4 text-left text-white/90 font-medium">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-black/10 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <span className="text-white/70">#{category.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white font-medium">{category.name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">
                            {getProductsCountForCategory(category.id)} products
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-300 text-sm"
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

        {/* Add/Edit Category Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-black/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                                   <h2 className="text-2xl font-bold text-white">
                   Add New Category
                 </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="categoryName" className="block text-white/90 font-medium mb-2">
                      Category Name
                    </label>
                    <input
                      type="text"
                      id="categoryName"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-gray-500 focus:outline-none transition-all duration-300"
                      placeholder="Enter category name"
                      required
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-600/20 border border-red-500/40 rounded-xl">
                      <p className="text-red-200 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                                                     <span>Create</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
