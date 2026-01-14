import { Category } from './category';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  isInStock: boolean;
  createdDate: string;
  quantity: number;
  categoryId: number;
  categoryName: string;
  category?: Category; // Добавляем поле category для поддержки отображения в заказах
  rating: number;
  image?: string;
  imageUrl?: string; // Added to match backend property
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductReview {
  id: number;
  productId: number;
  userId: number;
  userName?: string;
  userImage?: string;
  userImageUrl?: string;
  rating: number;
  comment: string;
  reviewText: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddProductRequest {
  name: string;
  price: number;
  description: string;
  quantity: number;
  isInStock: boolean;
  categoryId: number;
  imageFile?: File;
}

export interface UpdateProductRequest {
  id: number;
  name?: string;
  price?: number;
  description?: string;
  quantity?: number;
  isInStock?: boolean;
  categoryId?: number;
  categoryName?: string;
  imageFile?: File;
}

export interface DeleteProductRequest {
  id: number;
}

export interface FilterProductsRequest {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  isInStock?: boolean;
  categoryId?: number;
  page?: number;
  pageSize?: number;
}

export interface FilterProductsResponse {
  products?: Product[];
  totalCount?: number;
  totalPage?: number;
  value?: {
    pageSize: number;
    currentPage: number;
    totalPages: number;
    countItems: number;
    items: Product[];
    hasPrevious: boolean;
    hasNext: boolean;
  };
  error?: any;
  isSuccess?: boolean;
  isFailure?: boolean;
}

export interface ProductWithReviews extends Product {
  reviews?: ProductReview[];
  averageRating?: number;
  totalReviews?: number;
}

export interface AddProductReviewRequest {
  productId: number;
  rating: number;
  reviewText: string;  // Изменено с comment на reviewText
}

export interface UpdateProductReviewRequest {
  id: number;
  rating: number;
  reviewText: string;  // Изменено с comment на reviewText
}

export interface GetProductsParams {
  categoryId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  page?: number;
  pageSize?: number;
}
