import { NextResponse } from 'next/server';
 
const BACKEND_URL = 'http://localhost:5000';

export async function POST(request: Request) {
  try {
    console.log('[API] Add cart item endpoint called - forwarding to backend');
    
 
    const body = await request.json();
    console.log('[API] Add cart item request body:', body);
    
 
    if (body.productId && body.quantity) {
      try {
       
        const productResponse = await fetch(`${BACKEND_URL}/api/product/${body.productId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (productResponse.ok) {
          const productData = await productResponse.json();
          console.log('[API] Product data from backend:', productData);
          
 
          if (productData.quantity < body.quantity) {
            console.warn('[API] Requested quantity exceeds available stock');
            return NextResponse.json(
              { error: 'Not enough stock available' },
              { status: 400 }
            );
          }
        }
      } catch (err) {
        console.error('[API] Error checking product stock:', err);
       
      }
    }
    
 
    // Get the authorization token from the request headers
    const authHeader = request.headers.get('Authorization');
    
    const response = await fetch(`${BACKEND_URL}/api/cart-item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '',
      },
      body: JSON.stringify(body),
    });
    
 
    const data = await response.json();
    console.log('[API] Backend response for add cart item:', data);
    console.log('[API] Backend response status:', response.status);
    
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Add cart item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    console.log('[API] Update cart item endpoint called - forwarding to backend');
    
 
    const body = await request.json();
    console.log('[API] Update cart item request body:', body);
    
 
    if (body.id && body.quantity) {
      try {
      
        const cartItemResponse = await fetch(`${BACKEND_URL}/api/cart-item/${body.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (cartItemResponse.ok) {
          const cartItemData = await cartItemResponse.json();
          console.log('[API] Cart item data from backend:', cartItemData);
          const productId = cartItemData.productId;
          
           
          const productResponse = await fetch(`${BACKEND_URL}/api/product/${productId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (productResponse.ok) {
            const productData = await productResponse.json();
            console.log('[API] Product data for update:', productData);
            
     
            if (productData.quantity < body.quantity) {
              console.warn('[API] Requested quantity exceeds available stock');
              return NextResponse.json(
                { error: 'Not enough stock available' },
                { status: 400 }
              );
            }
          }
        }
      } catch (err) {
        console.error('[API] Error checking product stock:', err);
 
      }
    }
 
    // Get the authorization token from the request headers
    const authHeader = request.headers.get('Authorization');
    
    const response = await fetch(`${BACKEND_URL}/api/cart-item`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '',
      },
      body: JSON.stringify(body),
    });
    
 
    const data = await response.json();
    console.log('[API] Backend response for update cart item:', data);
    console.log('[API] Backend response status for update:', response.status);
    
 
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Update cart item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    console.log('[API] Delete cart item endpoint called - forwarding to backend');
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Parameter 'id' is required" },
        { status: 400 }
      );
    }

    console.log('[API] Deleting cart item with ID:', id);
    
    // Get the authorization token from the request headers
    const authHeader = request.headers.get('Authorization');
    
    const backendResponse = await fetch(`${BACKEND_URL}/api/cart-item/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '',
      }
    });

    if (!backendResponse.ok) {
      const error = await backendResponse.text();
      console.error('[API] Delete cart item error from backend:', error);
      return NextResponse.json(
        { error: error || 'Backend request failed' },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log('[API] Cart item deleted successfully');
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('[API] Delete cart item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
