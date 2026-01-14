import { NextResponse } from 'next/server';

 
const BACKEND_URL = 'http://localhost:5000';

export async function POST(request: Request) {
  try {
    console.log('[API] Logout endpoint called - forwarding to backend');
 
    const body = await request.json();
    console.log('[API] Logout request body:', { 
      token: body.token ? 'present' : 'missing'
    });
    
   
    const response = await fetch(`${BACKEND_URL}/api/user/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
  
    const data = await response.json();
    
   
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
