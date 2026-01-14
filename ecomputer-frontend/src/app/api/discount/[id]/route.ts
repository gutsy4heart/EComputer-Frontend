import { NextRequest, NextResponse } from 'next/server';
import { apiService } from '../../../../../services/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await apiService.get(`/discount/${params.id}`);
    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] Error fetching discount:', error);
    return NextResponse.json(
      { isSuccess: false, error: 'Failed to fetch discount' },
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
    console.log('[API] Updating discount with data:', body);
    
    const response = await apiService.put(`/discount/${params.id}`, body);
    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] Error updating discount:', error);
    return NextResponse.json(
      { isSuccess: false, error: 'Failed to update discount' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await apiService.delete(`/discount/${params.id}`);
    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] Error deleting discount:', error);
    return NextResponse.json(
      { isSuccess: false, error: 'Failed to delete discount' },
      { status: 500 }
    );
  }
}
