import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5000';

export async function GET(request: Request) {
  try {
    console.log('[API] Get all carts endpoint called - forwarding to backend');
    
  
    // Get the authorization token from the request headers
    const authHeader = request.headers.get('Authorization');
    
    const response = await fetch(`${BACKEND_URL}/api/cart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '',
      },
    });
    
  
    const data = await response.json();
    
    console.log('[API] Cart response from backend:', data);
    console.log('[API] Cart response status:', response.status);
    
    // Добавляем подробное логирование структуры данных
    if (data && data.value) {
      console.log('[API] Cart data structure:', {
        hasValue: !!data.value,
        valueType: typeof data.value,
        hasNestedValue: !!data.value.value,
        nestedValueType: typeof data.value.value,
        hasItems: !!data.value.items,
        hasCartItemsDto: !!data.value.cartItemsDto,
        itemsCount: data.value.items?.length || data.value.cartItemsDto?.length || 0
      });
      
      if (data.value.cartItemsDto) {
        console.log('[API] Cart items details:', data.value.cartItemsDto.map((item: any) => ({
          id: item.id || item.Id,
          quantity: item.quantity || item.Quantity,
          product: item.product || item.Product ? {
            id: (item.product || item.Product)?.id || (item.product || item.Product)?.Id,
            name: (item.product || item.Product)?.name || (item.product || item.Product)?.Name,
            price: (item.product || item.Product)?.price || (item.product || item.Product)?.Price,
            priceType: typeof ((item.product || item.Product)?.price || (item.product || item.Product)?.Price),
            quantity: (item.product || item.Product)?.quantity || (item.product || item.Product)?.Quantity,
            imageUrl: (item.product || item.Product)?.imageUrl || (item.product || item.Product)?.ImageUrl
          } : null
        })));
      }
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Get all carts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('[API] Create cart endpoint called - forwarding to backend');
    
    const url = new URL(request.url);
    const queryParams = url.search; 
    
    const body = await request.json();
    
  
    // Get the authorization token from the request headers
    const authHeader = request.headers.get('Authorization');
    
    const response = await fetch(`${BACKEND_URL}/api/cart${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '',
      },
      body: JSON.stringify(body),
    });
    
  
    const data = await response.json();
    
  
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Create cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
