import axiosInstance from '../axios';

import type {
  UserProfile,
  UserFilters,
  UserManagement,
  UserPermissions,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateUserProfileRequest,
} from '../../types/user';

// ----------------------------------------------------------------------

export class UserService {
  // ===== USER MANAGEMENT (ADMIN) =====

  /**
   * Get user statistics (Admin only)
   */
  static async getUserStats(): Promise<{
    totalUsers: number;
    verifiedUsers: number;
    unverifiedUsers: number;
    adminUsers: number;
    regularUsers: number;
    usersWithCompanies: number;
    usersWithoutCompanies: number;
    recentUsers: number;
  }> {
    try {
      const response = await axiosInstance.get('/users/admin/statistics');
      return response.data;
    } catch (error) {
      console.error('UserService.getUserStats error:', error);
      throw error;
    }
  }

  /**
   * Get all users with pagination and filtering (Admin only)
   */
  static async getUsers(filters?: UserFilters): Promise<{
    users: UserManagement[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const params = new URLSearchParams();

      // Pagination
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      // Sorting
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

      // Filtering
      if (filters?.role && filters.role !== 'ALL') {
        params.append('role', filters.role);
      }
      if (filters?.isVerified !== undefined && filters.isVerified !== 'ALL') {
        params.append('isVerified', filters.isVerified.toString());
      }
      if (filters?.search) {
        params.append('search', filters.search);
      }

      const queryString = params.toString();
      const endpoint = queryString ? `/users/admin/users?${queryString}` : '/users/admin/users';

      const response = await axiosInstance.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('UserService.getUsers error:', error);
      throw error;
    }
  }

  /**
   * Get single user details by ID (Admin only)
   */
  static async getUser(userId: string): Promise<{
    user: UserManagement;
    profile?: UserProfile;
  }> {
    try {
      const response = await axiosInstance.get(`/users/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('UserService.getUser error:', error);
      throw error;
    }
  }

  /**
   * Create new user (Admin only)
   */
  static async createUser(data: CreateUserRequest): Promise<UserManagement> {
    try {
      const response = await axiosInstance.post('/users/admin/users', {
        email: data.email,
        password: data.password,
        role: data.role || 'USER',
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        isVerified: true, // Admin created users are verified by default
      });
      return response.data.user;
    } catch (error) {
      console.error('UserService.createUser error:', error);
      throw error;
    }
  }

  /**
   * Update user (Admin only)
   */
  static async updateUser(userId: string, data: UpdateUserRequest): Promise<UserManagement> {
    try {
      const updateData: any = {};

      if (data.firstName !== undefined) updateData.firstName = data.firstName;
      if (data.lastName !== undefined) updateData.lastName = data.lastName;
      if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber;
      if (data.role !== undefined) updateData.role = data.role;
      if (data.isActive !== undefined) updateData.isVerified = data.isActive; // API uses isVerified
      if (data.email !== undefined) updateData.email = data.email;
      if (data.password !== undefined) updateData.password = data.password;

      const response = await axiosInstance.patch(`/users/admin/users/${userId}`, updateData);
      return response.data.user;
    } catch (error) {
      console.error('UserService.updateUser error:', error);
      throw error;
    }
  }

  /**
   * Delete user (Admin only)
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      await axiosInstance.delete(`/users/admin/users/${userId}`);
    } catch (error) {
      console.error('UserService.deleteUser error:', error);
      throw error;
    }
  }

  /**
   * Toggle user verification status (Admin only)
   */
  static async toggleUserStatus(userId: string, isActive: boolean): Promise<UserManagement> {
    try {
      const response = await axiosInstance.patch(`/users/admin/users/${userId}`, {
        isVerified: isActive,
      });
      return response.data.user;
    } catch (error) {
      console.error('UserService.toggleUserStatus error:', error);
      throw error;
    }
  }

  /**
   * Update user role (Admin only)
   */
  static async updateUserRole(userId: string, role: string): Promise<UserManagement> {
    try {
      const response = await axiosInstance.patch(`/users/admin/users/${userId}`, {
        role,
      });
      return response.data.user;
    } catch (error) {
      console.error('UserService.updateUserRole error:', error);
      throw error;
    }
  }

  // ===== PROFILE MANAGEMENT =====

  /**
   * Get current user profile
   */
  static async getMyProfile(): Promise<UserProfile> {
    try {
      const response = await axiosInstance.get('/users/profile/me');
      return response.data;
    } catch (error) {
      console.error('UserService.getMyProfile error:', error);
      throw error;
    }
  }

  /**
   * Update current user profile
   */
  static async updateMyProfile(
    data: UpdateUserProfileRequest,
    files?: {
      avatar?: File;
      cv?: File;
    }
  ): Promise<UserProfile> {
    try {
      const formData = new FormData();

      // Add text fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Add files
      if (files?.avatar) {
        formData.append('avatar', files.avatar);
      }
      if (files?.cv) {
        formData.append('cv', files.cv);
      }

      const response = await axiosInstance.patch<UserProfile>('/users/profile/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('UserService.updateMyProfile error:', error);
      throw error;
    }
  }

  /**
   * Get user profile by ID
   */
  static async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await axiosInstance.get<UserProfile>(`/users/${userId}/profile`);
      return response.data;
    } catch (error) {
      console.error('UserService.getUserProfile error:', error);
      throw error;
    }
  }

  /**
   * Get basic user info by ID
   */
  static async getUserById(userId: string): Promise<UserManagement> {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('UserService.getUserById error:', error);
      throw error;
    }
  }

  // ===== PERMISSIONS =====

  /**
   * Get user permissions based on role
   */
  static getUserPermissions(userRole?: string): UserPermissions {
    const isAdmin = userRole === 'ADMIN';

    return {
      canCreateUsers: isAdmin,
      canUpdateUsers: isAdmin,
      canDeleteUsers: isAdmin,
      canViewAllUsers: isAdmin,
      canManageRoles: isAdmin,
      canDeactivateUsers: isAdmin,
    };
  }

  /**
   * Check if user has specific permission
   */
  static hasPermission(permission: keyof UserPermissions, userRole?: string): boolean {
    const permissions = this.getUserPermissions(userRole);
    return permissions[permission];
  }

  // ===== UTILITY METHODS =====

  /**
   * Search users by query
   */
  static async searchUsers(query: string): Promise<UserManagement[]> {
    try {
      const response = await axiosInstance.get(
        `/users/admin/users?search=${encodeURIComponent(query)}&limit=50`
      );
      return response.data.users;
    } catch (error) {
      console.error('UserService.searchUsers error:', error);
      throw error;
    }
  }

  /**
   * Export users data (Admin only)
   * Note: This endpoint might not exist in the API, implementing as CSV download from frontend data
   */
  static async exportUsers(filters?: UserFilters): Promise<Blob> {
    try {
      // Get all users data first
      const allUsers = await this.getUsers({ ...filters, limit: 1000 });

      // Create CSV content
      const headers = [
        'ID',
        'Email',
        'First Name',
        'Last Name',
        'Phone',
        'Role',
        'Verified',
        'Last Login',
        'Created At',
        'Company',
        'Applications Count',
        'Bookmarks Count',
      ];

      const csvContent = [
        headers.join(','),
        ...allUsers.users.map((user) =>
          [
            user.id,
            user.email,
            user.firstName,
            user.lastName,
            user.phoneNumber || '',
            user.role,
            user.isVerified ? 'Yes' : 'No',
            user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never',
            new Date(user.createdAt).toLocaleDateString(),
            user.company?.name || 'None',
            user._count?.applications || 0,
            user._count?.bookmarks || 0,
          ]
            .map((field) => `"${field}"`)
            .join(',')
        ),
      ].join('\n');

      // Create blob
      return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    } catch (error) {
      console.error('UserService.exportUsers error:', error);
      throw error;
    }
  }
}
