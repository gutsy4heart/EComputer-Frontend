'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Button } from '../../../components';
import { useProducts, useProductReviews } from '../../../hooks';
import { useCartContext, useAuthContext } from '../../../context';
import { formatPrice, getProxiedImageUrl } from '../../../utils';
import { UserRole } from '../../../types/user';
import Link from 'next/link';
import { ProductReviews } from '../../../components/products';
import { RatingStars } from '../../../components/ui';
import Image from 'next/image';
import ProductDiscount from '../../../components/products/ProductDiscount';
import { usePromotions } from '../../../hooks/usePromotions';

interface ProductDetailsPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const router = useRouter();
  const { getProductById } = useProducts();
  const { addProductToCart, itemsLoading } = useCartContext();
  const { user } = useAuthContext();
  const isAdmin = user?.role === UserRole.Admin;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const { getActiveDiscounts, loading: promotionsLoading } = usePromotions();
  const activeDiscounts = getActiveDiscounts();

  const productId = parseInt(params.id);
  const { 
    reviews, 
    loading: reviewsLoading, 
    error: reviewsError, 
    addReview, 
    updateReview, 
    deleteReview, 
    averageRating, 
    totalReviews 
  } = useProductReviews(productId);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const productData = await getProductById(productId);

        if (productData) {
          console.log('Product data received:', JSON.stringify(productData, null, 2));
          console.log('Product category ID:', productData.categoryId);
          console.log('Product category name:', productData.categoryName);
          
          setProduct(productData);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId, getProductById]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product && product.isInStock) {
      addProductToCart(product.id, quantity);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleAddReview = async (rating: number, reviewText: string) => {
    return await addReview({
      productId: productId,
      rating,
      reviewText
    });
  };

  const handleUpdateReview = async (reviewId: number, rating: number, reviewText: string) => {
    return await updateReview({
      id: reviewId,
      rating,
      reviewText
    });
  };

  const handleDeleteReview = async (reviewId: number) => {
    return await deleteReview(reviewId);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col justify-center items-center h-64">
              <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-700/50 rounded-2xl p-8 text-center backdrop-blur-sm">
                <div className="text-red-400 text-6xl mb-4">⚠️</div>
                <div className="text-red-300 text-xl mb-4">{error || 'Product not found'}</div>
                <Button 
                  variant="primary" 
                  onClick={handleGoBack}
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
                >
                  ← Go Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Enhanced Back button */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center text-white/60 hover:text-white transition-all duration-300 group bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10 hover:border-white/20"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Products
            </button>
          </div>

          <div className="space-y-8">
            {/* Product details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced Image Section */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-indigo-950/50 via-purple-950/50 to-slate-900/50 rounded-3xl shadow-2xl border border-white/10 overflow-hidden backdrop-blur-xl p-6">
                  <div className="relative aspect-square rounded-2xl overflow-hidden">
                    {product.image || product.imageUrl ? (
                      <Image
                        src={getProxiedImageUrl(product.image || product.imageUrl)}
                        alt={product.name}
                        fill
                        className="object-cover transition-all duration-500 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/no-image.png';
                          target.style.opacity = '0.5';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-slate-900/50 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl mb-4 text-white/30">📦</div>
                          <span className="text-white/50 text-lg">No image available</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-2 -right-2 w-8 h-8 border border-purple-500/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border border-pink-500/30 rotate-45 animate-pulse"></div>
              </div>

              {/* Enhanced Product Info */}
              <div className="bg-gradient-to-br from-indigo-950/50 via-purple-950/50 to-slate-900/50 rounded-3xl shadow-2xl border border-white/10 p-8 backdrop-blur-xl">
                {/* Product Name */}
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
                  {product.name}
                </h1>

                {/* Price and Stock Status */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col space-y-2">
                    <span className="text-4xl font-bold text-emerald-400">
                      {formatPrice(product.price)}
                    </span>
                    {/* Product Discount Component */}
                    <ProductDiscount
                      productId={product.id}
                      originalPrice={product.price}
                      discounts={activeDiscounts}
                      className="mt-2"
                    />
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm border ${
                    product.isInStock 
                      ? 'bg-gradient-to-r from-emerald-600/20 to-green-600/20 text-emerald-300 border-emerald-500/30' 
                      : 'bg-gradient-to-r from-red-600/20 to-red-500/20 text-red-300 border-red-500/30'
                  }`}>
                    {product.isInStock ? `✅ In Stock (${product.quantity})` : '❌ Out of Stock'}
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-8 p-4 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-2xl border border-amber-500/20 backdrop-blur-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-3xl mr-3">⭐</span>
                      <span className="text-2xl font-bold text-white">
                        {averageRating.toFixed(1)} из 5
                      </span>
                    </div>
                    <span className="text-white/60 text-lg">
                      ({totalReviews} отзывов)
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="text-cyan-300 mr-2">📄</span>
                    Description
                  </h2>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <p className="text-white/80 text-lg leading-relaxed">
                      {product.description || 'No description available'}
                    </p>
                  </div>
                </div>

                {/* Category */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="text-purple-300 mr-2">📁</span>
                    Category
                  </h2>
                  <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-2xl p-4 border border-purple-500/30 backdrop-blur-sm">
                    <p className="text-purple-300 font-medium text-lg">
                      {product.categoryName || 'No category'}
                    </p>
                    {product.categoryId && (
                      <p className="text-purple-400/70 text-sm mt-1">
                        Category ID: {product.categoryId}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="text-amber-300 mr-2">📦</span>
                    Quantity
                  </h2>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/10 backdrop-blur-sm disabled:opacity-50 disabled:transform-none"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.quantity}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-20 h-12 bg-white/10 border border-white/20 text-white text-center rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-sm"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      className="w-12 h-12 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/10 backdrop-blur-sm disabled:opacity-50 disabled:transform-none"
                      disabled={quantity >= product.quantity}
                    >
                      +
                    </button>
                    <span className="text-white/60 text-sm">
                      Available: {product.quantity} items
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <Button
                    variant="primary"
                    onClick={handleAddToCart}
                    disabled={!product.isInStock || itemsLoading || quantity > product.quantity || quantity <= 0}
                    className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl backdrop-blur-sm disabled:opacity-50 disabled:transform-none border border-white/10"
                  >
                    {itemsLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                        Adding to Cart...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                        </svg>
                        Add to Cart
                      </div>
                    )}
                  </Button>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="block w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white px-8 py-4 rounded-2xl font-bold text-center transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm border border-white/10"
                    >
                      ⚙️ Edit in Admin Panel
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <ProductReviews
              reviews={reviews}
              loading={reviewsLoading}
              error={reviewsError}
              onAddReview={handleAddReview}
              onUpdateReview={handleUpdateReview}
              onDeleteReview={handleDeleteReview}
              averageRating={averageRating}
              totalReviews={totalReviews}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

