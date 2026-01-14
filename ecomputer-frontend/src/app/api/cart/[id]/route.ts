import { NextResponse } from 'next/server';

// Backend API URL
const BACKEND_URL = 'http://localhost:5000';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log('[API] Get cart by ID endpoint called for ID:', id, '- forwarding to backend');
    
    // Get the authorization token from the request headers
    const authHeader = request.headers.get('Authorization');
    
    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/api/cart/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '',
      },
    });
    
    // Get the response from the backend
    const data = await response.json();
    
    // Return the response with the same status
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Get cart by ID error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
