import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '../../../utils/auth';

const BACKEND_URL = 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, rating, comment } = body;

    console.log('[API] Adding review:', { productId, rating, comment });

    // Validate input
    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Product ID, rating, and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Forward the request to the backend API
    const response = await fetch(`${BACKEND_URL}/api/productreviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${request.headers.get('Authorization')?.replace('Bearer ', '')}`,
      },
      body: JSON.stringify({
        productId,
        rating,
        reviewText: comment,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to add product review:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to add product review' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[API] Review added successfully:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in add product review API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, rating, comment } = body;

    console.log('[API] Updating review:', { id, rating, comment });

    // Validate input
    if (!id || !rating || !comment) {
      return NextResponse.json(
        { error: 'Review ID, rating, and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Forward the request to the backend API
    const response = await fetch(`${BACKEND_URL}/api/productreviews`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${request.headers.get('Authorization')?.replace('Bearer ', '')}`,
      },
      body: JSON.stringify({
        id,
        rating,
        reviewText: comment,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to update product review:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to update product review' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[API] Review updated successfully:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in update product review API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 