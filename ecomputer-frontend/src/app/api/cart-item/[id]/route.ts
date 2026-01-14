import { NextResponse } from 'next/server';

// Backend API URL
const BACKEND_URL = 'http://localhost:5000';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log('[API] Get cart item by ID endpoint called for ID:', id, '- forwarding to backend');
    
 
    // Get the authorization token from the request headers
    const authHeader = request.headers.get('Authorization');
    
    const response = await fetch(`${BACKEND_URL}/api/cart-item/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '',
      },
    });
    
 
    const data = await response.json();
    
 
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Get cart item by ID error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log('[API] Delete cart item endpoint called for ID:', id, '- forwarding to backend');
    
 
    // Get the authorization token from the request headers
    const authHeader = request.headers.get('Authorization');
    
    const response = await fetch(`${BACKEND_URL}/api/cart-item/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '',
      },
    });
    
 
    const data = await response.json();
    
    console.log('[API] Delete cart item response:', data);
 
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Delete cart item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
