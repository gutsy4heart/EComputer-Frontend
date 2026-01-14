 
export interface ApiResponse<T> {
  isSuccess: boolean;
  value?: T;
  error?: string;
}
 
export interface PaginationParams {
  page: number;
  pageSize: number;
}
 
export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}
 
export * from './user';
export * from './category';
export * from './product';
export * from './cartItem';
export * from './cart';
export * from './order';
