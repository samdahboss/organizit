import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface UserPlan {
  plan: 'free' | 'pro';
  is_pro: boolean;
  task_limit: number;
  current_tasks: number;
  remaining_tasks: number;
}

export interface PaymentResponse {
  message: string;
  payment_reference: string;
  payment_url: string;
  amount: number;
  currency: string;
  description: string;
}

// API functions
export const apiService = {
  // Auth
  setupDemo: async () => {
    const response = await api.post('/demo/setup');
    const { token } = response.data;
    localStorage.setItem('auth_token', token);
    return response.data;
  },

  // Tasks
  getTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },

  createTask: async (data: { title: string; description?: string }) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  updateTask: async (id: number, data: Partial<Task>) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: number) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  toggleTaskStatus: async (id: number) => {
    const response = await api.patch(`/tasks/${id}/toggle`);
    return response.data;
  },

  // User
  getUserPlan: async () => {
    const response = await api.get('/user/plan');
    return response.data;
  },

  // Payment
  initializePayment: async () => {
    const response = await api.post('/payment/initialize');
    return response.data;
  },

  verifyPayment: async (reference: string) => {
    const response = await api.get(`/payment/verify?reference=${reference}`);
    return response.data;
  },
};

export default api; 