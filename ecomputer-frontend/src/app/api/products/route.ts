import { NextResponse } from 'next/server';

 
const BACKEND_URL = 'http://localhost:5000';

export async function GET(request: Request) {
  try {
    console.log('[API] Get products endpoint called - forwarding to backend');
    
  
    const url = new URL(request.url);
    const queryParams = url.search; 
    
 
    const response = await fetch(`${BACKEND_URL}/api/product${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    
    const data = await response.json();
    
 
    if (data.value && Array.isArray(data.value)) {
    
      data.value = data.value.map((product: any) => {
         
        console.log('[API] Processing product:', JSON.stringify(product, null, 2));
        
     
        const enhancedProduct = {
          ...product,
          count: product.quantity
        };
        
    
        if (product.categoryId && (!product.category || !product.category.id)) {
          console.log(`[API] Product ${product.id} has categoryId ${product.categoryId} but no category object, creating one`);
          enhancedProduct.category = {
            id: product.categoryId,
            name: `Category ${product.categoryId}`
          };
        }
        
        return enhancedProduct;
      });
    } else if (data.items && Array.isArray(data.items)) {
      
      data.items = data.items.map((product: any) => {
         
        console.log('[API] Processing product (items format):', JSON.stringify(product, null, 2));
        
    
        const enhancedProduct = {
          ...product,
          count: product.quantity
        };
        
     
        if (product.categoryId && (!product.category || !product.category.id)) {
          console.log(`[API] Product ${product.id} has categoryId ${product.categoryId} but no category object, creating one`);
          enhancedProduct.category = {
            id: product.categoryId,
            name: `Category ${product.categoryId}`
          };
        }
        
        return enhancedProduct;
      });
    }
    
    console.log('[API] Modified products response with count field and ensured categories');
    
 
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('[API] Create product endpoint called - forwarding to backend');
    
   
    const body = await request.json();
    
    
    const response = await fetch(`${BACKEND_URL}/api/product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
     
    const data = await response.json();
    
     
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Create product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
