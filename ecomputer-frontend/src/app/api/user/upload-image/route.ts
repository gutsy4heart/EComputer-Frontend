import { NextRequest, NextResponse } from 'next/server';
import { isValidImage, isValidFileSize } from '../../../../utils/image';
import { getUserFromRequest } from '../../../../utils/auth';
import { UserRole } from '../../../../types';

const BACKEND_URL = 'http://localhost:5000';

/**
 * API route handler for uploading user profile images
 * 
 * @param request The incoming request with the image file and user ID
 * @returns The response with the image URL or error message
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }
    
    // Get the current user from the request
    const currentUser = await getUserFromRequest(request);
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse the form data
    const formData = await request.formData();
    const userId = formData.get('userId');
    const file = formData.get('file') as File | null;
    
    // Validate inputs
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    if (!file) {
      return NextResponse.json(
        { error: 'Image file is required' },
        { status: 400 }
      );
    }
    
    // Check if the user has permission to upload for this user ID
    // Only admins can upload for other users
    const isAdmin = currentUser.role === UserRole.Admin;
    
    if (userId.toString() !== currentUser.id.toString() && !isAdmin) {
      return NextResponse.json(
        { error: 'You do not have permission to upload images for this user' },
        { status: 403 }
      );
    }
    
    // Validate the file
    if (!isValidImage(file)) {
      return NextResponse.json(
        { error: 'Invalid image format. Supported formats: JPEG, PNG, GIF, WebP' },
        { status: 400 }
      );
    }
    
    if (!isValidFileSize(file, 5)) { // 5MB limit
      return NextResponse.json(
        { error: 'Image file size exceeds the 5MB limit' },
        { status: 400 }
      );
    }
    
    // Forward the request to the backend API
    const backendFormData = new FormData();
    backendFormData.append('ImageFile', file);
    
    const response = await fetch(`${BACKEND_URL}/api/user/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: backendFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend upload failed:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to upload image to backend' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Backend upload response:', data);
    
    // Return the image URL from backend
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in upload-image API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
