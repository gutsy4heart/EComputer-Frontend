// API route for user orders
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, canAccessResource } from '../../../../../utils/auth';
import { UserRole, OrderStatus } from '../../../../../types';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Проверяем права доступа - пользователь может видеть только свои заказы
    if (!canAccessResource(user, userId)) {
      return NextResponse.json(
        { error: 'Forbidden - You do not have permission to access these orders' },
        { status: 403 }
      );
    }

    console.log(`[API] Getting orders for user ${userId}`);

    // Попытка получить заказы из backend API
    try {
      const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:5000';
      const token = request.headers.get('authorization')?.replace('Bearer ', '') || '';
      
      console.log(`[API] Calling backend: ${backendUrl}/order/get-user-orders/${userId}`);
      
      // Используем backend endpoint для получения заказов пользователя
      const userOrdersResponse = await fetch(`${backendUrl}/order/get-user-orders/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`[API] Backend response status: ${userOrdersResponse.status}`);

      if (userOrdersResponse.ok) {
        const data = await userOrdersResponse.json();
        console.log(`[API] Backend response data:`, data);
        
        // Backend возвращает OrderDto[] напрямую
        const orders = Array.isArray(data) ? data : [];
        console.log(`[API] Found ${orders.length} orders for user ${userId}`);
        console.log(`[API] Raw orders data:`, orders);

        // Маппим заказы в нужный формат согласно backend структуре
        const mappedOrders = orders.map((order: any) => {
          console.log(`[API] Mapping order:`, order);
          
          // Обрабатываем items согласно структуре OrderItemDto
          const mappedItems = (order.items || []).map((item: any) => ({
            id: item.id,
            orderId: item.orderId,
            productId: item.productId,
            product: {
              id: item.productId,
              name: item.productName || 'Неизвестный продукт',
              category: {
                id: 0,
                name: item.categoryName || 'Неизвестная категория'
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
            id: order.id,
            userId: order.userId,
            user: mappedUser,
            status: order.status || OrderStatus.Pending,
            totalAmount: order.totalAmount || 0,
            createdAt: order.createdDate || new Date().toISOString(),
            updatedAt: order.updatedDate || new Date().toISOString(),
            shippingAddress: order.shippingAddress || 'Address not specified',
            items: mappedItems
          };
        });
        
        console.log(`[API] Mapped orders:`, mappedOrders);
        
        return NextResponse.json(mappedOrders);
      } else {
        console.log(`[API] Backend API failed: ${userOrdersResponse.status} ${userOrdersResponse.statusText}`);
        const errorText = await userOrdersResponse.text();
        console.log(`[API] Backend error response:`, errorText);
      }
    } catch (backendError) {
      console.error('[API] Backend API error:', backendError);
    }

    // Fallback: возвращаем статические данные для демонстрации
    console.log(`[API] Using fallback data for user ${userId}`);
    
    const fallbackOrders = [
      {
        id: 1,
        userId: userId,
        user: {
          id: userId,
          name: user.name,
          email: user.email,
          address: user.address,
          imageUrl: user.imageUrl
        },
        status: OrderStatus.Pending,
        totalAmount: 5126.00,
        createdAt: new Date('2025-08-16').toISOString(),
        updatedAt: new Date('2025-08-16').toISOString(),
        shippingAddress: '123 Main St, City, Country',
        items: [
          {
            id: 1,
            orderId: 1,
            productId: 1,
            product: {
              id: 1,
              name: 'Gaming Laptop',
              category: { id: 1, name: 'Laptops' }
            },
            quantity: 2,
            price: 2563.00
          }
        ]
      },
      {
        id: 2,
        userId: userId,
        user: {
          id: userId,
          name: user.name,
          email: user.email,
          address: user.address,
          imageUrl: user.imageUrl
        },
        status: OrderStatus.Delivered,
        totalAmount: 233.00,
        createdAt: new Date('2025-08-15').toISOString(),
        updatedAt: new Date('2025-08-16').toISOString(),
        shippingAddress: '123 Main St, City, Country',
        items: [
          {
            id: 2,
            orderId: 2,
            productId: 2,
            product: {
              id: 2,
              name: 'Wireless Mouse',
              category: { id: 2, name: 'Accessories' }
            },
            quantity: 1,
            price: 233.00
          }
        ]
      }
    ];
    
    return NextResponse.json(fallbackOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user orders' },
      { status: 500 }
    );
  }
}
