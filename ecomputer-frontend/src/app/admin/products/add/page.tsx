'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '../../../../components';
import { useAuthContext } from '../../../../context';
import { UserRole } from '../../../../types/user';
import { productService } from '../../../../services/product.service';
import { Category } from '../../../../types/category';
import { categoryService } from '../../../../services/category.service';

export default function AddProductPage() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    categoryId: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin/products/add');
    } else if (!loading && user && user.role !== UserRole.Admin) {
      router.push('/');
    } else if (!loading && user && user.role === UserRole.Admin) {
      loadCategories();
    }
  }, [user, loading, router]);

  const loadCategories = async () => {
    try {
      const fetchedCategories = await categoryService.getAllCategories();
      setCategories(fetchedCategories);
      console.log('[AddProduct] Loaded categories:', fetchedCategories);
    } catch (err) {
      console.error('[AddProduct] Error loading categories:', err);
      // Если API недоступен, показываем пустой список
      setCategories([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.quantity) {
      setError('Please fill in all required fields');
      return;
    }

    if (categories.length === 0) {
      setError('Please add at least one category before creating products');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

             const productData = {
         name: formData.name,
         description: formData.description,
         price: parseFloat(formData.price),
         quantity: parseInt(formData.quantity),
         categoryId: formData.categoryId ? parseInt(formData.categoryId) : 1,
         isInStock: parseInt(formData.quantity) > 0,
         imageFile: imageFile || undefined
       };

      console.log('[AddProduct] Submitting product:', productData);
      
             // Используем новый метод createProduct
       const newProduct = await productService.createProduct(productData);
       
       if (newProduct) {
         console.log('[AddProduct] Product created successfully:', newProduct);
       } else {
         throw new Error('Failed to create product');
       }
      
             setSuccess('Product created successfully!');
       
              // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          quantity: '',
          categoryId: '',
          image: ''
        });
        setImageFile(null);

        // Redirect to products list after 1 second
        setTimeout(() => {
          router.push('/admin/products');
        }, 1000);

    } catch (err) {
      console.error('[AddProduct] Error creating product:', err);
      setError('Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
                onClick={() => router.push('/admin/products')}
                className="p-3 rounded-2xl bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/40 transition-all duration-300 group"
              >
                <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                  Add New Product
                </h1>
                <p className="text-white/70 text-lg mt-2">
                  Create a new product for your catalog
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden">
              {/* Inner animated gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-green-600/10 to-teal-600/10 animate-pulse"></div>
              
              <div className="relative z-10">
                {error && (
                  <div className="mb-6 p-4 bg-red-600/20 border border-red-500/40 rounded-xl">
                    <p className="text-red-200 text-center">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-4 bg-emerald-600/20 border border-emerald-500/40 rounded-xl">
                    <p className="text-emerald-200 text-center">{success}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Product Name */}
                  <div>
                    <label htmlFor="name" className="block text-white/90 font-medium mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-indigo-500 focus:outline-none transition-all duration-300"
                      placeholder="Enter product name"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-white/90 font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-indigo-500 focus:outline-none transition-all duration-300 resize-none"
                      placeholder="Enter product description"
                    />
                  </div>

                  {/* Price and Quantity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="price" className="block text-white/90 font-medium mb-2">
                        Price *
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60">$</span>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                          min="0"
                          step="0.01"
                          className="w-full pl-8 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-indigo-500 focus:outline-none transition-all duration-300"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="quantity" className="block text-white/90 font-medium mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-indigo-500 focus:outline-none transition-all duration-300"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="categoryId" className="block text-white/90 font-medium mb-2">
                      Category
                    </label>
                    {categories.length === 0 ? (
                      <div className="p-4 bg-yellow-600/20 border border-yellow-500/40 rounded-xl">
                        <p className="text-yellow-200 text-sm">
                          No categories available. Please add categories first in the{' '}
                          <button
                            type="button"
                            onClick={() => router.push('/admin/categories')}
                            className="text-yellow-300 underline hover:text-yellow-200"
                          >
                            Categories section
                          </button>
                        </p>
                      </div>
                    ) : (
                      <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-indigo-500 focus:outline-none transition-all duration-300"
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                                     {/* Image Upload */}
                   <div>
                     <label htmlFor="imageFile" className="block text-white/90 font-medium mb-2">
                       Product Image
                     </label>
                     <input
                       type="file"
                       id="imageFile"
                       name="imageFile"
                       accept="image/*"
                       onChange={handleImageChange}
                       className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-indigo-500 focus:outline-none transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                     />
                     {imageFile && (
                       <p className="text-emerald-400 text-sm mt-2">
                         Selected: {imageFile.name}
                       </p>
                     )}
                   </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={() => router.push('/admin/products')}
                      className="px-6 py-3 bg-gray-600/30 border border-gray-500/40 text-white rounded-xl hover:bg-gray-600/40 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span>Create Product</span>
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
