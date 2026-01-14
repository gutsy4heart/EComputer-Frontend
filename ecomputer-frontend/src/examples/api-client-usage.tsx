
import { apiClient, ApiResponse, Product, Category, Order, User } from '../services/api-client';


export const setupAuthentication = (token: string) => {

  apiClient.setToken(token);
  
  const currentToken = apiClient.getToken();
  console.log('Current token:', currentToken);
  
  
  apiClient.clearToken();
};


export const getAllProducts = async () => {
  try {
    const response = await apiClient.getAllProducts();
    
    if (response.isSuccess && response.value) {
      const products = response.value;
      console.log(`Found ${products.length} products`);
      return products;
    } else {
      console.error('Failed to get products:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
};


export const getFilteredProducts = async (categoryId?: number, search?: string, minPrice?: number, maxPrice?: number) => {
  try {
    const response = await apiClient.getProducts({
      categoryId,
      search,
      minPrice,
      maxPrice,
      page: 1,
      pageSize: 10
    });
    
    if (response.isSuccess && response.value) {
      return response.value;
    } else {
      console.error('Failed to get filtered products:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error getting filtered products:', error);
    return [];
  }
};


export const addNewProduct = async (name: string, description: string, price: number, categoryId: number, quantity: number) => {
  try {
    const response = await apiClient.addProduct({
      name,
      description,
      price,
      categoryId,
      quantity,
      isInStock: quantity > 0
    });
    
    if (response.isSuccess && response.value) {
      console.log('Product added successfully:', response.value);
      return response.value;
    } else {
      console.error('Failed to add product:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error adding product:', error);
    return null;
  }
};

export const updateExistingProduct = async (product: Product) => {
  try {

    const updateRequest = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
      quantity: product.quantity,
      isInStock: product.isInStock
    };
    
    const response = await apiClient.updateProduct(updateRequest);
    
    if (response.isSuccess) {
      console.log('Product updated successfully');
      return true;
    } else {
      console.error('Failed to update product:', response.error);
      return false;
    }
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
};

/**
 * Example: Delete a product (Admin only)
 */
export const deleteProduct = async (productId: number) => {
  try {
    const response = await apiClient.deleteProduct(productId);
    
    if (response.isSuccess) {
      console.log('Product deleted successfully');
      return true;
    } else {
      console.error('Failed to delete product:', response.error);
      return false;
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

/**
 * Example: Upload a product image (Admin only)
 */
export const uploadProductImage = async (file: File) => {
  try {
    const response = await apiClient.uploadProductImage({ file });
    
    if (response.isSuccess && response.value) {
      console.log('Image uploaded successfully:', response.value.imageUrl);
      return response.value.imageUrl;
    } else {
      console.error('Failed to upload image:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

// ===== Categories =====

/**
 * Example: Get all categories
 */
export const getAllCategories = async () => {
  try {
    const response = await apiClient.getCategories();
    
    if (response.isSuccess && response.value) {
      return response.value;
    } else {
      console.error('Failed to get categories:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};

/**
 * Example: Add a new category (Admin only)
 */
export const addNewCategory = async (name: string, description?: string) => {
  try {
    const response = await apiClient.addCategory({ name, description });
    
    if (response.isSuccess && response.value) {
      console.log('Category added successfully:', response.value);
      return response.value;
    } else {
      console.error('Failed to add category:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error adding category:', error);
    return null;
  }
};

// ===== Cart =====

/**
 * Example: Get user's cart
 */
export const getUserCart = async () => {
  try {
    const response = await apiClient.getCart();
    
    if (response.isSuccess && response.value) {
      return response.value;
    } else {
      console.error('Failed to get cart:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error getting cart:', error);
    return null;
  }
};

/**
 * Example: Add item to cart
 */
export const addItemToCart = async (productId: number, quantity: number) => {
  try {
    const response = await apiClient.addCartItem({ productId, quantity });
    
    if (response.isSuccess && response.value) {
      console.log('Item added to cart successfully');
      return response.value;
    } else {
      console.error('Failed to add item to cart:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return null;
  }
};

/**
 * Example: Update cart item quantity
 */
export const updateCartItemQuantity = async (cartItemId: number, quantity: number) => {
  try {
    const response = await apiClient.updateCartItem({ id: cartItemId, quantity });
    
    if (response.isSuccess && response.value) {
      console.log('Cart item updated successfully');
      return response.value;
    } else {
      console.error('Failed to update cart item:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error updating cart item:', error);
    return null;
  }
};

/**
 * Example: Remove item from cart
 */
export const removeCartItem = async (cartItemId: number) => {
  try {
    const response = await apiClient.removeCartItem(cartItemId);
    
    if (response.isSuccess) {
      console.log('Cart item removed successfully');
      return true;
    } else {
      console.error('Failed to remove cart item:', response.error);
      return false;
    }
  } catch (error) {
    console.error('Error removing cart item:', error);
    return false;
  }
};

/**
 * Example: Clear cart
 */
export const clearCart = async () => {
  try {
    const response = await apiClient.clearCart();
    
    if (response.isSuccess) {
      console.log('Cart cleared successfully');
      return true;
    } else {
      console.error('Failed to clear cart:', response.error);
      return false;
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
    return false;
  }
};

// ===== Orders =====

/**
 * Example: Get order history (Admin only)
 */
export const getOrderHistory = async (userId?: number) => {
  try {
    const response = await apiClient.getOrderHistory(userId);
    
    if (response.isSuccess && response.value) {
      return response.value;
    } else {
      console.error('Failed to get order history:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error getting order history:', error);
    return [];
  }
};

/**
 * Example: Update order status (Admin only)
 */
export const updateOrderStatus = async (orderId: number, status: string) => {
  try {
    const response = await apiClient.updateOrderStatus(orderId, status);
    
    if (response.isSuccess) {
      console.log('Order status updated successfully');
      return true;
    } else {
      console.error('Failed to update order status:', response.error);
      return false;
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
};

/**
 * Example: Get order statistics (Admin only)
 */
export const getOrderStatistics = async (startDate?: string, endDate?: string) => {
  try {
    const response = await apiClient.getOrderStatistics(startDate, endDate);
    
    if (response.isSuccess && response.value) {
      return response.value;
    } else {
      console.error('Failed to get order statistics:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error getting order statistics:', error);
    return null;
  }
};

// ===== User =====

/**
 * Example: Upload user profile image
 */
export const uploadUserProfileImage = async (userId: number, file: File) => {
  try {
    const response = await apiClient.uploadUserImage({ userId, file });
    
    if (response.isSuccess && response.value) {
      console.log('Profile image uploaded successfully:', response.value.imageUrl);
      return response.value.imageUrl;
    } else {
      console.error('Failed to upload profile image:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return null;
  }
};

// ===== Favorites =====

/**
 * Example: Get user favorites
 */
export const getUserFavorites = async () => {
  try {
    const response = await apiClient.getFavorites();
    
    if (response.isSuccess && response.value) {
      return response.value;
    } else {
      console.error('Failed to get favorites:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

/**
 * Example: Add product to favorites
 */
export const addToFavorites = async (productId: number) => {
  try {
    const response = await apiClient.addFavorite({ productId });
    
    if (response.isSuccess && response.value) {
      console.log('Product added to favorites successfully');
      return response.value;
    } else {
      console.error('Failed to add to favorites:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return null;
  }
};

/**
 * Example: Remove product from favorites
 */
export const removeFromFavorites = async (productId: number) => {
  try {
    const response = await apiClient.removeFavorite(productId);
    
    if (response.isSuccess) {
      console.log('Product removed from favorites successfully');
      return true;
    } else {
      console.error('Failed to remove from favorites:', response.error);
      return false;
    }
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

// ===== Product Reviews =====

/**
 * Example: Get product reviews
 */
export const getProductReviews = async (productId: number) => {
  try {
    const response = await apiClient.getProductReviews(productId);
    
    if (response.isSuccess && response.value) {
      return response.value;
    } else {
      console.error('Failed to get product reviews:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error getting product reviews:', error);
    return [];
  }
};

/**
 * Example: Add product review
 */
export const addProductReview = async (productId: number, rating: number, comment: string) => {
  try {
    const response = await apiClient.addProductReview({ productId, rating, comment });
    
    if (response.isSuccess && response.value) {
      console.log('Review added successfully');
      return response.value;
    } else {
      console.error('Failed to add review:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error adding review:', error);
    return null;
  }
};

/**
 * Example: Update product review
 */
export const updateProductReview = async (reviewId: number, rating: number, comment: string) => {
  try {
    const response = await apiClient.updateProductReview({ id: reviewId, rating, comment });
    
    if (response.isSuccess && response.value) {
      console.log('Review updated successfully');
      return response.value;
    } else {
      console.error('Failed to update review:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error updating review:', error);
    return null;
  }
};

/**
 * Example: Delete product review
 */
export const deleteProductReview = async (reviewId: number) => {
  try {
    const response = await apiClient.deleteProductReview(reviewId);
    
    if (response.isSuccess) {
      console.log('Review deleted successfully');
      return true;
    } else {
      console.error('Failed to delete review:', response.error);
      return false;
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    return false;
  }
};

/**
 * Example: Get top-rated products (Admin only)
 */
export const getTopRatedProducts = async () => {
  try {
    const response = await apiClient.getTopRatedProducts();
    
    if (response.isSuccess && response.value) {
      return response.value;
    } else {
      console.error('Failed to get top-rated products:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error getting top-rated products:', error);
    return [];
  }
};
