'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Input, Button, UserAvatar } from '../ui';
import { useAuthContext } from '../../context';
import { isValidName, getProxiedImageUrl } from '../../utils';

export const ProfileForm: React.FC = () => {
  const { user, updateUser, uploadUserImage, loading, error } = useAuthContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    address: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        name: user.name || '',
        address: user.address || '',
      });

      setFormErrors({ name: '', address: '' });
      setSuccessMessage('');
      setImageError('');
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
    setSuccessMessage('');
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', address: '', password: '' };

    const isNameChanged = formData.name.trim() !== (user?.name || '').trim();
    const isAddressChanged = formData.address.trim() !== (user?.address || '').trim();

    if (!isNameChanged && !isAddressChanged) {
      setSuccessMessage('No changes detected');
      return false;
    }

    if (isNameChanged) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
        valid = false;
      } else if (!isValidName(formData.name.trim())) {
        newErrors.name = 'Name must be between 3 and 20 characters';
        valid = false;
      }
    }

    if (isAddressChanged) {
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
        valid = false;
      }
    }

    setFormErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user) {
      return;
    }

    const updateData: { name?: string; address?: string } = {};

    if (formData.name.trim() !== (user.name || '').trim()) {
      updateData.name = formData.name.trim();
    }

    if (formData.address.trim() !== (user.address || '').trim()) {
      updateData.address = formData.address.trim();
    }

    const success = await updateUser(user.id, updateData);

    setSuccessMessage(success ? 'Profile updated successfully' : 'Error updating profile');
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && user) {
      const file = e.target.files[0];

      // Сброс ошибок при новой загрузке
      setImageError('');
      setSuccessMessage('');

      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        setImageError('Please select an image file');
        return;
      }

      // Проверка размера (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Image size should be less than 5MB');
        return;
      }

      setImageLoading(true);

      try {
        const imageUrl = await uploadUserImage(user.id, file);
        if (imageUrl) {
          setSuccessMessage('Profile image updated successfully');
        } else {
          setImageError('Failed to upload image');
        }
      } catch (err) {
        console.error('Error uploading image:', err);
        setImageError('Error uploading image');
      } finally {
        setImageLoading(false);
      }
    }
  };

  if (!user) {
    return <div className="text-center text-red-600">User is not authenticated.</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Profile Picture Section */}
      <div className="flex flex-col items-center mb-8">
        <div
          className="relative cursor-pointer group"
          onClick={handleImageClick}
        >
          {/* Avatar with enhanced styling */}
          <div className="relative">
            <UserAvatar
              user={{
                id: user.id,
                name: user.name,
                image: user.image,
                imageUrl: user.imageUrl
              }}
              size="xl"
              className="border-4 border-white/10 shadow-2xl group-hover:border-indigo-500 transition-all duration-300"
            />
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            
            {/* Loading overlay */}
            {imageLoading && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/10 border-t-white"></div>
                  <div className="absolute inset-0 animate-ping rounded-full h-8 w-8 border border-white opacity-20"></div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
        
        <button
          type="button"
          onClick={handleImageClick}
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors duration-300 font-medium group"
        >
          <span className="flex items-center space-x-2">
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Change Profile Picture</span>
          </span>
        </button>
        
        {imageError && (
          <div className="mt-2 p-3 bg-red-600/20 border border-red-500/40 rounded-xl">
            <p className="text-red-200 text-xs text-center">{imageError}</p>
          </div>
        )}
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-white/90">
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Name</span>
            </span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-black/40 backdrop-blur-sm text-white border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-3 transition-all duration-300 placeholder-white/30"
            placeholder="Enter your name"
          />
          {formErrors.name && (
            <p className="text-red-200 text-xs flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{formErrors.name}</span>
            </p>
          )}
        </div>

        {/* Address Input */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-white/90">
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Address</span>
            </span>
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full bg-black/40 backdrop-blur-sm text-white border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-3 transition-all duration-300 placeholder-white/30"
            placeholder="Enter your address"
          />
          {formErrors.address && (
            <p className="text-red-200 text-xs flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{formErrors.address}</span>
            </p>
          )}
        </div>

        {/* Email Display (Read-only) */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-white/90">
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Email</span>
            </span>
          </label>
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full bg-black/20 backdrop-blur-sm text-white/70 border border-white/5 rounded-xl px-4 py-3 cursor-not-allowed"
            placeholder="Email address"
          />
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="p-4 bg-red-600/20 border border-red-500/40 rounded-xl">
            <p className="text-red-200 text-sm text-center">{error}</p>
          </div>
        )}
        
        {successMessage && (
          <div className={`p-4 rounded-xl border ${
            successMessage.includes('successfully')
              ? 'bg-emerald-600/20 border-emerald-500/40'
              : successMessage.includes('No changes')
              ? 'bg-yellow-600/20 border-yellow-500/40'
              : 'bg-red-600/20 border-red-500/40'
          }`}>
            <p className={`text-sm text-center ${
              successMessage.includes('successfully')
                ? 'text-emerald-200'
                : successMessage.includes('No changes')
                ? 'text-yellow-200'
                : 'text-red-200'
            }`}>
              {successMessage}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
        >
          {loading ? (
            <span className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div>
              <span>Updating...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Update Profile</span>
            </span>
          )}
        </button>
      </form>
    </div>
  );
};
