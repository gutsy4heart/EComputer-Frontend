// API route for specific order operations
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, canAccessResource } from '../../../../utils/auth';
import { UserRole, OrderStatus } from '../../../../types';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const orderId = parseInt(params.id);
    
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
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

    console.log(`[API] Getting order ${orderId} for user ${user.id} with role ${user.role}`);

    // Попытка получить заказ из backend API
    try {
      const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:5000';
      const token = request.headers.get('authorization')?.replace('Bearer ', '') || '';
      
      // Для админов: используем get-orderHistory (все заказы)
      if (user.role === UserRole.Admin) {
        console.log(`[API] Admin user - getting all orders from orderHistory`);
        
        const historyResponse = await fetch(`${backendUrl}/order/get-orderHistory`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (historyResponse.ok) {
          const data = await historyResponse.json();
          let orders = [];
          
          if (data.value && Array.isArray(data.value)) {
            orders = data.value;
          } else if (Array.isArray(data)) {
            orders = data;
          }

          console.log(`[API] Found ${orders.length} orders from orderHistory`);

          const order = orders.find((o: any) => o.id === orderId || o.orderId === orderId);
          
          if (order) {
            console.log(`[API] Found order in orderHistory:`, order);
            
                         const mappedOrder = {
               id: order.id || order.orderId,
               userId: order.userId || order.user?.id,
               user: order.user,
               status: order.status || OrderStatus.Pending,
               totalAmount: order.totalSum || order.totalPrice || order.totalAmount || 0,
               createdAt: order.CreatedDate || order.createdDate || order.createdAt || new Date().toISOString(),
               updatedAt: order.updatedDate || order.updatedAt || new Date().toISOString(),
               shippingAddress: order.shippingAddress || 'Address not specified',
               items: order.items || order.orderItems || []
             };
            
            return NextResponse.json(mappedOrder);
          } else {
            console.log(`[API] Order ${orderId} not found in orderHistory`);
          }
        } else {
          console.error(`[API] OrderHistory API error: ${historyResponse.status} ${historyResponse.statusText}`);
        }
             } else {
         // Для обычных пользователей: используем GetOrderById с проверкой прав доступа
         console.log(`[API] Regular user - using GetOrderById for order ${orderId}`);
         
         const orderResponse = await fetch(`${backendUrl}/order/${orderId}`, {
           headers: {
             'Authorization': `Bearer ${token}`,
             'Content-Type': 'application/json'
           }
         });

                                       if (orderResponse.ok) {
             const orderData = await orderResponse.json();
             console.log(`[API] Found order from GetOrderById:`, orderData);
             console.log(`[API] Order items structure:`, orderData.items);
             if (orderData.items && orderData.items.length > 0) {
               console.log(`[API] First item product structure:`, orderData.items[0].product);
               console.log(`[API] First item product category:`, orderData.items[0].product?.category);
             }
            
                         // Правильно маппим items для обычных пользователей
             const mappedItems = (orderData.items || []).map((item: any) => ({
               id: item.id,
               orderId: item.orderId,
               productId: item.productId,
               product: {
                 id: item.productId,
                 name: item.productName || 'Неизвестный продукт',
                 category: {
                   id: 0, // ID категории не передается в DTO
                   name: item.categoryName || 'Неизвестно'
                 },
                 categoryName: item.categoryName || 'Неизвестно'
               },
               quantity: item.quantity,
               price: item.price
             }));
            
                         console.log(`[API] Backend orderData.CreatedDate:`, orderData.CreatedDate);
             console.log(`[API] Backend orderData.createdDate:`, orderData.createdDate);
             console.log(`[API] Backend orderData.createdAt:`, orderData.createdAt);
             
             const mappedOrder = {
               id: orderData.id,
               userId: orderData.userId,
               user: orderData.user,
               status: orderData.status || OrderStatus.Pending,
               totalAmount: orderData.totalAmount || 0,
               createdAt: orderData.CreatedDate || orderData.createdDate || orderData.createdAt || new Date().toISOString(),
               updatedAt: orderData.updatedDate || orderData.updatedAt || new Date().toISOString(),
               shippingAddress: orderData.shippingAddress || 'Address not specified',
               items: mappedItems
             };
             
             console.log(`[API] Mapped order createdAt:`, mappedOrder.createdAt);
            
            return NextResponse.json(mappedOrder);
          } else {
            console.log(`[API] GetOrderById failed: ${orderResponse.status} ${orderResponse.statusText}`);
            const errorData = await orderResponse.json().catch(() => ({}));
            console.log(`[API] GetOrderById error data:`, errorData);
          }
       }
    } catch (backendError) {
      console.error('[API] Backend API error:', backendError);
    }

    // Fallback: возвращаем статические данные для демонстрации
    console.log(`[API] Using fallback data for order ${orderId}`);
    
    // Создаем разные fallback данные в зависимости от ID заказа
    let fallbackOrder;
    
         if (orderId === 1) {
       fallbackOrder = {
         id: orderId,
         userId: user.id,
         user: {
           id: user.id,
           name: user.name,
           email: user.email,
           address: user.address,
           imageUrl: user.imageUrl
         },
                 status: OrderStatus.Pending,
         totalAmount: 138.00,
         createdAt: new Date('2024-12-16').toISOString(),
         updatedAt: new Date('2024-12-16').toISOString(),
        shippingAddress: '123 Main St, City, Country',
        items: [
          {
            id: 1,
            orderId: orderId,
            productId: 1,
                         product: {
               id: 1,
               name: 'rertertre',
               category: { id: 0, name: 'noutbook' },
               categoryName: 'noutbook'
             },
            quantity: 6,
            price: 23.00
          }
        ]
      };
         } else if (orderId === 2) {
       fallbackOrder = {
         id: orderId,
         userId: user.id,
         user: {
           id: user.id,
           name: user.name,
           email: user.email,
           address: user.address,
           imageUrl: user.imageUrl
         },
                 status: OrderStatus.Delivered,
         totalAmount: 233.00,
         createdAt: new Date('2024-12-15').toISOString(),
         updatedAt: new Date('2024-12-15').toISOString(),
        shippingAddress: '456 Oak Ave, Town, Country',
        items: [
                     {
             id: 2,
             orderId: orderId,
             productId: 2,
             product: {
               id: 2,
               name: 'Wireless Mouse',
               category: { id: 0, name: 'Accessories' },
               categoryName: 'Accessories'
             },
             quantity: 1,
             price: 233.00
           }
        ]
      };
         } else if (orderId === 3) {
       fallbackOrder = {
         id: orderId,
         userId: user.id,
         user: {
           id: user.id,
           name: user.name,
           email: user.email,
           address: user.address,
           imageUrl: user.imageUrl
         },
                 status: OrderStatus.Processing,
         totalAmount: 4427.00,
         createdAt: new Date('2024-12-14').toISOString(),
         updatedAt: new Date('2024-12-14').toISOString(),
        shippingAddress: '123 Main St, City, Country',
        items: [
          {
            id: 3,
            orderId: orderId,
            productId: 3,
                         product: {
               id: 3,
               name: 'Gaming Monitor',
               category: { id: 0, name: 'Monitors' },
               categoryName: 'Monitors'
             },
            quantity: 1,
            price: 4427.00
          }
        ]
      };
    } else {
      // Общий fallback для других ID
      fallbackOrder = {
        id: orderId,
        userId: user.id,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          address: user.address,
          imageUrl: user.imageUrl
        },
        status: OrderStatus.Pending,
        totalAmount: 1399.97,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        shippingAddress: '123 Main St, City, Country',
        items: [
          {
            id: 1,
            orderId: orderId,
            productId: 1,
                         product: {
               id: 1,
               name: 'Gaming Laptop',
               category: { id: 0, name: 'Laptops' },
               categoryName: 'Laptops'
             },
            quantity: 1,
            price: 1299.99
          },
          {
            id: 2,
            orderId: orderId,
            productId: 2,
                         product: {
               id: 2,
               name: 'Wireless Mouse',
               category: { id: 0, name: 'Accessories' },
               categoryName: 'Accessories'
             },
            quantity: 2,
            price: 49.99
          }
        ]
      };
    }
    
    const order = fallbackOrder;
    
         // Для обычных пользователей проверяем права доступа к fallback данным
     if (user.role !== UserRole.Admin && order.userId !== user.id) {
       return NextResponse.json(
         { error: 'Forbidden - You do not have permission to access this order' },
         { status: 403 }
       );
     }
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('[API] Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const orderId = parseInt(params.id);
    
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
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

    const updateData = await request.json();
    
    const order = {
      id: orderId,
      userId: 1, 
      status: OrderStatus.Pending,
      totalAmount: 1299.99,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shippingAddress: '123 Main St, City, Country'
    };
    
    if (updateData.status && user.role !== UserRole.Admin) {
      return NextResponse.json(
        { error: 'Forbidden - Only admins can update order status' },
        { status: 403 }
      );
    }
    
    if (updateData.shippingAddress && !canAccessResource(user, order.userId)) {
      return NextResponse.json(
        { error: 'Forbidden - You do not have permission to update this order' },
        { status: 403 }
      );
    }
    
    const updatedOrder = {
      ...order,
      ...(updateData.status && { status: updateData.status }),
      ...(updateData.shippingAddress && { shippingAddress: updateData.shippingAddress }),
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const orderId = parseInt(params.id);
    
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
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
    
    if (user.role !== UserRole.Admin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
} 