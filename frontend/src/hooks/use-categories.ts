import { useQuery } from '@tanstack/react-query';

import { categoryApi } from '@/lib/api';
import { CATEGORIES } from '@/lib/constants';

/**
 * Hook for fetching categories from API
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        console.log('🔄 Fetching categories from API');
        const result = await categoryApi.getAll();
        console.log('✅ Categories fetched successfully:', result?.length || 0, 'categories');
        return result;
      } catch (error) {
        console.error('❌ Error fetching categories:', error);
        // Return local categories as fallback when API is not available
        return Object.values(CATEGORIES);
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

/**
 * Hook that provides categories with fallback to local constants
 */
export function useCategoriesWithFallback() {
  const { data: apiCategories, isLoading, error } = useCategories();
  
  // Use API data if available, otherwise fall back to local constants
  const categories = apiCategories || Object.values(CATEGORIES);
  
  return {
    categories,
    isLoading,
    error,
    isFromAPI: !!apiCategories,
  };
}

/**
 * Hook for getting a specific category by ID
 */
export function useCategory(categoryId: string) {
  const { categories } = useCategoriesWithFallback();
  
  const category = categories.find(cat => cat.id === categoryId);
  
  return {
    category,
    subcategories: category?.subcategories || {},
  };
}

/**
 * Hook for getting category options for forms
 */
export function useCategoryOptions() {
  const { categories, isLoading } = useCategoriesWithFallback();
  
  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name,
    icon: category.icon,
  }));
  
  const getSubcategoryOptions = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return [];
    
    return Object.entries(category.subcategories).map(([key, icon]) => ({
      value: key,
      label: key.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      icon,
    }));
  };
  
  return {
    categoryOptions,
    getSubcategoryOptions,
    isLoading,
  };
}