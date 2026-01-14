'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '../../types/product';
import { formatPrice, truncateString, getProxiedImageUrl } from '../../utils';
import { useCartContext, useAuthContext } from '../../context';
import { Button, RatingStars } from '../ui';
import { useFavorites } from '../../hooks/useFavorites';
import { UserRole } from '../../types/user';
import ProductDiscount from './ProductDiscount';
import { usePromotions } from '../../hooks/usePromotions';

interface ProductCardProps {
  product: Product & {
    averageRating?: number;
    totalReviews?: number;
  };
  onAddToCart?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { cart, addProductToCart, itemsLoading } = useCartContext();
  const { user } = useAuthContext();
  const { isInFavorites, toggleFavorite, loading: favLoading } = useFavorites();
  const { getActiveDiscounts, loading: promotionsLoading } = usePromotions();
  const activeDiscounts = getActiveDiscounts();
  const cartItem = cart?.items.find(i => i.productId === product.id);
  const inCart = cartItem?.quantity || 0;
  const alreadyInCart = !!cartItem;
  
  // Проверяем, является ли пользователь администратором
  const isAdmin = user?.role === UserRole.Admin;

  const handleClick = () => {
    router.push(`/products/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.isInStock && !alreadyInCart) {
      addProductToCart(product.id, 1);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const isFavorite = isInFavorites(product.id);

  return (
    <div
      onClick={handleClick}
      className="h-full flex flex-col bg-black/30 backdrop-blur-xl border border-white/5 text-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-white/10 hover:scale-[1.02] transition-all duration-300 cursor-pointer relative group"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute top-4 left-4 w-8 h-8 border border-white/5 rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>
        <div className="absolute bottom-4 right-4 w-6 h-6 border border-white/5 rotate-45 animate-pulse"></div>
      </div>

      {/* Category badge */}
      {product.categoryName && (
        <div className="absolute top-4 left-4 z-30">
          <span className="px-3 py-1 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/10 shadow-lg">
            {product.categoryName}
          </span>
        </div>
      )}

      {/* Image container */}
      <div className="relative h-64 overflow-hidden">
        {(product.image || product.imageUrl) ? (
          <Image
            src={getProxiedImageUrl(product.image || product.imageUrl)}
            alt={product.name}
            width={200}
            height={200}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
            onLoad={e => {
              const target = e.target as HTMLImageElement;
              target.style.opacity = '1';
            }}
            onError={e => {
              const target = e.target as HTMLImageElement;
              if (!target.src.endsWith('/no-image.png')) {
                target.src = '/no-image.png';
                target.style.opacity = '0.5';
              }
            }}
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-white/30 text-sm">No image</span>
            </div>
          </div>
        )}
        
        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Stock badge on image */}
        <div className="absolute top-4 right-4 z-30">
          <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border shadow-lg ${
            product.isInStock 
              ? 'bg-gradient-to-r from-emerald-600/40 to-green-600/40 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20' 
              : 'bg-gradient-to-r from-red-600/40 to-red-700/40 text-red-300 border-red-500/40 shadow-red-500/20'
          }`}>
            {product.isInStock ? `${product.quantity} in stock` : 'Out of Stock'}
          </span>
        </div>

        {/* Favorite button - в правом нижнем углу изображения */}
        {!isAdmin && (
          <button
            className={`absolute bottom-4 right-4 z-30 p-3 rounded-full transition-all duration-300 ${
              isFavorite 
                ? 'bg-gradient-to-r from-pink-600 to-red-600 text-white shadow-lg' 
                : 'bg-black/60 backdrop-blur-sm text-white/70 hover:bg-pink-600/80 hover:text-white hover:scale-110 border border-white/20'
            } shadow-lg group-hover:shadow-xl`}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            disabled={favLoading}
          >
            {isFavorite ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col relative z-10">
        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-indigo-400 transition-colors duration-300">
          {product.name}
        </h3>
        
        {/* Рейтинг */}
        {product.averageRating !== undefined && (
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className="text-yellow-400 text-lg mr-1">★</span>
                <span className="text-sm font-bold text-white/90">
                  {product.averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-white/70">
                ({product.totalReviews || 0} reviews)
              </span>
            </div>
          </div>
        )}
        
        {/* Description */}
        <p className="text-white/80 text-sm mb-6 flex-grow leading-relaxed">
          {product.description ? truncateString(product.description, 80) : 'No description available'}
        </p>
        
        {/* Price and stock status */}
        <div className="mb-4 w-full min-w-0">
          <div className="flex flex-col w-full min-w-0">
            {/* Show original price only if there's no discount */}
            {!activeDiscounts?.some(d => d.isActive && d.productIds.includes(product.id)) && (
              <span className="text-2xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300 break-words">
                {formatPrice(product.price)}
              </span>
            )}
            {/* Product Discount Component */}
            <ProductDiscount
              productId={product.id}
              originalPrice={product.price}
              discounts={activeDiscounts}
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Add to cart button */}
      <div className="p-6 pt-0 relative z-10">
        <button
          onClick={handleAddToCart}
          disabled={!product.isInStock || itemsLoading || alreadyInCart}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold py-4 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 disabled:from-gray-700 disabled:to-gray-800 disabled:opacity-50 transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-lg group-hover:shadow-indigo-500/25 disabled:transform-none disabled:cursor-not-allowed"
        >
          {itemsLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white mr-3"></div>
              Adding...
            </div>
          ) : alreadyInCart ? (
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              In Cart
            </div>
          ) : product.quantity > 0 ? (
            <div className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              Add to Cart
            </div>
          ) : (
            'Out of Stock'
          )}
        </button>
      </div>
    </div>
  );
};
