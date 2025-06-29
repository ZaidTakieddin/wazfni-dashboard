import axiosInstance from '../axios';

import type {
  Category,
  Subcategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateSubcategoryRequest,
  UpdateSubcategoryRequest,
} from '../../types/category';

// ----------------------------------------------------------------------

export class CategoryService {
  // ===== CATEGORY OPERATIONS =====

  /**
   * Get all categories
   */
  static async getCategories(): Promise<Category[]> {
    try {
      const response = await axiosInstance.get<Category[]>('/categories');
      return response.data;
    } catch (error) {
      console.error('CategoryService.getCategories error:', error);
      throw error;
    }
  }

  /**
   * Get single category by ID
   */
  static async getCategory(categoryId: string): Promise<Category> {
    try {
      const response = await axiosInstance.get<Category>(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('CategoryService.getCategory error:', error);
      throw error;
    }
  }

  /**
   * Create new category (Admin only)
   */
  static async createCategory(data: CreateCategoryRequest): Promise<Category> {
    try {
      const response = await axiosInstance.post<Category>('/categories', data);
      return response.data;
    } catch (error) {
      console.error('CategoryService.createCategory error:', error);
      throw error;
    }
  }

  /**
   * Update category (Admin only)
   */
  static async updateCategory(categoryId: string, data: UpdateCategoryRequest): Promise<Category> {
    try {
      const response = await axiosInstance.patch<Category>(`/categories/${categoryId}`, data);
      return response.data;
    } catch (error) {
      console.error('CategoryService.updateCategory error:', error);
      throw error;
    }
  }

  /**
   * Delete category (Admin only)
   */
  static async deleteCategory(categoryId: string): Promise<void> {
    try {
      await axiosInstance.delete(`/categories/${categoryId}`);
    } catch (error) {
      console.error('CategoryService.deleteCategory error:', error);
      throw error;
    }
  }

  // ===== SUBCATEGORY OPERATIONS =====

  /**
   * Get subcategories by category ID
   */
  static async getSubcategoriesByCategory(categoryId: string): Promise<Subcategory[]> {
    try {
      const response = await axiosInstance.get<Subcategory[]>(
        `/categories/${categoryId}/subcategories`
      );
      return response.data;
    } catch (error) {
      console.error('CategoryService.getSubcategoriesByCategory error:', error);
      throw error;
    }
  }

  /**
   * Get single subcategory by ID
   */
  static async getSubcategory(subcategoryId: string): Promise<Subcategory> {
    try {
      const response = await axiosInstance.get<Subcategory>(
        `/categories/subcategories/${subcategoryId}`
      );
      return response.data;
    } catch (error) {
      console.error('CategoryService.getSubcategory error:', error);
      throw error;
    }
  }

  /**
   * Create new subcategory (Admin only)
   */
  static async createSubcategory(
    categoryId: string,
    data: CreateSubcategoryRequest
  ): Promise<Subcategory> {
    try {
      const response = await axiosInstance.post<Subcategory>(
        `/categories/${categoryId}/subcategories`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('CategoryService.createSubcategory error:', error);
      throw error;
    }
  }

  /**
   * Update subcategory (Admin only)
   */
  static async updateSubcategory(
    subcategoryId: string,
    data: UpdateSubcategoryRequest
  ): Promise<Subcategory> {
    try {
      const response = await axiosInstance.patch<Subcategory>(
        `/categories/subcategories/${subcategoryId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('CategoryService.updateSubcategory error:', error);
      throw error;
    }
  }

  /**
   * Delete subcategory (Admin only)
   */
  static async deleteSubcategory(subcategoryId: string): Promise<void> {
    try {
      await axiosInstance.delete(`/categories/subcategories/${subcategoryId}`);
    } catch (error) {
      console.error('CategoryService.deleteSubcategory error:', error);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====

  /**
   * Get all categories with their subcategories
   */
  static async getCategoriesWithSubcategories(): Promise<Category[]> {
    try {
      const categories = await this.getCategories();

      // Fetch subcategories for each category
      const categoriesWithSubs = await Promise.all(
        categories.map(async (category) => {
          try {
            const subcategories = await this.getSubcategoriesByCategory(category.id);
            return { ...category, subcategories };
          } catch (error) {
            console.warn(`Failed to fetch subcategories for category ${category.id}:`, error);
            return category;
          }
        })
      );

      return categoriesWithSubs;
    } catch (error) {
      console.error('CategoryService.getCategoriesWithSubcategories error:', error);
      throw error;
    }
  }
}
