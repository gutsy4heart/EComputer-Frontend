import { Product } from './product';

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  totalSum: number;
  stock: number;
  imageUrl?: string;
  maxAvailable?: number;
  available?: number;
}

export interface CartItemWithProduct {
  id: number;
  quantity: number;
  product: Product;
}

export interface AddCartItemRequest {
  cartId: number;
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  id: number;
  quantity: number;
}

export interface RemoveCartItemRequest {
  cartItemId: number;
}
