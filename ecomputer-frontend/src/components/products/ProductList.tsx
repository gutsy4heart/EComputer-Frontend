'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { productService } from '../../services/product.service';
import { Icons } from '../ui/icons';

interface ProductListProps {
  products?: Product[];
  loading?: boolean;
  error?: string | null;
}

export const ProductList: React.FC<ProductListProps> = ({
  products: propProducts,
  loading: propLoading = false,
  error: propError = null,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const { CancelIcon: ErrorIcon, Close: EmptyIcon } = Icons;

  useEffect(() => {
    if (propProducts && propProducts.length > 0) {
      setProducts(propProducts);
      return;
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const allProducts = await productService.getAllProducts();
        setProducts(allProducts);
      } catch (error) {
        setLoadError('Error fetching products');
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [propProducts]);

  if (isLoading || propLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/10 border-t-indigo-500 border-r-purple-500 border-b-pink-500"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-indigo-500 opacity-20"></div>
        </div>
      </div>
    );
  }

  if (loadError || propError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="bg-gradient-to-r from-red-600/20 to-red-700/20 border border-red-500/40 rounded-2xl p-8 text-center backdrop-blur-sm">
          <ErrorIcon className="mx-auto text-red-300 text-6xl mb-4" />
          <p className="text-red-100 text-xl font-medium mb-2">Error loading products</p>
          <p className="text-red-200 text-sm">{loadError || propError}</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="bg-black/30 backdrop-blur-sm border border-white/5 rounded-2xl p-12 text-center">
          <EmptyIcon className="mx-auto text-white/30 text-6xl mb-4" />
          <p className="text-white/70 text-xl font-medium mb-2">No products found</p>
          <p className="text-white/50 text-sm">Try adjusting your filters or search terms</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="h-full animate-fadeIn"
          style={{
            animationDelay: `${index * 0.1}s`,
            animationFillMode: 'both',
          }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};
