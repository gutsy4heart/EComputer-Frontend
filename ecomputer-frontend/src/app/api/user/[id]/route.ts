import { NextResponse } from 'next/server';
 
const BACKEND_URL = 'http://localhost:5000';

 
function looksLikeEmail(str: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

 
function correctUserData(data: any) {
  if (
    data &&
    typeof data === 'object' &&
    typeof data.name === 'string' &&
    typeof data.email === 'string'
  ) {
    const nameIsEmail = looksLikeEmail(data.name);
    const emailIsNotEmail = !looksLikeEmail(data.email);

    if (nameIsEmail && emailIsNotEmail) {
     
      return {
        ...data,
        name: data.email,
        email: data.name,
      };
    }
  }
  return data;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`[API] Get user by ID endpoint called for ID: ${params.id}`);

    const authHeader = request.headers.get('Authorization');
    console.log('[API] Authorization header:', authHeader);

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/user/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`[API] Backend error for user ID ${params.id}:`, errorData);
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    console.log(`[API] Backend response for user ID ${params.id}:`, data);

    const correctedData = correctUserData(data);

    return NextResponse.json(correctedData, { status: response.status });
  } catch (error) {
    console.error(`[API] Get user by ID error for ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`[API] Update user endpoint called for ID: ${params.id}`);

    const authHeader = request.headers.get('Authorization');
    console.log('[API] Authorization header:', authHeader);

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/user/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        `[API] Backend error for updating user ID ${params.id}:`,
        errorData
      );
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    console.log(`[API] Backend response for updating user ID ${params.id}:`, data);

    const correctedData = correctUserData(data);

    return NextResponse.json(correctedData, { status: response.status });
  } catch (error) {
    console.error(`[API] Update user error for ID ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
