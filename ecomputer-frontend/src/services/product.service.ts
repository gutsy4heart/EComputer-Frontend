import { apiService } from './api';
import { 
  Product, 
  AddProductRequest, 
  UpdateProductRequest, 
  FilterProductsRequest, 
  FilterProductsResponse 
} from '../types';

interface UploadProductImageRequest {
  productId: number;
  file: File;
}

interface UploadProductImageResponse {
  imageUrl: string;
  success: boolean;
}

interface GetProductsParams {
  categoryId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  page?: number;
  pageSize?: number;
}

export class ProductService {
  private static instance: ProductService;

  private constructor() {}

 
  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

   public async getAllProducts(): Promise<Product[]> {
    try {
      console.log('[ProductService] Fetching all products...');
      
      // Используем fetch напрямую для правильного URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${apiUrl}/api/product/all/`, {
        method: 'GET',
        headers,
      });

      console.log('[ProductService] Response status:', response.status);
      
      if (!response.ok) {
        console.error(`[ProductService] Failed to fetch products: ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      console.log('[ProductService] All products response:', data);
      
      // Обрабатываем ответ в зависимости от структуры
      let products: Product[] = [];
      
      if (data.value && Array.isArray(data.value)) {
        products = data.value;
      } else if (Array.isArray(data)) {
        products = data;
      } else {
        console.warn('[ProductService] Unexpected response format:', data);
        return [];
      }
      
      // Process each product to ensure image field is properly set
      const processedProducts = products.map(product => {
        // Make sure image field is properly set
        if (!product.image && product.imageUrl) {
          product.image = product.imageUrl;
        }
        
        console.log(`[ProductService] Product ${product.id} (${product.name}):`, {
          price: product.price,
          quantity: product.quantity,
          categoryId: product.categoryId,
          categoryName: product.categoryName,
          image: product.image
        });
        return product;
      });
      
      console.log('[ProductService] Returning products:', processedProducts);
      return processedProducts;
    } catch (error) {
      console.error('[ProductService] Error fetching products:', error);
      return [];  
    }
  }

 
 public async getProductById(id: number): Promise<Product | null> {
  try {
    console.log(`[ProductService] Getting product by ID: ${id}`);

    // Предполагается, что apiService.get принимает параметры в поле params
    const response = await apiService.get<any>(`/product/${id}`, { params: { Id: id } });

    if (response.isSuccess && response.value) {
      console.log(`[ProductService] Raw response for product ${id}:`, JSON.stringify(response.value, null, 2));

      let productData: any = response.value;

      // Если данные вложены в response.value.value — используем их
      if (response.value.value && typeof response.value.value === 'object') {
        console.log(`[ProductService] Using nested value property for product ${id}`);
        productData = response.value.value;
      }

      const product: Product = {
        id: productData.id || 0,
        name: productData.name || 'Unknown Product',
        price: productData.price !== undefined ? productData.price : 0,
        description: productData.description || '',
        quantity: productData.quantity !== undefined ? productData.quantity : 0,
        isInStock: productData.isInStock !== undefined ? productData.isInStock : (productData.quantity > 0),
        createdDate: productData.createdDate || new Date().toISOString(),
        categoryId: productData.categoryId || 0,
        categoryName: productData.categoryName || 'No category',
        rating: productData.rating !== undefined ? productData.rating : 0,
        image: productData.image || productData.imageUrl || null,
      };

      console.log(`[ProductService] Processed product ${id}:`, product);
      return product;
    }

    console.warn(`[ProductService] Failed to get product by ID ${id}`);
    return null;

  } catch (error) {
    console.error(`[ProductService] Error getting product by ID ${id}:`, error);
    return null;
  }
}


 
  public async getFilteredProducts(filters: FilterProductsRequest): Promise<FilterProductsResponse | null> {
    try {
       
      const filtersToSend = { ...filters };
      
 
      if (filtersToSend.name === undefined) filtersToSend.name = '';
      if (filtersToSend.minPrice === undefined) filtersToSend.minPrice = 0;
      if (filtersToSend.maxPrice === undefined) filtersToSend.maxPrice = 1000000;
      if (filtersToSend.page === undefined) filtersToSend.page = 1;
      if (filtersToSend.pageSize === undefined) filtersToSend.pageSize = 12;
      if (filtersToSend.isInStock === undefined) filtersToSend.isInStock = false;
      
 
      if (filtersToSend.categoryId === undefined) {
        filtersToSend.categoryId = 0;  
      }
      
      console.log('[ProductService] Sending filters to backend:', filtersToSend);
      
      const response = await apiService.get<FilterProductsResponse>('/product', filtersToSend);
      console.log('[ProductService] Filtered products response:', response);
      
      if (response.isSuccess && response.value) {
     
        if (Array.isArray(response.value)) {
          console.log('[ProductService] Response value is an array, creating wrapper object');
          
          // Process each product to ensure image field is properly set
          const processedProducts = response.value.map(product => {
            if (!product.image && product.imageUrl) {
              product.image = product.imageUrl;
            }
            return product;
          });
           
          return {
            products: processedProducts,
            totalCount: processedProducts.length,
            totalPage: 1,
            value: {
              items: processedProducts,
              countItems: processedProducts.length,
              totalPages: 1,
              currentPage: 1,
              pageSize: processedProducts.length,
              hasPrevious: false,
              hasNext: false
            },
            isSuccess: true,
            isFailure: false
          };
        }
        
        // If response.value is not an array, it's likely the expected FilterProductsResponse object
        // We still need to process the items to ensure image field is set
        if (response.value.value && response.value.value.items) {
          response.value.value.items = response.value.value.items.map((product: any) => {
            if (!product.image && product.imageUrl) {
              product.image = product.imageUrl;
            }
            return product;
          });
        }
        
        return response.value;
      }
      
      console.warn('[ProductService] Failed to fetch products, returning null');
      return null;
    } catch (error) {
      console.error('[ProductService] Error fetching products:', error);
      return null;
    }
  }

 
  public async addProduct(productData: AddProductRequest): Promise<boolean> {
    try {
      // If there's an image file, we need to use FormData
      const imageFile = productData.imageFile;
      
      if (imageFile) {
        console.log('[ProductService] Adding product with image using FormData');
        
        // Create FormData and append all product data
        const formData = new FormData();
        formData.append('Name', productData.name);
        formData.append('Price', productData.price.toString());
        formData.append('Description', productData.description || '');
        formData.append('Quantity', productData.quantity.toString());
        formData.append('IsInStock', productData.isInStock.toString());
        formData.append('CategoryId', productData.categoryId.toString());
        formData.append('ImageFile', imageFile);
        
        // We need to use fetch directly since our apiService doesn't handle FormData well
        const token = apiService.getToken();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        const response = await fetch(`${apiUrl}/api/product`, {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: formData
        });
        
        if (!response.ok) {
          console.error('[ProductService] Failed to add product with image:', response.statusText);
          return false;
        }
        
        return true;
      } else {
        // No image, use regular JSON API
        console.log('[ProductService] Adding product without image using JSON');
        const productDataWithoutImage = { ...productData };
        delete productDataWithoutImage.imageFile;
        
        const response = await apiService.post<any>('/product', productDataWithoutImage);
        
        if (!response.isSuccess || !response.value) {
          console.error('[ProductService] Failed to add product:', response.error);
          return false;
        }
        
        return true;
      }
    } catch (error) {
      console.error('[ProductService] Error adding product:', error);
      return false;
    }
  }
  
  /**
   * Uploads a product image
   * @param request The upload request containing productId and file
   * @returns The response with image URL or null if failed
   */
  public async uploadProductImage(request: UploadProductImageRequest): Promise<UploadProductImageResponse | null> {
    try {
      console.log('[ProductService] Uploading product image for product ID:', request.productId);
      
      // Create FormData for multipart/form-data upload
      const formData = new FormData();
      formData.append('ProductId', request.productId.toString());
      formData.append('ImageFile', request.file);
      
      // We need to use a custom fetch here since our apiService doesn't support FormData
      const token = apiService.getToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/product/upload-image`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });
      
      if (!response.ok) {
        console.error('[ProductService] Failed to upload product image:', response.statusText);
        return null;
      }
      
      const data = await response.json();
      console.log('[ProductService] Image upload successful:', data);
      
      return {
        imageUrl: data.imageUrl,
        success: true
      };
    } catch (error) {
      console.error('[ProductService] Error uploading product image:', error);
      return null;
    }
  }

 





 
  public async deleteProduct(id: number): Promise<boolean> {
    try {
      console.log(`[ProductService] Deleting product with ID: ${id}`);
      
      // Используем fetch напрямую для правильного DELETE запроса
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/api/product/${id}`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ id }),
      });

      console.log(`[ProductService] Delete response status:`, response.status);
      
      if (!response.ok) {
        console.error(`[ProductService] Failed to delete product: ${response.statusText}`);
        const errorText = await response.text();
        console.error(`[ProductService] Error response:`, errorText);
        return false;
      }

      const data = await response.json();
      console.log(`[ProductService] Delete response:`, data);
      
      return true;
    } catch (error) {
      console.error(`[ProductService] Error deleting product:`, error);
      return false;
    }
  }

  public async createProduct(productData: AddProductRequest): Promise<Product | null> {
    try {
      console.log('[ProductService] Creating product:', productData);
      
      // Создаем FormData для отправки файла
      const formData = new FormData();
      formData.append('Name', productData.name);
      formData.append('Price', productData.price.toString());
      formData.append('Quantity', productData.quantity.toString());
      formData.append('IsInStock', productData.isInStock.toString());
      formData.append('CategoryId', productData.categoryId.toString());
      formData.append('Description', productData.description);
      
      if (productData.imageFile) {
        formData.append('ImageFile', productData.imageFile);
      }

      // Используем fetch напрямую для FormData
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      // НЕ указываем Content-Type, fetch поставит multipart/form-data с boundary

      const response = await fetch(`${apiUrl}/api/product/`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        console.error(`[ProductService] Failed to create product: ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      console.log('[ProductService] Create response:', data);
      
      // Обрабатываем ответ в зависимости от структуры
      if (data.value) {
        return data.value;
      } else {
        return data;
      }
    } catch (error) {
      console.error('[ProductService] Error creating product:', error);
      return null;
    }
  }

  public async updateProduct(productData: UpdateProductRequest): Promise<Product | null> {
    try {
      console.log('[ProductService] Updating product:', productData);
      
      // Создаем FormData для отправки файла
      const formData = new FormData();
      formData.append('Id', productData.id.toString());
      
      if (productData.name) {
        formData.append('Name', productData.name);
      }
      if (productData.price !== undefined) {
        formData.append('Price', productData.price.toString());
      }
      if (productData.quantity !== undefined) {
        formData.append('Quantity', productData.quantity.toString());
      }
      if (productData.isInStock !== undefined) {
        formData.append('IsInStock', productData.isInStock.toString());
      }
      if (productData.categoryId !== undefined) {
        formData.append('CategoryId', productData.categoryId.toString());
      }
      if (productData.description) {
        formData.append('Description', productData.description);
      }
      
      if (productData.imageFile) {
        formData.append('ImageFile', productData.imageFile);
      }

      // Используем fetch напрямую для FormData
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      // НЕ указываем Content-Type, fetch поставит multipart/form-data с boundary

      const response = await fetch(`${apiUrl}/api/product/${productData.id}`, {
        method: 'PUT',
        headers,
        body: formData,
      });

      if (!response.ok) {
        console.error(`[ProductService] Failed to update product: ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      console.log('[ProductService] Update response:', data);
      
      // Обрабатываем ответ в зависимости от структуры
      if (data.value) {
        return data.value;
      } else {
        return data;
      }
    } catch (error) {
      console.error('[ProductService] Error updating product:', error);
      return null;
    }
  }

  public async getProducts(params?: GetProductsParams): Promise<Product[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.categoryId) {
        queryParams.append('categoryId', params.categoryId.toString());
      }
      
      if (params?.search) {
        queryParams.append('search', params.search);
      }
      
      if (params?.minPrice) {
        queryParams.append('minPrice', params.minPrice.toString());
      }
      
      if (params?.maxPrice) {
        queryParams.append('maxPrice', params.maxPrice.toString());
      }
      
      if (params?.inStockOnly) {
        queryParams.append('inStockOnly', 'true');
      }
      
      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }
      
      if (params?.pageSize) {
        queryParams.append('pageSize', params.pageSize.toString());
      }

      const response = await apiService.get<Product[]>(`/products?${queryParams.toString()}`);
      
      if (response.isSuccess && response.value) {
        // Получаем информацию о рейтингах для каждого продукта
        const productsWithRatings = await Promise.all(
          response.value.map(async (product) => {
            try {
              const reviewsResponse = await apiService.get<any[]>(`/productreviews/${product.id}`);
              if (reviewsResponse.isSuccess && reviewsResponse.value) {
                const reviews = reviewsResponse.value;
                const averageRating = reviews.length > 0 
                  ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length 
                  : 0;
                
                return {
                  ...product,
                  averageRating,
                  totalReviews: reviews.length
                };
              }
            } catch (error) {
              console.error(`Error fetching reviews for product ${product.id}:`, error);
            }
            
            return {
              ...product,
              averageRating: 0,
              totalReviews: 0
            };
          })
        );
        
        return productsWithRatings;
      }
      
      console.error('[Product] Failed to get products:', response.error);
      return [];
    } catch (error) {
      console.error('[Product] Error fetching products:', error);
      return [];
    }
  }
}

 
export const productService = ProductService.getInstance();
