import { apiService } from './api';
import { 
  ProductReview, 
  AddProductReviewRequest, 
  UpdateProductReviewRequest 
} from '../types';

export class ProductReviewService {
  private static instance: ProductReviewService;

  private constructor() {}

  public static getInstance(): ProductReviewService {
    if (!ProductReviewService.instance) {
      ProductReviewService.instance = new ProductReviewService();
    }
    return ProductReviewService.instance;
  }

  /**
   * Получить отзывы для конкретного продукта
   */
  public async getProductReviews(productId: number): Promise<ProductReview[]> {
    try {
      const response = await apiService.get<any[]>(`/productreviews/${productId}`);
      
      if (response.isSuccess && response.value) {
        console.log('[ProductReview] Raw response from backend:', response.value);
        
        // Преобразуем данные от бэкенда к нашему формату
        const reviews = response.value.map((item: any) => {
          console.log('[ProductReview] Processing review item:', item);
          
          // Try all possible field names for the comment
          const possibleCommentFields = [
            'ReviewText', 'reviewText', 'comment', 'text', 'content', 'message', 'description'
          ];
          
          let comment = '';
          for (const field of possibleCommentFields) {
            if (item[field] && typeof item[field] === 'string' && item[field].trim() !== '') {
              comment = item[field];
                        console.log('[ProductReview] Found comment in field:', field, 'value:', comment);
          break;
        }
      }
      
      // Check for userImage fields
      const userImage = item.userImage || item.UserImage || item.userImageUrl || item.UserImageUrl;
      console.log('[ProductReview] Found userImage:', userImage);
          
          const processedReview = {
            id: item.id || item.Id,
            productId: item.productId || item.ProductId,
            userId: item.userId || item.UserId,
            userName: item.userName || item.UserName,
            userImage: item.userImage || item.UserImage || item.userImageUrl || item.UserImageUrl,
            userImageUrl: item.userImage || item.UserImage || item.userImageUrl || item.UserImageUrl,
            rating: item.rating || item.Rating,
            comment: comment,
            reviewText: comment,
            createdAt: item.createdAt || item.CreatedAt,
            updatedAt: item.updatedAt || item.UpdatedAt
          };
          
          console.log('[ProductReview] Processed review:', processedReview);
          return processedReview;
        });
        
        console.log('[ProductReview] Final processed reviews:', reviews);
        return reviews;
      }
      console.error('[ProductReview] Failed to get product reviews:', response.error);
      return [];
    } catch (error) {
      console.error('[ProductReview] Error fetching product reviews:', error);
      return [];
    }
  }

  /**
   * Добавить отзыв к продукту
   */
  public async addProductReview(request: AddProductReviewRequest): Promise<boolean> {
    try {
      const response = await apiService.post<ProductReview>('/productreviews', request);
      if (response.isSuccess) {
        console.log('[ProductReview] Review added successfully');
        return true;
      }
      console.error('[ProductReview] Failed to add review:', response.error);
      return false;
    } catch (error) {
      console.error('[ProductReview] Error adding review:', error);
      return false;
    }
  }

  /**
   * Обновить отзыв
   */
  public async updateProductReview(request: UpdateProductReviewRequest): Promise<boolean> {
    try {
      const response = await apiService.put<ProductReview>('/productreviews', request);
      if (response.isSuccess) {
        console.log('[ProductReview] Review updated successfully');
        return true;
      }
      console.error('[ProductReview] Failed to update review:', response.error);
      return false;
    } catch (error) {
      console.error('[ProductReview] Error updating review:', error);
      return false;
    }
  }

  /**
   * Удалить отзыв
   */
  public async deleteProductReview(reviewId: number): Promise<boolean> {
    try {
      const response = await apiService.delete<void>(`/productreviews/${reviewId}`);
      if (response.isSuccess) {
        console.log('[ProductReview] Review deleted successfully');
        return true;
      }
      console.error('[ProductReview] Failed to delete review:', response.error);
      return false;
    } catch (error) {
      console.error('[ProductReview] Error deleting review:', error);
      return false;
    }
  }
}

export const productReviewService = ProductReviewService.getInstance(); 