'use client';

import type { ReactNode } from 'react';
import { useMemo, useEffect, useContext, createContext, useState } from 'react';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import type { AuthContextType, User } from 'src/types/auth';

import { AuthService } from 'src/lib/services/auth.service';
import {
  useLogin,
  useLogout,
  useRegister,
  useGetProfile,
  useGoogleLogin,
  useChangePassword,
} from 'src/lib/hooks/use-auth';

// ----------------------------------------------------------------------

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
};

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  // React Query hooks
  const {
    data: user,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useGetProfile();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const registerMutation = useRegister();
  const googleLoginMutation = useGoogleLogin();
  const changePasswordMutation = useChangePassword();

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      const hasToken = AuthService.isAuthenticated();

      if (hasToken && !user && !profileLoading) {
        // Token exists but no user data, try to fetch profile
        try {
          await refetchProfile();
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          // Token might be invalid, logout
          AuthService.logout();
        }
      }

      setIsInitialized(true);
    };

    initializeAuth();
  }, [user, profileLoading, refetchProfile]);

  // Check if user is authenticated and is admin
  const authenticated = !!user && AuthService.isAdmin(user);
  const isAdmin = user ? AuthService.isAdmin(user) : false;

  // Handle profile error (token expired, etc.)
  useEffect(() => {
    if (profileError && AuthService.isAuthenticated()) {
      console.error('Profile fetch error:', profileError);
      // Token is invalid, logout user
      AuthService.logout();
      router.push(paths.auth.signIn);
    }
  }, [profileError, router]);

  // Loading state - include initialization check
  const loading =
    !isInitialized ||
    profileLoading ||
    loginMutation.isPending ||
    logoutMutation.isPending ||
    registerMutation.isPending ||
    googleLoginMutation.isPending;

  // Auth methods
  const login = async (email: string, password: string): Promise<void> => {
    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (error: any) {
      throw new Error(error?.message || 'Login failed');
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  }): Promise<void> => {
    try {
      await registerMutation.mutateAsync(data);
      router.push(paths.dashboard.root);
    } catch (error: any) {
      throw new Error(error?.message || 'Registration failed');
    }
  };

  const loginWithGoogle = async (googleToken: string): Promise<void> => {
    try {
      await googleLoginMutation.mutateAsync({ googleToken });
      router.push(paths.dashboard.root);
    } catch (error: any) {
      throw new Error(error?.message || 'Google login failed');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutMutation.mutateAsync();
      router.push(paths.auth.signIn);
    } catch (error: any) {
      // Even if logout fails, redirect to login
      router.push(paths.auth.signIn);
    }
  };

  const changePassword = async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    try {
      await changePasswordMutation.mutateAsync(data);
    } catch (error: any) {
      throw new Error(error?.message || 'Password change failed');
    }
  };

  // Context value
  const memoizedValue = useMemo(
    (): AuthContextType => ({
      user: user || null,
      loading,
      authenticated,
      isAdmin,
      login,
      loginWithGoogle,
      logout,
      register,
      changePassword,
    }),
    [user, loading, authenticated, isAdmin]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
