export type Category = {
  id: string;
  name: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
  subcategories?: Subcategory[];
};

export type Subcategory = {
  id: string;
  name: string;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
};

// API Request Types
export type CreateCategoryRequest = {
  name: string;
  icon?: string;
};

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>;

export type CreateSubcategoryRequest = {
  name: string;
};

export type UpdateSubcategoryRequest = Partial<CreateSubcategoryRequest>;

// API Response Types
export type CategoryResponse = {
  data: Category;
  message: string;
  status: number;
};

export type CategoriesResponse = {
  data: Category[];
  message: string;
  status: number;
};

export type SubcategoryResponse = {
  data: Subcategory;
  message: string;
  status: number;
};

export type SubcategoriesResponse = {
  data: Subcategory[];
  message: string;
  status: number;
};

// Form Types
export type CategoryFormData = CreateCategoryRequest;
export type SubcategoryFormData = CreateSubcategoryRequest;
