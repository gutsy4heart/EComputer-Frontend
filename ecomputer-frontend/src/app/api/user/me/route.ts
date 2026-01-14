import { NextResponse } from 'next/server';

 
const BACKEND_URL = 'http://localhost:5000';

export async function GET(request: Request) {
  try {
    console.log('[API] Get current user endpoint called - forwarding to backend');
    
 
    const authHeader = request.headers.get('Authorization');
    console.log('[API] Authorization header:', authHeader);
    
 
    const response = await fetch(`${BACKEND_URL}/api/user/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });
    
 
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Get current user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
