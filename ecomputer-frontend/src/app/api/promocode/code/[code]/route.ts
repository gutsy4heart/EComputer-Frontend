import { NextRequest, NextResponse } from 'next/server';
import { apiService } from '../../../../../services/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const response = await apiService.get(`/promocode/code/${params.code}`);
    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] Error fetching promocode by code:', error);
    return NextResponse.json(
      { isSuccess: false, error: 'Failed to fetch promocode by code' },
      { status: 500 }
    );
  }
}
