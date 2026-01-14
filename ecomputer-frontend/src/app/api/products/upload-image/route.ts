import { NextRequest, NextResponse } from 'next/server';

/**
 * API route handler for uploading product images
 * This endpoint accepts multipart/form-data with a file and productId
 */
export async function POST(request: NextRequest) {
  try {
    // Get the authorization token from the request
    const token = request.headers.get('authorization')?.split(' ')[1] || '';
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }

    // Forward the request to the backend API
    const formData = await request.formData();
    
    // Get the backend API URL from environment variables or use a default
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    // Forward the request to the backend API
    const response = await fetch(`${apiUrl}/api/product/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || 'Failed to upload product image' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in upload-product-image API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
