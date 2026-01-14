import { NextRequest, NextResponse } from 'next/server';
import { apiService } from '../../../../../services/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await apiService.get(`/coupon/${params.id}`);
    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] Error fetching coupon:', error);
    return NextResponse.json(
      { isSuccess: false, error: 'Failed to fetch coupon' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    console.log('[API] Updating coupon with data:', body);
    
    const response = await apiService.put(`/coupon/${params.id}`, body);
    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] Error updating coupon:', error);
    return NextResponse.json(
      { isSuccess: false, error: 'Failed to update coupon' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await apiService.delete(`/coupon/${params.id}`);
    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] Error deleting coupon:', error);
    return NextResponse.json(
      { isSuccess: false, error: 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}
