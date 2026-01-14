# API Client Summary

## Overview

This TypeScript API client provides a type-safe interface to interact with the ASP.NET backend API endpoints. It follows the Carter and MediatR pattern used in the backend, mapping each endpoint to a corresponding client method.

## API Endpoints by Module

### Product Module
| Method | Endpoint | Client Method | Access |
|--------|----------|--------------|--------|
| GET | /api/product/{id}/ | `getProduct(id)` | Admin, User |
| GET | /api/product/ | `getProducts(params)` | Admin, User |
| POST | /api/product/ | `addProduct(product)` | Admin only |
| DELETE | /api/product/ | `deleteProduct(id)` | Admin only |
| PUT | /api/product/ | `updateProduct(product)` | Admin only |
| GET | /api/product/all/ | `getAllProducts()` | Admin, User |
| POST | /api/product/upload-image | `uploadProductImage(request)` | Admin only |

### Category Module
| Method | Endpoint | Client Method | Access |
|--------|----------|--------------|--------|
| GET | /api/category/{id} | `getCategory(id)` | Admin, User |
| GET | /api/category/ | `getCategories()` | Admin, User |
| POST | /api/category/ | `addCategory(category)` | Admin only |
| DELETE | /api/category/ | `deleteCategory(id)` | Admin only |

### CartItem Module
| Method | Endpoint | Client Method | Access |
|--------|----------|--------------|--------|
| POST | /api/cart-item/ | `addCartItem(item)` | Admin, User |
| PUT | /api/cart-item/ | `updateCartItem(item)` | Admin, User |
| DELETE | /api/cart-item/{id} | `removeCartItem(id)` | Admin, User |
| GET | /api/cart-item/{id} | `getCartItem(id)` | Admin, User |

### Cart Module
| Method | Endpoint | Client Method | Access |
|--------|----------|--------------|--------|
| GET | /api/cart/ | `getCart()` | Admin, User |
| POST | /api/cart/ | `clearCart()` | Admin, User |

### Favorite Module
| Method | Endpoint | Client Method | Access |
|--------|----------|--------------|--------|
| GET | /api/favorite/ | `getFavorites()` | Admin, User |
| POST | /api/favorite/ | `addFavorite(request)` | Admin, User |
| DELETE | /api/favorite/{productId} | `removeFavorite(productId)` | Admin, User |

### OrderItem Module
| Method | Endpoint | Client Method | Access |
|--------|----------|--------------|--------|
| GET | /api/orderitem/ | `getOrderItems()` | Admin, User |
| POST | /api/orderitem/ | `createOrderItems(items)` | Admin, User |

### Order Module
| Method | Endpoint | Client Method | Access |
|--------|----------|--------------|--------|
| PUT | /api/order/order-status/{id} | `updateOrderStatus(id, status)` | Admin only |
| GET | /api/order/get-orderHistory/ | `getOrderHistory(userId)` | Admin only |
| GET | /api/order/get-top-products/ | `getTopProducts(limit)` | Admin, User |
| GET | /api/order/get-order-statistics/ | `getOrderStatistics(startDate, endDate)` | Admin only |

### ProductReviews Module
| Method | Endpoint | Client Method | Access |
|--------|----------|--------------|--------|
| GET | /api/productreviews/{productId} | `getProductReviews(productId)` | Admin, User |
| POST | /api/productreviews/ | `addProductReview(review)` | Admin, User |
| PUT | /api/productreviews/ | `updateProductReview(review)` | Admin, User |
| DELETE | /api/productreviews/{id} | `deleteProductReview(id)` | Admin, User |
| GET | /api/productreviews/top-rated | `getTopRatedProducts()` | Admin |

### User Module
| Method | Endpoint | Client Method | Access |
|--------|----------|--------------|--------|
| POST | /api/user/upload-image | `uploadUserImage(request)` | Admin, User |

## Authentication

The API client handles authentication by:
1. Storing the JWT token in localStorage
2. Including the token in the Authorization header for all requests
3. Providing methods to set, get, and clear the token

## Response Handling

All API methods return a Promise with an `ApiResponse<T>` object that includes:
- `value`: The response data (if successful)
- `error`: Error message (if failed)
- `isSuccess`: Boolean indicating success
- `isFailure`: Boolean indicating failure

## Error Handling

The API client handles various error scenarios:
- Network errors
- Server errors (500 responses)
- API errors (400 responses with error messages)
- Authentication errors (401 responses)
- Authorization errors (403 responses)

## Type Safety

The API client provides type definitions for:
- Request parameters
- Response data
- Error responses

This ensures type safety throughout the application when interacting with the API.
