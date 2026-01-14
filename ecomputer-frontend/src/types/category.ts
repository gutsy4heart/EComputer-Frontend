 
export interface Category {
  id: number;
  name: string;
  products?: Array<any>;
}

 
export interface AddCategoryRequest {
  id?: number;
  name: string;
}

 
export interface UpdateCategoryRequest {
  name: string;
}

 
export interface DeleteCategoryRequest {
  id: number;
}
