import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '../../../../utils/auth';

const BACKEND_URL = 'http://localhost:5000';

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = params.productId;
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    console.log('[API] Getting reviews for product:', productId);

    // Forward the request to the backend API
    const response = await fetch(`${BACKEND_URL}/api/productreviews/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch product reviews:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch product reviews' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[API] Raw data from backend:', data);
    
    // Map backend ProductReviewDto to frontend format
    if (data && Array.isArray(data)) {
      const mappedData = data.map((review: any) => {
        console.log('[API] Processing review from backend:', review);
        
        // The backend DTO should have ReviewText field
        const reviewText = review.ReviewText || review.reviewText || review.comment || '';
        console.log('[API] Extracted reviewText:', reviewText);
        
        // Check for userImage fields
        const userImage = review.userImage || review.UserImage || review.userImageUrl || review.UserImageUrl;
        console.log('[API] Extracted userImage:', userImage);
        
        const mappedReview = {
          id: review.id || review.Id,
          productId: review.productId || review.ProductId,
          userId: review.userId || review.UserId,
          userName: review.userName || review.UserName,
          userImage: review.userImage || review.UserImage || review.userImageUrl || review.UserImageUrl,
          userImageUrl: review.userImage || review.UserImage || review.userImageUrl || review.UserImageUrl,
          rating: review.rating || review.Rating,
          comment: reviewText,
          reviewText: reviewText,
          createdAt: review.createdAt || review.CreatedAt,
          updatedAt: review.updatedAt || review.UpdatedAt
        };
        
        console.log('[API] Mapped review:', mappedReview);
        return mappedReview;
      });
      
      console.log('[API] Final mapped data:', mappedData);
      return NextResponse.json(mappedData);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in product reviews API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 