import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '../../../../services/api-client';

/**
 * DELETE /api/favorite/[id]
 * Remove a product from favorites
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`[API] Remove from favorites endpoint called for product ID ${params.id} - forwarding to backend`);
    
    // Get the authorization token from the request headers
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Set token in API client
    apiClient.setToken(authHeader.replace('Bearer ', ''));

    // Validate product ID
    const productId = parseInt(params.id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    // Remove from favorites
    const response = await apiClient.removeFavorite(productId);

    if (response.isSuccess) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: response.error || 'Failed to remove from favorites' }, { status: 400 });
    }
  } catch (error) {
    console.error('[API] Error removing from favorites:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
