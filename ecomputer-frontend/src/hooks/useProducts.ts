import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services';
import {
  Product,
  FilterProductsRequest,
  FilterProductsResponse,
  AddProductRequest,
  UpdateProductRequest
} from '../types';

export const useProducts = (initialFilters: FilterProductsRequest = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialFilters.page || 1);
  const [filters, setFilters] = useState<FilterProductsRequest>(initialFilters);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async (newFilters?: FilterProductsRequest) => {
    try {
      setLoading(true);
      setError(null);
      const filtersToUse = newFilters || filters;
      const response = await productService.getFilteredProducts(filtersToUse);

      if (response) {
        if (response.products) {
          setProducts(response.products);
          setTotalCount(response.totalCount || 0);
          setTotalPages(response.totalPage || 0);
        } else if (response.value && response.value.items) {
          setProducts(response.value.items);
          setTotalCount(response.value.countItems || 0);
          setTotalPages(response.value.totalPages || 0);
        } else if (Array.isArray(response.value)) {
          setProducts(response.value);
          setTotalCount(response.value.length || 0);
          setTotalPages(1);
        } else {
          setProducts([]);
          setTotalCount(0);
          setTotalPages(0);
        }

        setFilters(filtersToUse);
        if (filtersToUse.page) {
          setCurrentPage(filtersToUse.page);
        }
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError('Failed to load products');
      console.error('[useProducts] Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const getProductById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const product = await productService.getProductById(id);

      if (product) {
        if (product.price == null) product.price = 0;
        if (product.isInStock == null) product.isInStock = product.quantity > 0;
        if (product.categoryName == null) product.categoryName = 'Unknown';
        if (product.categoryId == null) product.categoryId = 0;
        // Make sure image field is properly set
        if (!product.image && (product as any).imageUrl) {
          product.image = (product as any).imageUrl;
        }
        console.log(`[useProducts] Product ${id} image:`, product.image);
      }

      return product;
    } catch (err) {
      setError('Failed to load product');
      console.error(`[useProducts] Error getting product by ID ${id}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = useCallback(async (productData: AddProductRequest) => {
    try {
      setLoading(true);
      setError(null);
      const success = await productService.addProduct(productData);

      if (success) {
        await loadProducts();
        return true;
      } else {
        setError('Failed to add product');
        return false;
      }
    } catch (err) {
      setError('Failed to add product');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadProducts]);

  const updateProduct = useCallback(
    async (id: number, productData: UpdateProductRequest) => {
      try {
        setLoading(true);
        setError(null);

        // Quantity и isInStock обработка
        if (productData.quantity !== undefined) {
          if (typeof productData.quantity === 'string') {
            productData.quantity = parseInt(productData.quantity, 10);
          }
          if (isNaN(productData.quantity) || productData.quantity < 0) {
            productData.quantity = 0;
          }

          productData.isInStock = productData.quantity > 0;
        }

        // Локальное обновление
        setProducts(prevProducts =>
          prevProducts.map(product =>
            product.id === id
              ? {
                  ...product,
                  ...productData,
                  categoryId:
                    productData.categoryId !== undefined
                      ? Number(productData.categoryId)
                      : product.categoryId,
                  categoryName:
                    productData.categoryName !== undefined
                      ? productData.categoryName
                      : product.categoryName,
                  // Preserve image if not being updated
                  image: productData.imageFile ? undefined : product.image
                }
              : product
          )
        );

        const success = await productService.updateProduct(productData);

        if (success) {
          await loadProducts(filters);
          return true;
        } else {
          setError('Failed to update product');
          await loadProducts(filters);
          return false;
        }
      } catch (err) {
        setError('Failed to update product');
        console.error('[useProducts] Error updating product:', err);
        await loadProducts(filters);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [filters, loadProducts]
  );

  const deleteProduct = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const success = await productService.deleteProduct(id);
      if (success) {
        await loadProducts();
        return true;
      } else {
        setError('Failed to delete product');
        return false;
      }
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadProducts]);

  const changePage = useCallback((page: number) => {
    loadProducts({ ...filters, page });
  }, [filters, loadProducts]);

  const updateFilters = useCallback((newFilters: FilterProductsRequest) => {
    loadProducts({ ...filters, ...newFilters, page: 1 });
  }, [filters, loadProducts]);

  return {
    products,
    totalCount,
    totalPages,
    currentPage,
    filters,
    loading,
    error,
    loadProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    changePage,
    updateFilters
  };
};
