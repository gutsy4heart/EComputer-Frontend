'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input } from '../ui';
import { Category, AddCategoryRequest, UpdateCategoryRequest } from '../../types/category';
import { Icons } from '../ui/icons';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: AddCategoryRequest | UpdateCategoryRequest) => void;
  category?: Category | null;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  category
}) => {
  const [formData, setFormData] = useState<AddCategoryRequest>({ name: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (category) setFormData({ name: category.name });
    else setFormData({ name: '' });
  }, [category]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(category ? { id: category.id, ...formData } : formData);
    }
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 p-4 animate-fadeIn -mt-40">
      <div className="bg-gradient-to-br from-indigo-950/95 via-purple-950/95 to-slate-900/95 text-white rounded-3xl shadow-2xl w-full max-w-lg border border-white/20 overflow-hidden backdrop-blur-xl animate-slideIn">
        <div className="bg-gradient-to-r from-white/10 to-white/5 px-6 py-4 border-b border-white/20 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10">
                <Icons.Shipping className="w-6 h-6 text-indigo-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  {category ? 'Edit Category' : 'Add New Category'}
                </h2>
                <p className="text-white/60 text-xs">Create or update category information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 group"
            >
              <Icons.Close className="w-6 h-6 text-white/60 group-hover:text-white transition-colors duration-300" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-3">
            <div className="group">
              <label className="block text-sm font-bold text-white mb-2 flex items-center">
                <Icons.Money className="text-indigo-300 mr-2 w-5 h-5" />
                Category Name
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter category name..."
                className={`w-full px-3 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:border-indigo-400 focus:outline-none transition-all duration-300 backdrop-blur-sm text-white placeholder-white/50 group-hover:border-white/30 ${
                  errors.name ? 'border-red-500/50' : ''
                }`}
              />
              {errors.name && (
                <p className="text-red-300 text-sm mt-2 flex items-center">
                  <Icons.CancelIcon className="mr-1 w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm flex items-start text-indigo-300">
              <Icons.Shipping className="w-6 h-6 mr-3 mt-1" />
              <div>
                <div className="font-medium text-white">Category Information</div>
                <div className="text-sm text-white/60 mt-1">
                  Categories help organize your products and improve user experience.
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-4 pt-3 border-t border-white/20">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose}
              className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-bold transition-all duration-300 hover:bg-white/20 hover:scale-105"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {category ? 'Update Category' : 'Add Category'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
