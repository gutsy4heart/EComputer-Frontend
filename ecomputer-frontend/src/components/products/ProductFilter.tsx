'use client';

import React, { useState, useEffect } from 'react';
import { FilterProductsRequest, Category } from '../../types';
import { Input, Select, Checkbox } from '../ui';
import { useCategories } from '../../hooks';
import { useTranslation } from 'react-i18next';

interface ProductFilterProps {
  initialFilters: FilterProductsRequest;
  onFilterChange: (filters: FilterProductsRequest) => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  initialFilters,
  onFilterChange,
}) => {
  const { t } = useTranslation();
  const { categories = [], loading: categoriesLoading } = useCategories();
  const [filters, setFilters] = useState<FilterProductsRequest>(initialFilters);
  const [isClient, setIsClient] = useState(false);

  const [debouncedFilters, setDebouncedFilters] = useState<FilterProductsRequest>(initialFilters);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (JSON.stringify(filters) !== JSON.stringify(debouncedFilters)) {
        onFilterChange(filters);
        setDebouncedFilters(filters);
      }
    }, 500);  

    return () => clearTimeout(timer);  
  }, [filters, debouncedFilters, onFilterChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value ? Number(value) : undefined }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFilters((prev) => ({ ...prev, isInStock: checked }));
  };

  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      categoryId: value ? Number(value) : undefined,
    }));
  };

  return (
    <div className="w-full">
  
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
          {isClient ? t('filters') : 'Product Filters'}
        </h3>
        <p className="text-white/70 text-sm">Refine your search</p>
      </div>

      <div className="space-y-6">
  
        <div className="space-y-2">
          <label className="block text-sm font-bold text-white/90">
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>{isClient ? t('search') : 'Search'}</span>
            </span>
          </label>
          <input
            type="text"
            name="name"
            value={filters.name || ''}
            onChange={handleInputChange}
            placeholder={isClient ? t('search_products') : 'Search products...'}
            className="w-full bg-black/40 backdrop-blur-sm text-white border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-3 transition-all duration-300 placeholder-white/30"
          />
        </div>

    
        <div className="space-y-2">
          <label className="block text-sm font-bold text-white/90">
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span>Price Range</span>
            </span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice?.toString() || ''}
              onChange={handleNumberChange}
              placeholder={isClient ? t('min') : 'Min'}
              min={0}
              className="w-full bg-black/40 backdrop-blur-sm text-white border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-3 transition-all duration-300 placeholder-white/30"
            />
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice?.toString() || ''}
              onChange={handleNumberChange}
              placeholder={isClient ? t('max') : 'Max'}
              min={0}
              className="w-full bg-black/40 backdrop-blur-sm text-white border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-3 transition-all duration-300 placeholder-white/30"
            />
          </div>
        </div>

    
        <div className="space-y-2">
          <label className="block text-sm font-bold text-white/90">
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>{isClient ? t('category') : 'Category'}</span>
            </span>
          </label>
          <select
            value={filters.categoryId?.toString() || ''}
            onChange={(e) => handleCategoryChange(e.target.value)}
            disabled={categoriesLoading}
            className="w-full bg-black/40 backdrop-blur-sm text-white border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-3 transition-all duration-300 disabled:opacity-50"
          >
            <option value="">{isClient ? t('all_categories') : 'All Categories'}</option>
            {Array.isArray(categories) && categories.map((category) => (
              <option key={category.id} value={category.id.toString()}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* In Stock Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-white/90">
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Availability</span>
            </span>
          </label>
          <div className="flex items-center p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 hover:border-indigo-500/50 transition-all duration-300 group">
            <input
              type="checkbox"
              checked={filters.isInStock || false}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
              className="w-4 h-4 text-indigo-500 bg-black/40 border-white/20 rounded focus:ring-indigo-500 focus:ring-2"
            />
            <label className="ml-3 text-white/90 font-medium group-hover:text-white transition-colors duration-300">
              {isClient ? t('in_stock_only') : 'In Stock Only'}
            </label>
          </div>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={() => {
            const clearedFilters = {
              page: 1,
              pageSize: filters.pageSize,
            };
            setFilters(clearedFilters);
            onFilterChange(clearedFilters);
          }}
          className="w-full bg-gradient-to-r from-gray-600/30 to-gray-700/30 hover:from-gray-600/40 hover:to-gray-700/40 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 border border-white/10 hover:border-white/20 group"
        >
          <span className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Clear Filters</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;
