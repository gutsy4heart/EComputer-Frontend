'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getProxiedImageUrl } from '../../utils';

interface UserAvatarProps {
  user: {
    id: number;
    name?: string;
    image?: string;
    imageUrl?: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 'md', 
  className = '',
  onClick 
}) => {
  const [imageLoadError, setImageLoadError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const sizeClass = sizeClasses[size];
  const displayName = user.name || 'User';
  const firstLetter = displayName.charAt(0).toUpperCase();

  // Отладочная информация
  console.log('[UserAvatar] User data:', user);
  console.log('[UserAvatar] Image fields:', { image: user.image, imageUrl: user.imageUrl });
  console.log('[UserAvatar] Will show image:', !!(user.image || user.imageUrl) && !imageLoadError);

  return (
    <div
      className={`relative rounded-full overflow-hidden border border-gray-300 ${sizeClass} ${className} ${
        onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
      }`}
      onClick={onClick}
    >
      {(user.image || user.imageUrl) && !imageLoadError ? (
        <Image
          src={getProxiedImageUrl(user.image || user.imageUrl || '')}
          alt={`${displayName}'s avatar`}
          fill
          style={{ objectFit: 'cover' }}
          onError={() => setImageLoadError(true)}
          unoptimized
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold select-none">
          {firstLetter}
        </div>
      )}
    </div>
  );
};
