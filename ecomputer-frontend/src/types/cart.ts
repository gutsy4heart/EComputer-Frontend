 
import { CartItem } from './cartItem';
 
export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalSum: number;
}
 
export interface ClearCartRequest {
  id: number;
}
