'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Layout } from '../../../../../components';
import { useAuthContext } from '../../../../../context';
import { UserRole } from '../../../../../types/user';
import { productService } from '../../../../../services/product.service';
import { Product } from '../../../../../types/product';
import { Category } from '../../../../../types/category';
import { categoryService } from '../../../../../services/category.service';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const { user, loading } = useAuthContext();
  const [product, setProduct] = useState<Product | null>(null);
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin/products');
    } else if (!loading && user && user.role !== UserRole.Admin) {
      router.push('/');
    } else if (!loading && user && user.role === UserRole.Admin) {
      loadProduct();
      loadCategories();
    }
  }, [user, loading, router, productId]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[EditProduct] Loading product:', productId);
      const fetchedProduct = await productService.getProductById(parseInt(productId));
      console.log('[EditProduct] Fetched product:', fetchedProduct);
      
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        setFormData({
          name: fetchedProduct.name || '',
          description: fetchedProduct.description || '',
          price: fetchedProduct.price?.toString() || '',
          quantity: fetchedProduct.quantity?.toString() || '',
          categoryId: fetchedProduct.categoryId?.toString() || '',
          image: fetchedProduct.image || ''
        });
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('[EditProduct] Error loading product:', err);
      setError('Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const fetchedCategories = await categoryService.getAllCategories();
      setCategories(fetchedCategories);
      console.log('[EditProduct] Loaded categories:', fetchedCategories);
    } catch (err) {
      console.error('[EditProduct] Error loading categories:', err);
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

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

             const productData = {
         id: parseInt(productId),
         name: formData.name,
         description: formData.description,
         price: parseFloat(formData.price),
         quantity: parseInt(formData.quantity),
         categoryId: formData.categoryId ? parseInt(formData.categoryId) : 1,
         isInStock: parseInt(formData.quantity) > 0,
         imageFile: imageFile || undefined
       };

      console.log('[EditProduct] Submitting product update:', productData);
      
             // Используем новый метод updateProduct
       const updatedProduct = await productService.updateProduct(productData);
       
       if (updatedProduct) {
         console.log('[EditProduct] Product updated successfully:', updatedProduct);
       } else {
         throw new Error('Failed to update product');
       }
      
      setSuccess('Product updated successfully!');
      
      // Redirect to products list after 2 seconds
      setTimeout(() => {
        router.push('/admin/products');
      }, 2000);

    } catch (err) {
      console.error('[EditProduct] Error updating product:', err);
      setError('Failed to update product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || isLoading) {
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

  if (error && !product) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
          <div className="container mx-auto px-4 py-8 relative z-10">
            <div className="text-center py-16">
              <div className="text-red-400 text-5xl mb-4">⚠️</div>
              <p className="text-red-200 text-lg font-medium">{error}</p>
              <button
                onClick={() => router.push('/admin/products')}
                className="mt-4 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300"
              >
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
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
                <h1 className="text-4xl md:text-5xl font-bold text-white bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                  Edit Product
                </h1>
                <p className="text-white/70 text-lg mt-2">
                  Update product information
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 relative overflow-hidden">
              {/* Inner animated gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 animate-pulse"></div>
              
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
                     {product?.image && !imageFile && (
                       <p className="text-blue-400 text-sm mt-2">
                         Current image: {product.image}
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
                      className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Update Product</span>
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
