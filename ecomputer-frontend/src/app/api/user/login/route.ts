import { NextResponse } from 'next/server';

 
const BACKEND_URL = 'http://localhost:5000';

export async function POST(request: Request) {
  try {
    console.log('[API] Login endpoint called - forwarding to backend');
  
    const body = await request.json();
 
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
 
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
 
    console.log('[API] Login request body:', { ...body, password: '***' });
 
    const response = await fetch(`${BACKEND_URL}/api/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

 
    if (!response.ok) {
       
      const errorData = await response.json();
      console.error('[API] Backend error:', errorData);
      return NextResponse.json(errorData, { status: response.status });
    }

 
    const data = await response.json();
    console.log('[API] Backend response:', data);

 
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
