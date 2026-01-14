'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button, Input } from '../ui';
import { AddProductRequest, Product, UpdateProductRequest } from '../../types/product';
import { useCategories } from '../../hooks/useCategories';
import { getProxiedImageUrl } from '../../utils';
import { Icons } from '../ui/icons';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: AddProductRequest | UpdateProductRequest) => void;
  product?: Product | null;
}

type FormData = AddProductRequest & { id?: number };

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
}) => {
  const { categories, loading: categoriesLoading, loadCategories } = useCategories();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: 0,
    description: '',
    quantity: 0,
    isInStock: true,
    categoryId: 0,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { Close: CloseIcon, Money: MoneyIcon, Cart: CartIcon, CheckCircle: CheckIcon, CancelIcon: ErrorIcon, CancelIcon } = Icons;

  useEffect(() => {
    if (isOpen && categories.length === 0 && !categoriesLoading) {
      loadCategories();
    }
  }, [isOpen, categories, categoriesLoading, loadCategories]);

  useEffect(() => {
    if (!isOpen) return;

    const defaultCategoryId = categories?.[0]?.id ?? 0;

    if (product) {
      let categoryId = product.categoryId ?? defaultCategoryId;
      if (!categories.some(cat => cat.id === categoryId)) {
        categoryId = defaultCategoryId;
      }

      setFormData({
        id: product.id,
        name: product.name || '',
        price: product.price || 0,
        description: product.description || '',
        quantity: product.quantity || 0,
        isInStock: product.isInStock ?? true,
        categoryId,
      });

      setImagePreview(product.image || null);
    } else {
      setFormData({
        name: '',
        price: 0,
        description: '',
        quantity: 0,
        isInStock: true,
        categoryId: defaultCategoryId,
      });
      setImagePreview(null);
      setImageFile(null);
    }

    setErrors({});
  }, [product, categories, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select an image file' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }
      setImageFile(file);
      setErrors(prev => ({ ...prev, image: '' }));

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => fileInputRef.current?.click();

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.quantity < 0) newErrors.quantity = 'Quantity cannot be negative';
    if (!formData.categoryId || !categories.some(cat => cat.id === formData.categoryId)) {
      newErrors.categoryId = 'Please select a valid category';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let val: any = value;
    if (type === 'checkbox') val = (e.target as HTMLInputElement).checked;
    else if (type === 'number' || name === 'categoryId') val = value === '' ? '' : Number(value);
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const finalCategoryId = formData.categoryId && categories.some(cat => cat.id === formData.categoryId)
      ? formData.categoryId
      : categories?.[0]?.id ?? 0;

    const dataToSave: FormData & { imageFile?: File } = {
      ...formData,
      categoryId: finalCategoryId,
    };

    if (imageFile) dataToSave.imageFile = imageFile;
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 p-4 animate-fadeIn -mt-40">
      <div className="bg-gradient-to-br from-indigo-950/95 via-purple-950/95 to-slate-900/95 text-white rounded-3xl shadow-2xl w-full max-w-3xl border border-white/20 overflow-hidden backdrop-blur-xl animate-slideIn">
        <div className="bg-gradient-to-r from-white/10 to-white/5 px-6 py-4 border-b border-white/20 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CartIcon className="w-8 h-8 text-indigo-300" />
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                {product ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-white/60 text-sm mt-1">
                {product ? 'Update product information' : 'Create a new product listing'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-all duration-300 hover:scale-110">
            <CloseIcon className="w-6 h-6 text-white/60 hover:text-white transition-colors duration-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-2">
              {/* Name */}
              <div className="group">
                <label className="block text-sm font-bold text-white mb-2 flex items-center">
                  <CartIcon className="text-indigo-300 mr-2 w-5 h-5" /> Product Name
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name..."
                  className={`w-full px-3 py-3 bg-white/10 border-2 rounded-xl focus:border-indigo-400 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-white/50 ${errors.name ? 'border-red-400/50' : 'border-white/20 group-hover:border-white/30'}`}
                />
                {errors.name && (
                  <p className="text-red-300 text-sm mt-2 flex items-center animate-shake">
                    <ErrorIcon className="w-4 h-4 mr-2 text-red-400" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="group">
                <label className="block text-sm font-bold text-white mb-2 flex items-center">
                  <MoneyIcon className="text-emerald-300 mr-2 w-5 h-5" /> Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">$</span>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    className={`w-full pl-8 pr-3 py-3 bg-white/10 border-2 rounded-xl focus:border-emerald-400 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-white/50 ${errors.price ? 'border-red-400/50' : 'border-white/20 group-hover:border-white/30'}`}
                  />
                </div>
                {errors.price && (
                  <p className="text-red-300 text-sm mt-2 flex items-center animate-shake">
                    <ErrorIcon className="w-4 h-4 mr-2 text-red-400" /> {errors.price}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="group">
                <label className="block text-sm font-bold text-white mb-2 flex items-center">
                  <CartIcon className="text-amber-300 mr-2 w-5 h-5" /> Quantity
                </label>
                <Input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="0"
                  className={`w-full px-3 py-3 bg-white/10 border-2 rounded-xl focus:border-amber-400 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-white/50 ${errors.quantity ? 'border-red-400/50' : 'border-white/20 group-hover:border-white/30'}`}
                />
                {errors.quantity && (
                  <p className="text-red-300 text-sm mt-2 flex items-center animate-shake">
                    <ErrorIcon className="w-4 h-4 mr-2 text-red-400" /> {errors.quantity}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="group">
                <label className="block text-sm font-bold text-white mb-2 flex items-center">
                  <CheckIcon className="text-purple-300 mr-2 w-5 h-5" /> Category
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={`w-full px-3 py-3 bg-white/10 border-2 rounded-xl focus:border-purple-400 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white ${errors.categoryId ? 'border-red-400/50' : 'border-white/20 group-hover:border-white/30'}`}
                >
                  {categoriesLoading ? (
                    <option>Loading categories...</option>
                  ) : categories.length === 0 ? (
                    <option value={0}>No categories available</option>
                  ) : (
                    categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))
                  )}
                </select>
                {errors.categoryId && (
                  <p className="text-red-400 text-sm mt-2 flex items-center animate-shake">
                    <ErrorIcon className="w-4 h-4 mr-2 text-red-400" /> {errors.categoryId}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column (Description & Image) */}
            <div className="space-y-3">
              {/* Description */}
              <div className="group">
                <label className="block text-sm font-bold text-white mb-2 flex items-center">
                  <CartIcon className="text-cyan-300 mr-2 w-5 h-5" /> Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter detailed product description..."
                  className="w-full px-3 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:border-cyan-400 focus:outline-none transition-all duration-300 resize-none backdrop-blur-sm text-white placeholder-white/50 group-hover:border-white/30"
                  rows={2}
                />
              </div>

              {/* Product Image */}
              <div>
                <label className="block text-sm font-bold text-white mb-2 flex items-center">
                  <MoneyIcon className="text-pink-300 mr-2 w-5 h-5" /> Product Image
                </label>
                <div className="space-y-4">
                  <div
                    className="w-full h-28 border-2 border-dashed border-white/30 rounded-xl flex items-center justify-center cursor-pointer hover:border-pink-400/50 hover:bg-white/5 transition-all duration-300 group overflow-hidden backdrop-blur-sm"
                    onClick={handleImageClick}
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={imagePreview.startsWith('data:') ? imagePreview : getProxiedImageUrl(imagePreview)}
                          alt="Product preview"
                          fill
                          style={{ objectFit: 'cover' }}
                          className="rounded-2xl transition-all duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="text-white/60 text-center group-hover:text-pink-300 transition-all duration-300">
                        <div className="text-4xl mb-2"><CartIcon className="inline w-8 h-8" /></div>
                        <div className="text-sm font-medium mb-2">Click to upload image</div>
                        <div className="text-xs text-white/50">Recommended: 500x500px, max 5MB</div>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                  {errors.image && (
                    <p className="text-red-400 text-sm flex items-center justify-center animate-shake">
                      <ErrorIcon className="w-4 h-4 mr-2 text-red-400" /> {errors.image}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-4 pt-3 border-t border-white/20">
            <Button type="button" variant="secondary" onClick={onClose} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 border border-white/20 hover:border-white/30 backdrop-blur-sm">
              <CancelIcon className="w-5 h-5 mr-2 inline" /> Cancel
            </Button>
            <Button type="submit" className="px-6 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl backdrop-blur-sm">
              {product ? <CheckIcon className="w-5 h-5 mr-2 inline" /> : <CartIcon className="w-5 h-5 mr-2 inline" />}
              {product ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
