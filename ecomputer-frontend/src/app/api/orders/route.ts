// // API route for orders
// import { NextRequest, NextResponse } from 'next/server';
// import { getUserFromRequest } from '../../../utils/auth';
// import { UserRole } from '../../../types';

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '../../../utils/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
  
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log(`[API] Getting orders for user ${user.id}`);

    // Попытка получить заказы из backend API
    try {
      const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:5000';
      const token = request.headers.get('authorization')?.replace('Bearer ', '') || '';
      
      const response = await fetch(`${backendUrl}/order/get-orderHistory?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        let orders = [];
        
        if (data.value && Array.isArray(data.value)) {
          orders = data.value;
        } else if (Array.isArray(data)) {
          orders = data;
        }

        console.log(`[API] Found ${orders.length} orders from backend`);
        console.log(`[API] Orders:`, orders);

        // Маппинг заказов согласно backend структуре
        const mappedOrders = orders.map((order: any) => {
          console.log(`[API] Mapping order:`, order);
          
          // Обрабатываем items согласно структуре OrderItemDto
          const mappedItems = (order.items || order.orderItems || []).map((item: any) => ({
            id: item.id,
            orderId: item.orderId,
            productId: item.productId,
            product: {
              id: item.productId,
              name: item.productName || item.product?.name || 'Неизвестный продукт',
              category: {
                id: 0,
                name: item.categoryName || item.product?.category?.name || 'Неизвестная категория'
              }
            },
            quantity: item.quantity,
            price: item.price
          }));

          // Обрабатываем user согласно структуре UserDto
          const mappedUser = order.user ? {
            id: order.user.id,
            name: order.user.name || 'Unknown',
            email: order.user.email || '',
            address: order.user.address || '',
            imageUrl: order.user.imageUrl
          } : null;

          return {
            id: order.id || order.orderId,
            userId: order.userId || order.user?.id,
            user: mappedUser,
            status: order.status || 'Pending',
            totalAmount: order.totalSum || order.totalPrice || order.totalAmount || 0,
            createdAt: order.createdDate || order.createdAt || new Date().toISOString(),
            updatedAt: order.updatedDate || order.updatedAt || new Date().toISOString(),
            shippingAddress: order.shippingAddress || 'Address not specified',
            items: mappedItems
          };
        });

        return NextResponse.json(mappedOrders);
      } else {
        console.error(`[API] Backend API error: ${response.status} ${response.statusText}`);
      }
    } catch (backendError) {
      console.error('[API] Backend API error:', backendError);
    }

    // Fallback: возвращаем статические данные
    console.log(`[API] Using fallback data`);
    const orders = [
      {
        id: 1,
        userId: user.id,
        status: 'Pending',
        totalAmount: 1299.99,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        shippingAddress: '123 Main St, City, Country',
        items: [
          {
            id: 1,
            orderId: 1,
            productId: 1,
            quantity: 1,
            price: 1299.99
          }
        ]
      },
      {
        id: 2,
        userId: user.id,
        status: 'Delivered',
        totalAmount: 499.99,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        shippingAddress: '456 Oak Ave, Town, Country',
        items: [
          {
            id: 2,
            orderId: 2,
            productId: 2,
            quantity: 1,
            price: 499.99
          }
        ]
      }
    ];
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('[API] Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

 
// export async function POST(request: NextRequest) {
//   try {
 
//     const user = await getUserFromRequest(request);
    
//     // Check if user is authenticated
//     if (!user) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }
    
 
//     const orderData = await request.json();
    
 
//     if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
//       return NextResponse.json(
//         { error: 'Order must contain at least one item' },
//         { status: 400 }
//       );
//     }
    
//     if (!orderData.shippingAddress) {
//       return NextResponse.json(
//         { error: 'Shipping address is required' },
//         { status: 400 }
//       );
//     }
   
//     const newOrder = {
//       id: Math.floor(Math.random() * 1000) + 1,
//       userId: user.id,
//       status: 'Pending',
//       totalAmount: orderData.items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0),
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       shippingAddress: orderData.shippingAddress,
//       items: orderData.items.map((item: any, index: number) => ({
//         id: index + 1,
//         orderId: 1,  
//         productId: item.productId,
//         quantity: item.quantity,
//         price: item.price
//       }))
//     };
    
//     return NextResponse.json(newOrder, { status: 201 });
//   } catch (error) {
//     console.error('Error creating order:', error);
//     return NextResponse.json(
//       { error: 'Failed to create order' },
//       { status: 500 }
//     );
//   }
// }
