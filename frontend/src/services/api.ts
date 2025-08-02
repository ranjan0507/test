import axios from 'axios';
import type { User, AuthResponse, Category, Content, Link } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    console.log('Backend health check response:', response.status);
    return true;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  // Don't add token for public routes
  const publicRoutes = ['/auth/login', '/auth/register'];
  const isPublic = publicRoutes.some(route => config.url?.includes(route));

  if (!isPublic && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// Re-export types for convenience
export type { User, AuthResponse, Category, Content, Link };

// Auth API
export const authApi = {
  register: async (username: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/register', { username, password });
      console.log("Attempting register with:", { username, password });
      return response.data;
    } catch (error: any) {
      console.error('Registration API Error:', error);
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
  },

  login: async (username: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', { username, password });
      return response.data;
    } catch (error: any) {
      console.error('Login API Error:', error);
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/category');
    return response.data;
  },

  create: async (name: string): Promise<Category> => {
    const response = await api.post('/category', { name });
    return response.data;
  },

  update: async (categoryId: string, name: string): Promise<Category> => {
    const response = await api.patch(`/category/${categoryId}`, { name });
    return response.data;
  },

  delete: async (categoryId: string): Promise<void> => {
    await api.delete(`/category/${categoryId}`);
  },
};

// Content API
export const contentApi = {
  getAll: async (): Promise<Content[]> => {
    const response = await api.get('/content');
    return response.data;
  },

  create: async (contentData: Partial<Content>): Promise<Content> => {
    const response = await api.post('/content', contentData);
    return response.data;
  },

  update: async (contentId: string, contentData: Partial<Content>): Promise<Content> => {
    const response = await api.patch(`/content/${contentId}`, contentData);
    return response.data;
  },

  delete: async (contentId: string): Promise<void> => {
    await api.delete(`/content/${contentId}`);
  },
};

// Links API
export const linksApi = {
  getAll: async (): Promise<Link[]> => {
    const response = await api.get('/links');
    return response.data;
  },

  create: async (originalUrl: string): Promise<Link> => {
    const response = await api.post('/links', { originalUrl });
    return response.data;
  },

  delete: async (linkId: string): Promise<void> => {
    await api.delete(`/links/${linkId}`);
  },
};

export default api;
