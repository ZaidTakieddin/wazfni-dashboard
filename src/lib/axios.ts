import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: 'https://api.wazfni.app/api/v1',
  timeout: 30000,
});

// Token management
export const tokenManager = {
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  },
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  },
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  },
};

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

      // Only redirect if not already on sign-in page to avoid infinite redirects
      if (currentPath !== '/auth/sign-in') {
        tokenManager.removeToken();
        // Redirect to login if needed
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/sign-in';
        }
      }
    }

    return Promise.reject((error.response && error.response.data) || 'Something went wrong!');
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/users/profile/me',
    changePassword: '/auth/change-password',
    googleLogin: '/auth/google',
  },
  // Admin endpoints
  admin: {
    approval: {
      companies: {
        pending: '/admin/approval/companies/pending',
        all: '/admin/approval/companies/all',
        details: (id: string) => `/admin/approval/companies/${id}`,
        approve: (id: string) => `/admin/approval/companies/${id}/approve`,
        reject: (id: string) => `/admin/approval/companies/${id}/reject`,
      },
      jobs: {
        pending: '/admin/approval/jobs/pending',
        all: '/admin/approval/jobs/all',
        details: (id: string) => `/admin/approval/jobs/${id}`,
        approve: (id: string) => `/admin/approval/jobs/${id}/approve`,
        reject: (id: string) => `/admin/approval/jobs/${id}/reject`,
      },
    },
  },
  // Other endpoints
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  mail: { list: '/api/mail/list', details: '/api/mail/details', labels: '/api/mail/labels' },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};
