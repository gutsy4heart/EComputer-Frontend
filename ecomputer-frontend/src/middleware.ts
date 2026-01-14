import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

 
const protectedRoutes: Record<string, string[]> = {
 
  '/admin': ['Admin'],
  '/profile': ['User', 'Admin'],
  '/orders': ['User', 'Admin'],
  // '/checkout': ['User', 'Admin'],  
};

 
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type RolePermissions = Record<HttpMethod, string[]>;
type ApiRoutePermissions = Record<string, RolePermissions>;

 
const protectedApiRoutes: ApiRoutePermissions = {
 
  '/api/category': {
    POST: ['Admin'],
    PUT: ['Admin'],
    DELETE: ['Admin'],
    GET: ['Admin', 'User'],
    PATCH: ['Admin'],
  },
 
  '/api/product': {
    POST: ['Admin'],
    PUT: ['Admin'],
    DELETE: ['Admin'],
    GET: ['Admin', 'User'],
    PATCH: ['Admin'],
  },
 
  '/api/cart': {
    GET: ['Admin', 'User'],
    POST: ['Admin', 'User'],
    PUT: ['Admin', 'User'],
    DELETE: ['Admin', 'User'],
    PATCH: ['Admin', 'User'],
  },
  '/api/cart-item': {
    GET: ['Admin', 'User'],
    POST: ['Admin', 'User'],
    PUT: ['Admin', 'User'],
    DELETE: ['Admin', 'User'],
    PATCH: ['Admin', 'User'],
  },
 
  '/api/orders': {
    GET: ['Admin', 'User'],
    POST: ['Admin', 'User'],
    PUT: ['Admin'],
    DELETE: ['Admin'],
    PATCH: ['Admin'],
  },
};
 
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
 
  const accessToken = request.cookies.get('accessToken')?.value;
  
 
  const isProtectedRoute = Object.keys(protectedRoutes).some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
 
  const isAuthRoute = authRoutes.some(route => pathname === route);
  
 
  const matchingApiRoute = Object.keys(protectedApiRoutes).find(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
 
  if (matchingApiRoute && protectedApiRoutes[matchingApiRoute] && 
      protectedApiRoutes[matchingApiRoute][method as HttpMethod]) {
    console.log(`[Middleware] Checking API route access: ${pathname} (${method})`);
 
    if (!accessToken) {
      console.log('[Middleware] API access denied - No token');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
 
    const userRole = request.cookies.get('userRole')?.value;
    
 
    const requiredRoles = protectedApiRoutes[matchingApiRoute][method as HttpMethod];
    if (!userRole || !requiredRoles.includes(userRole)) {
      console.log(`[Middleware] API access denied - Role ${userRole} not allowed`);
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }
    
    console.log('[Middleware] API access granted');
  }
  
 
  if (isProtectedRoute) {
    console.log(`[Middleware] Checking protected route access: ${pathname}`);
    console.log(`[Middleware] Access token present: ${!!accessToken}`);
    
    
    if (!accessToken) {
      console.log('[Middleware] Protected route access denied - No token');
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    
  
    const userRole = request.cookies.get('userRole')?.value;
    console.log(`[Middleware] User role from cookie: ${userRole}`);
    
 
    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      console.log('[Middleware] Admin route detected');
      
 
      if (userRole !== 'Admin') {
        console.log(`[Middleware] Admin route access denied - Role ${userRole} not allowed`);
     
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      console.log('[Middleware] Admin route access granted');
      return NextResponse.next();
    }
    
 
    const routeKey = Object.keys(protectedRoutes).find(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    );
    
    if (routeKey) {
      const requiredRoles = protectedRoutes[routeKey];
      console.log(`[Middleware] Required roles for ${pathname}: ${requiredRoles.join(', ')}`);
      
 
      if (!userRole || !requiredRoles.includes(userRole)) {
        console.log(`[Middleware] Protected route access denied - Role ${userRole} not allowed`);
  
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      console.log('[Middleware] Protected route access granted');
    }
  }
  
 
  if (accessToken && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
 
  return NextResponse.next();
}

 
export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
    '/orders/:path*',
    // '/checkout/:path*', 
    '/login',
    '/register',
    '/api/category/:path*',
    '/api/category',
    '/api/product/:path*',
    '/api/product',
    '/api/cart/:path*',
    '/api/cart',
    '/api/cart-item/:path*',
    '/api/cart-item',
    '/api/orders/:path*',
    '/api/orders',
  ],
};
