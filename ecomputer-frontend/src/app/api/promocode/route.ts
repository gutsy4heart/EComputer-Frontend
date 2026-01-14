import { NextRequest, NextResponse } from 'next/server';
import { apiService } from '../../../../services/api';

export async function GET(request: NextRequest) {
  try {
    const response = await apiService.get('/promocode/');
    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] Error fetching promocodes:', error);
    return NextResponse.json(
      { isSuccess: false, error: 'Failed to fetch promocodes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[API] Creating promocode with data:', body);
    
    const response = await apiService.post('/promocode/', body);
    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] Error creating promocode:', error);
    return NextResponse.json(
      { isSuccess: false, error: 'Failed to create promocode' },
      { status: 500 }
    );
  }
}
