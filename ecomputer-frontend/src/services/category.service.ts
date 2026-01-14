import { Category, AddCategoryRequest, UpdateCategoryRequest, DeleteCategoryRequest } from '../types/category';

class CategoryService {
  private static instance: CategoryService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  }

  // Mock data for development/testing - пустой массив, только пользовательские категории
  private mockCategories: Category[] = [];

  public static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }
    return CategoryService.instance;
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      console.log('[CategoryService] Fetching all categories...');
      
      // Получаем токен из localStorage
      const token = localStorage.getItem('token');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Используем правильный эндпоинт /api/category/
      const response = await fetch(`${this.baseUrl}/category/`, {
        method: 'GET',
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[CategoryService] Categories response:', data);
        
        // Обрабатываем ответ в зависимости от структуры
        if (data.value && Array.isArray(data.value)) {
          return data.value;
        } else if (Array.isArray(data)) {
          return data;
        } else {
          console.warn('Unexpected response format, returning empty array');
          return [];
        }
      } else {
        console.warn('API not available, returning empty array');
        return [];
      }
    } catch (error) {
      console.warn('Error fetching categories from API, returning empty array:', error);
      return [];
    }
  }

  async getCategoryById(id: number): Promise<Category> {
    try {
      console.log(`[CategoryService] Fetching category by ID: ${id}`);
      
      const response = await fetch(`${this.baseUrl}/category/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`[CategoryService] Category response:`, data);
      
      // Обрабатываем ответ в зависимости от структуры
      if (data.value) {
        return data.value;
      } else {
        return data;
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }

  async createCategory(categoryData: AddCategoryRequest): Promise<Category> {
    try {
      console.log('[CategoryService] Creating category:', categoryData);
      
      // Получаем токен из localStorage
      const token = localStorage.getItem('token');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Используем правильный эндпоинт /api/category/
      const response = await fetch(`${this.baseUrl}/category/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[CategoryService] Create response:', data);
        
        // Обрабатываем ответ в зависимости от структуры
        if (data.value) {
          return data.value;
        } else {
          return data;
        }
      } else {
        // Mock creation for development
        console.warn('API not available, creating mock category');
        const newCategory: Category = {
          id: this.mockCategories.length > 0 ? Math.max(...this.mockCategories.map(c => c.id)) + 1 : 1,
          name: categoryData.name,
          products: []
        };
        this.mockCategories.push(newCategory);
        return newCategory;
      }
    } catch (error) {
      // Mock creation for development
      console.warn('Error creating category via API, creating mock category:', error);
      const newCategory: Category = {
        id: this.mockCategories.length > 0 ? Math.max(...this.mockCategories.map(c => c.id)) + 1 : 1,
        name: categoryData.name,
        products: []
      };
      this.mockCategories.push(newCategory);
      return newCategory;
    }
  }



  async deleteCategory(id: number): Promise<void> {
    try {
      console.log(`[CategoryService] Deleting category with ID: ${id}`);
      
      // Получаем токен из localStorage
      const token = localStorage.getItem('token');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Используем правильный эндпоинт /api/category/{id}
      const response = await fetch(`${this.baseUrl}/category/${id}`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        console.log('[CategoryService] Category deleted successfully');
        return;
      } else {
        // Mock deletion for development
        console.warn('API not available, deleting mock category');
        const categoryIndex = this.mockCategories.findIndex(c => c.id === id);
        if (categoryIndex !== -1) {
          this.mockCategories.splice(categoryIndex, 1);
          return;
        }
        throw new Error('Category not found');
      }
    } catch (error) {
      // Mock deletion for development
      console.warn('Error deleting category via API, deleting mock category:', error);
      const categoryIndex = this.mockCategories.findIndex(c => c.id === id);
      if (categoryIndex !== -1) {
        this.mockCategories.splice(categoryIndex, 1);
        return;
      }
      throw new Error('Category not found');
    }
  }

  async getCategoriesWithProducts(): Promise<Category[]> {
    try {
      console.log('[CategoryService] Fetching categories with products...');
      
      // Используем базовый эндпоинт, так как специального нет
      const response = await fetch(`${this.baseUrl}/category/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('[CategoryService] Categories with products response:', data);
      
      // Обрабатываем ответ в зависимости от структуры
      if (data.value && Array.isArray(data.value)) {
        return data.value;
      } else if (Array.isArray(data)) {
        return data;
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error fetching categories with products:', error);
      throw error;
    }
  }
}

export const categoryService = CategoryService.getInstance();
