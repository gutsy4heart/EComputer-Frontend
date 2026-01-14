import { NextResponse } from 'next/server';

 
const BACKEND_URL = 'http://localhost:5000';

export async function POST(request: Request) {
  try {
    console.log('[API] Register endpoint called - forwarding to backend');
     
    const body = await request.json();
 
    console.log('[API] Register request body:', { 
      ...body, 
      password: body.password ? '***' : 'missing'
    });
 
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        { error: 'Email, password, and username are required' },
        { status: 400 }
      );
    }
    
 
    const backendBody = {
      ...body,
      name: body.name 
    };

 
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
 
    const response = await fetch(`${BACKEND_URL}/api/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendBody),
    });
 
    if (!response.ok) {
      const errorData = await response.json();
      console.error('[API] Backend error:', errorData);
      return NextResponse.json(errorData, { status: response.status });
    }

 
    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error('[API] Error parsing backend response:', error);
      return NextResponse.json(
        { error: 'Failed to parse backend response' },
        { status: 500 }
      );
    }

    console.log('[API] Backend response:', data);

 
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
