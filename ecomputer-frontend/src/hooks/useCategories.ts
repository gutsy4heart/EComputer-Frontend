 
import { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../services';
import { Category, AddCategoryRequest, UpdateCategoryRequest } from '../types';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

 
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const categoriesList = await categoryService.getAllCategories();
      setCategories(categoriesList);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

 
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

 
  const getCategoryById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const category = await categoryService.getCategoryById(id);
      return category;
    } catch (err) {
      setError('Failed to load category');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
 
  const addCategory = useCallback(async (categoryData: AddCategoryRequest) => {
    try {
      setLoading(true);
      setError(null);
      const success = await categoryService.createCategory(categoryData);
      
      if (success) {
 
        await loadCategories();
        return true;
      } else {
        setError('Failed to add category');
        return false;
      }
    } catch (err) {
      setError('Failed to add category');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadCategories]);

 
  const updateCategory = useCallback(async (id: number, categoryData: UpdateCategoryRequest) => {
    try {
      setLoading(true);
      setError(null);
      // Вариант 1 — напрямую выполнить HTTP-запрос (если метода в categoryService нет)
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT', // или 'PATCH', в зависимости от API
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      const result = response.ok;   
      if (typeof result === 'boolean') {
        if (result) {
          await loadCategories();
          return true;
        } else {
          setError('Failed to update category');
          return false;
        }
      } else {
        // service returned void or non-boolean; assume success if no error was thrown
        await loadCategories();
        return true;
      }
    } catch (err) {
      setError('Failed to update category');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadCategories]);

 
  const deleteCategory = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await categoryService.deleteCategory(id);
      // If no exception was thrown, assume delete succeeded
      await loadCategories();
      return true;
    } catch (err) {
      setError('Failed to delete category');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadCategories]);

  return {
    categories,
    loading,
    error,
    loadCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};
