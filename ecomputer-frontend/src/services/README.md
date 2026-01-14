# API Client for ASP.NET Backend

This TypeScript API client provides a type-safe interface to interact with the ASP.NET backend API endpoints. It handles authentication, request formatting, response parsing, and error handling.

## Features

- **Type-safe API calls**: All API methods are fully typed for better developer experience
- **Authentication handling**: Manages auth tokens automatically
- **Error handling**: Consistent error handling across all API calls
- **Role-based access control**: Supports admin and user roles
- **Comprehensive coverage**: Includes all backend endpoints

## API Endpoints Coverage

The client covers all backend API endpoints grouped by modules:

### Product Module
- Get product by ID
- Get filtered products
- Add a new product (Admin only)
- Delete a product (Admin only)
- Update a product (Admin only)
- Get all products
- Upload product image (Admin only)

### Category Module
- Get category by ID
- Get all categories
- Add a new category (Admin only)
- Delete category (Admin only)

### CartItem Module
- Add product to cart
- Update cart item quantity
- Remove cart item
- Get cart item

### Cart Module
- Get cart
- Clear cart

### Favorite Module
- Get favorites
- Add favorite
- Remove favorite

### OrderItem Module
- Get order items
- Create order items

### Order Module
- Update order status (Admin only)
- Get order history by user ID (Admin only)
- Get top purchased products
- Get order statistics (Admin only)

### ProductReviews Module
- Get reviews by product ID
- Add product review
- Update product review
- Delete product review
- Get top-rated products (Admin)

### User Module
- Upload user profile image

## Usage

Import the API client and use it in your components:

```typescript
import { apiClient } from '../services/api-client';

// Authentication
apiClient.setToken(token);

// Get all products
const response = await apiClient.getAllProducts();
if (response.isSuccess && response.value) {
  const products = response.value;
  // Use products...
}

// Add a product (Admin only)
const newProduct = await apiClient.addProduct({
  name: 'New Product',
  description: 'Product description',
  price: 99.99,
  categoryId: 1,
  quantity: 10,
  isInStock: true
});

// Upload a user profile image
const imageResponse = await apiClient.uploadUserImage({
  userId: 1,
  file: imageFile
});
```

## Response Handling

All API methods return a Promise with an `ApiResponse<T>` object:

```typescript
interface ApiResponse<T> {
  value: T | null;
  error: string | null;
  isSuccess: boolean;
  isFailure: boolean;
}
```

Example of handling responses:

```typescript
const response = await apiClient.getProducts({ categoryId: 1 });

if (response.isSuccess && response.value) {
  // Handle successful response
  const products = response.value;
  console.log(`Found ${products.length} products`);
} else {
  // Handle error
  console.error('Failed to get products:', response.error);
}
```

## Role-Based Access Control

Some API endpoints are restricted to admin users only. The client will automatically include the authentication token in requests, but the server will validate if the user has the appropriate role.

## Error Handling

The API client handles various error scenarios:

- Network errors
- Server errors (500 responses)
- API errors (400 responses with error messages)
- Authentication errors (401 responses)
- Authorization errors (403 responses)

All errors are normalized into the `ApiResponse` format for consistent handling.

## See Also

For detailed examples of how to use each API endpoint, see the [api-client-usage.tsx](../examples/api-client-usage.tsx) file.
