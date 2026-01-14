import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, isAdmin } from '../../../utils/auth';
import { UserRole } from '../../../types';
 
const BACKEND_URL = 'http://localhost:5000';

export async function GET() {
  try {
    console.log('[API] Get categories endpoint called - forwarding to backend');
    
 
    const response = await fetch(`${BACKEND_URL}/api/category`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
 
    const data = await response.json();
 
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Get categories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

 
export async function POST(request: NextRequest) {
  try {
    console.log('[API] Create category endpoint called');
    
 
    const user = await getUserFromRequest(request);
    
    if (!user) {
      console.error('[API] Create category - Unauthorized');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (!isAdmin(user)) {
      console.error('[API] Create category - Forbidden, admin access required');
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }
    
    console.log('[API] Create category - Admin access verified, forwarding to backend');
    
  
    const body = await request.json();
    
 
    const accessToken = request.cookies.get('accessToken')?.value;
    
 
    const response = await fetch(`${BACKEND_URL}/api/category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
    
 
    const data = await response.json();
    
   
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Create category error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
