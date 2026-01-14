/**
 * Utility functions for handling images
 */

/**
 * Get a proxied image URL to avoid CORS issues
 * @param url The original image URL
 * @returns The proxied image URL
 */
export const getProxiedImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  
  // If the URL is already a relative path or a data URL, return it as is
  if (url.startsWith('/') || url.startsWith('data:')) {
    return url;
  }
  
  // If the URL is from the same origin, return it as is
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  if (url.startsWith(currentOrigin)) {
    return url;
  }
  
  // Otherwise, proxy the URL through our image proxy API
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
};

/**
 * Check if a file is a valid image type
 * @param file The file to check
 * @returns True if the file is a valid image type, false otherwise
 */
export const isValidImage = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
};

/**
 * Check if a file size is within the specified limit
 * @param file The file to check
 * @param maxSizeMB The maximum file size in MB
 * @returns True if the file size is within the limit, false otherwise
 */
export const isValidFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Generate a unique filename for an image
 * @param file The file to generate a filename for
 * @param prefix Optional prefix for the filename
 * @returns A unique filename
 */
export const generateUniqueFilename = (file: File, prefix: string = ''): string => {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = file.name.split('.').pop();
  
  return `${prefix}${timestamp}_${randomString}.${extension}`;
};

/**
 * Convert a File object to a base64 string
 * @param file The file to convert
 * @returns A Promise that resolves to the base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Convert a base64 string to a Blob object
 * @param base64 The base64 string to convert
 * @param mimeType The MIME type of the blob
 * @returns A Blob object
 */
export const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeType });
};

/**
 * Resize an image to a specified width and height
 * @param file The image file to resize
 * @param maxWidth The maximum width of the resized image
 * @param maxHeight The maximum height of the resized image
 * @param quality The quality of the resized image (0-1)
 * @returns A Promise that resolves to the resized image as a Blob
 */
export const resizeImage = (
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      // Calculate new dimensions
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round(height * maxWidth / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round(width * maxHeight / height);
          height = maxHeight;
        }
      }
      
      // Create canvas and draw resized image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert canvas to blob
      canvas.toBlob(
        blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Could not create blob from canvas'));
          }
        },
        file.type,
        quality
      );
      
      // Clean up
      URL.revokeObjectURL(img.src);
    };
    
    img.onerror = () => {
      reject(new Error('Could not load image'));
      URL.revokeObjectURL(img.src);
    };
  });
};

/**
 * Create a thumbnail from an image
 * @param file The image file to create a thumbnail from
 * @param size The size of the thumbnail (width and height)
 * @returns A Promise that resolves to the thumbnail as a Blob
 */
export const createThumbnail = (file: File, size: number = 200): Promise<Blob> => {
  return resizeImage(file, size, size, 0.7);
};

/**
 * Get image dimensions
 * @param file The image file to get dimensions for
 * @returns A Promise that resolves to the image dimensions
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
      URL.revokeObjectURL(img.src);
    };
    
    img.onerror = () => {
      reject(new Error('Could not load image'));
      URL.revokeObjectURL(img.src);
    };
  });
};
