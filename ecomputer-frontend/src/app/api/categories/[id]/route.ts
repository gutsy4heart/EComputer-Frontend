import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, isAdmin } from '../../../../utils/auth';
import { UserRole } from '../../../../types';
 
const BACKEND_URL = 'http://localhost:5000';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log('[API] Get category by ID endpoint called for ID:', id, '- forwarding to backend');
    
 
    const response = await fetch(`${BACKEND_URL}/api/category/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
 
    const data = await response.json();
    
     
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Get category by ID error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log('[API] Update category endpoint called for ID:', id);
     
    const user = await getUserFromRequest(request);
    
    if (!user) {
      console.error('[API] Update category - Unauthorized');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (!isAdmin(user)) {
      console.error('[API] Update category - Forbidden, admin access required');
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }
    
    console.log('[API] Update category - Admin access verified, forwarding to backend');
    
 
    const body = await request.json(); 
 
    const accessToken = request.cookies.get('accessToken')?.value;
       
    const response = await fetch(`${BACKEND_URL}/api/category/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
    
 
    const data = await response.json();
 
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Update category error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log('[API] Delete category endpoint called for ID:', id);
   
    const user = await getUserFromRequest(request);
    
    if (!user) {
      console.error('[API] Delete category - Unauthorized');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (!isAdmin(user)) {
      console.error('[API] Delete category - Forbidden, admin access required');
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }
    
    console.log('[API] Delete category - Admin access verified, forwarding to backend');
 
    const accessToken = request.cookies.get('accessToken')?.value;
     
    const response = await fetch(`${BACKEND_URL}/api/category/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
 
    const data = await response.json();
    
 
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Delete category error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
