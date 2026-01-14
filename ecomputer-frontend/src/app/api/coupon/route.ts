import { NextRequest, NextResponse } from 'next/server';
import { apiService } from '../../../../services/api';

export async function GET(request: NextRequest) {
  try {
    const response = await apiService.get('/coupon/');
    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] Error fetching coupons:', error);
    return NextResponse.json(
      { isSuccess: false, error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[API] Creating coupon with data:', body);
    
    const response = await apiService.post('/coupon/', body);
    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] Error creating coupon:', error);
    return NextResponse.json(
      { isSuccess: false, error: 'Failed to create coupon' },
      { status: 500 }
    );
  }
}
