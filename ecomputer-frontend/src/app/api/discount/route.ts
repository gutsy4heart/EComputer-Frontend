import { NextRequest, NextResponse } from 'next/server';
import { apiService } from '../../../../services/api';

export async function GET(request: NextRequest) {
  try {
    const response = await apiService.get('/discount/');
    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] Error fetching discounts:', error);
    return NextResponse.json(
      { isSuccess: false, error: 'Failed to fetch discounts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[API] Creating discount with data:', body);
    console.log('[API] Data types:', {
      name: typeof body.name,
      percentage: typeof body.percentage,
      startDate: typeof body.startDate,
      endDate: typeof body.endDate,
      productIds: Array.isArray(body.productIds) ? body.productIds.length : 'not array'
    });
    
    const response = await apiService.post('/discount/', body);
    console.log('[API] Backend response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] Error creating discount:', error);
    return NextResponse.json(
      { isSuccess: false, error: 'Failed to create discount' },
      { status: 500 }
    );
  }
}
