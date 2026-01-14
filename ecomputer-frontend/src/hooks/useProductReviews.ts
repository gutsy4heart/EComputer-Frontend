import { useState, useEffect, useCallback } from 'react';
import { productReviewService } from '../services';
import { ProductReview, AddProductReviewRequest, UpdateProductReviewRequest } from '../types';

export const useProductReviews = (productId?: number) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);
      const reviewsData = await productReviewService.getProductReviews(productId);
      console.log('[useProductReviews] Loaded reviews:', reviewsData);
      setReviews(reviewsData);
    } catch (err) {
      setError('Не удалось загрузить отзывы');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const addReview = useCallback(async (request: AddProductReviewRequest) => {
    try {
      setLoading(true);
      setError(null);
      const success = await productReviewService.addProductReview(request);
      if (success) {
        await loadReviews(); // Перезагружаем отзывы
      } else {
        setError('Не удалось добавить отзыв');
      }
      return success;
    } catch (err) {
      setError('Ошибка при добавлении отзыва');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadReviews]);

  const updateReview = useCallback(async (request: UpdateProductReviewRequest) => {
    try {
      setLoading(true);
      setError(null);
      const success = await productReviewService.updateProductReview(request);
      if (success) {
        await loadReviews(); // Перезагружаем отзывы
      } else {
        setError('Не удалось обновить отзыв');
      }
      return success;
    } catch (err) {
      setError('Ошибка при обновлении отзыва');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadReviews]);

  const deleteReview = useCallback(async (reviewId: number) => {
    try {
      setLoading(true);
      setError(null);
      const success = await productReviewService.deleteProductReview(reviewId);
      if (success) {
        await loadReviews(); // Перезагружаем отзывы
      } else {
        setError('Не удалось удалить отзыв');
      }
      return success;
    } catch (err) {
      setError('Ошибка при удалении отзыва');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadReviews]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // Вычисляем средний рейтинг
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return {
    reviews,
    loading,
    error,
    addReview,
    updateReview,
    deleteReview,
    loadReviews,
    averageRating,
    totalReviews: reviews.length,
  };
}; 