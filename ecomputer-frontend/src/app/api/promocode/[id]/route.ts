import { NextRequest, NextResponse } from 'next/server';
import { apiService } from '../../../../../services/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await apiService.get(`/promocode/${params.id}`);
    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] Error fetching promocode:', error);
    return NextResponse.json(
      { isSuccess: false, error: 'Failed to fetch promocode' },
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
    console.log('[API] Updating promocode with data:', body);
    
    const response = await apiService.put(`/promocode/${params.id}`, body);
    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] Error updating promocode:', error);
    return NextResponse.json(
      { isSuccess: false, error: 'Failed to update promocode' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await apiService.delete(`/promocode/${params.id}`);
    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] Error deleting promocode:', error);
    return NextResponse.json(
      { isSuccess: false, error: 'Failed to delete promocode' },
      { status: 500 }
    );
  }
}
