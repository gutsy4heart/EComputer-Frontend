import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    console.log('[API] Health check called');
    
    const backendResponse = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
    });

    console.log('[API] Backend health response status:', backendResponse.status);

    if (backendResponse.ok) {
      const data = await backendResponse.json();
      return NextResponse.json({ 
        status: 'ok', 
        backend: 'connected',
        data 
      });
    } else {
      return NextResponse.json({ 
        status: 'error', 
        backend: 'unavailable',
        error: `Backend returned ${backendResponse.status}`
      }, { status: 503 });
    }
  } catch (error) {
    console.error('[API] Health check error:', error);
    return NextResponse.json({ 
      status: 'error', 
      backend: 'unreachable',
      error: 'Backend is not reachable'
    }, { status: 503 });
  }
} 