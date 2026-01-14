import { NextResponse } from 'next/server';

 
const BACKEND_URL = 'http://localhost:5000';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log('[API] Get product by ID endpoint called for ID:', id, '- forwarding to backend');
    
 
    const response = await fetch(`${BACKEND_URL}/api/product/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
 
    const responseData = await response.json();
    
 
    console.log('[API] Product data from backend:', JSON.stringify(responseData, null, 2));
    
 
    let productData = responseData;
    
 
    if (responseData && responseData.value) {
      console.log('[API] Using value property from response');
       
      if (Array.isArray(responseData.value)) {
        console.log('[API] Value is an array, using first item');
        productData = responseData.value[0];  
      } else {
        productData = responseData.value;  
      }
    }
    
 
    if (productData && productData.quantity !== undefined) {
      productData.count = productData.quantity;
      console.log('[API] Added count field to product:', productData.count);
    }
    
   
    if (productData && productData.categoryId && (!productData.category || !productData.category.id)) {
      console.log(`[API] Product ${productData.id} has categoryId ${productData.categoryId} but no category object, creating one`);
      productData.category = {
        id: productData.categoryId,
        name: `Category ${productData.categoryId}`
      };
    }
    
   
    if (productData && productData.isInStock === undefined) {
      console.log(`[API] Product ${productData.id} has no isInStock property, setting default`);
      productData.isInStock = productData.quantity > 0;
    }
    
  
    if (productData && (productData.price === undefined || productData.price === null)) {
      console.log(`[API] Product ${productData.id} has no price property, setting default`);
      productData.price = 0;
    }
    
  
    return NextResponse.json(productData, { status: response.status });
  } catch (error) {
    console.error('[API] Get product by ID error:', error);
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
    const id = params.id;
    
    console.log('[API] Update product endpoint called for ID:', id);
    
    // Check content type to determine how to handle the request
    const contentType = request.headers.get('content-type') || '';
    let body;
    
    if (contentType.includes('multipart/form-data')) {
      // Handle multipart/form-data (with image)
      console.log('[API] Handling multipart/form-data request');
      
      // Forward the entire request to the backend
      const token = request.headers.get('authorization');
      const response = await fetch(`${BACKEND_URL}/api/product/${id}`, {
        method: 'PUT',
        headers: token ? { 'Authorization': token } : {},
        body: await request.arrayBuffer(),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[API] Backend returned error ${response.status}:`, errorText);
        return NextResponse.json(
          { error: errorText || 'Backend error' },
          { status: response.status }
        );
      }
      
      const responseData = await response.json();
      console.log('[API] Product updated successfully with image:', responseData);
      return NextResponse.json(responseData, { status: response.status });
    } else {
      // Handle JSON request (without image)
      body = await request.json();
      console.log('[API] Request body:', JSON.stringify(body, null, 2));
    
    if (body.categoryId !== undefined) {
      if (typeof body.categoryId === 'string') {
        body.categoryId = parseInt(body.categoryId, 10);
      }
 
      if (isNaN(body.categoryId) || body.categoryId <= 0) {
        console.warn('[API] Invalid categoryId provided:', body.categoryId);
        body.categoryId = 1;  
      }
      
      console.log('[API] Using categoryId:', body.categoryId, typeof body.categoryId);
    } else {
      console.warn('[API] No categoryId provided in update request, using default');
      body.categoryId = 1;  
    }
    
   
    if (body.categoryId !== undefined) {
 
      if (typeof body.categoryId === 'string') {
        body.categoryId = parseInt(body.categoryId, 10);
      }
      
       
      if (isNaN(body.categoryId) || body.categoryId <= 0) {
        console.warn('[API] Invalid categoryId in update request, using default (1)');
        body.categoryId = 1;
      }
    } else {
      
      console.warn('[API] No categoryId in update request, using default (1)');
      body.categoryId = 1;
    }
    
    console.log('[API] Sending update request to backend with body:', JSON.stringify(body, null, 2));
    
    // Get authorization token if present
    const token = request.headers.get('authorization');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }
    
    const response = await fetch(`${BACKEND_URL}/api/product/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Backend returned error ${response.status}:`, errorText);
      
    
      if (errorText.includes('Категория не найдена') || errorText.includes('Category not found')) {
        console.log('[API] Category not found error detected, retrying with default category');
        
     
        body.categoryId = 1;
        
      
        const retryResponse = await fetch(`${BACKEND_URL}/api/product/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': token } : {})
          },
          body: JSON.stringify(body),
        });
        
        if (retryResponse.ok) {
          console.log('[API] Retry with default category successful');
          const retryData = await retryResponse.json();
          return NextResponse.json(retryData, { status: retryResponse.status });
        } else {
          console.error('[API] Retry with default category failed');
        }
      }
      
      try {
 
        const errorData = JSON.parse(errorText);
        return NextResponse.json(errorData, { status: response.status });
      } catch (e) {
   
        return NextResponse.json(
          { error: errorText || 'Backend error' },
          { status: response.status }
        );
      }
    }
    
 
    const responseData = await response.json();
    console.log('[API] Product updated successfully:', responseData);
    
 
    let productData = responseData;
    
 
    if (responseData && responseData.value) {
      console.log('[API] Using value property from response');
       
      if (Array.isArray(responseData.value)) {
        console.log('[API] Value is an array, using first item');
        productData = responseData.value[0];  
      } else {
        productData = responseData.value;  
      }
    }
    
    
    if (productData && productData.categoryId && (!productData.category || !productData.category.id)) {
      console.log(`[API] Updated product ${productData.id} has categoryId ${productData.categoryId} but no category object, creating one`);
      productData.category = {
        id: productData.categoryId,
        name: `Category ${productData.categoryId}`
      };
    }
     
    if (productData && productData.quantity !== undefined) {
      productData.count = productData.quantity;
      console.log('[API] Added count field to updated product:', productData.count);
    }
    
    
    if (productData && productData.isInStock === undefined) {
      console.log(`[API] Product ${productData.id} has no isInStock property, setting default`);
      productData.isInStock = productData.quantity > 0;
    }
    
     
    if (productData && (productData.price === undefined || productData.price === null)) {
      console.log(`[API] Product ${productData.id} has no price property, setting default`);
      productData.price = 0;
    }
    
    
    return NextResponse.json(productData, { status: response.status });
    }
  } catch (error) {
    console.error('[API] Update product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log('[API] Delete product endpoint called for ID:', id, '- forwarding to backend');
    
 
    const response = await fetch(`${BACKEND_URL}/api/product/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
 
    const responseData = await response.json();
    
     
    let productData = responseData;
    
   
    if (responseData && responseData.value) {
      console.log('[API] Using value property from response');
      
       
      if (Array.isArray(responseData.value)) {
        console.log('[API] Value is an array, using first item');
        productData = responseData.value[0];  
      } else {
        productData = responseData.value; 
      }
    }
    
 
    return NextResponse.json(productData, { status: response.status });
  } catch (error) {
    console.error('[API] Delete product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
