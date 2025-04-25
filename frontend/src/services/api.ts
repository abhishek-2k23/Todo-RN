import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://todo-rn.onrender.com/api'; // For Android emulator
// const API_URL = 'http://localhost:3000/api'; // For iOS simulator

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error getting token:', error);
    return config;
  }
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      Alert.alert('Error', 'Request timeout. Please check your internet connection.');
    } else if (!error.response) {
      Alert.alert('Network Error', 'Please check your internet connection.');
    } else if (error.response.status === 401) {
      AsyncStorage.removeItem('token');
      Alert.alert('Session Expired', 'Please login again');
    } else if (error.response.status === 500) {
      Alert.alert('Server Error', 'Something went wrong on the server. Please try again later.');
    }
    return Promise.reject(error);
  }
);

export const auth = {
  register: async (username: string, email: string, password: string) => {
    try {
      console.log('Attempting to register user:', { username, email });
      const response = await api.post('/register', { username, email, password });
      console.log('Registration response:', response.data);
      
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        return response.data;
      } else {
        throw new Error('No token received from server');
      }
    } catch (error: any) {
      console.error('Registration error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = error.response.data?.message || 
                            error.response.data?.errors?.join(', ') || 
                            'Registration failed';
        Alert.alert('Registration Failed', errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        Alert.alert('Network Error', 'Could not connect to the server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        Alert.alert('Error', error.message || 'Something went wrong during registration');
      }
      throw error;
    }
  },
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/login', { email, password });
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }
      Alert.alert('Login Successful')
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error || 
                            'Invalid credentials';
        Alert.alert('Login Failed', errorMessage);
      } else if (error.request) {
        Alert.alert('Network Error', 'Could not connect to the server. Please check your internet connection.');
      } else {
        Alert.alert('Error', 'Something went wrong during login');
      }
      throw error;
    }
  },
  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  getProfile: async () => {
    try {
      const response = await api.get('/me');
      return response.data;
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      if (error.response) {
        Alert.alert('Error', 'Failed to fetch profile');
      } else if (error.request) {
        Alert.alert('Network Error', 'Could not connect to the server. Please check your internet connection.');
      } else {
        Alert.alert('Error', 'Something went wrong while fetching profile');
      }
      throw error;
    }
  },
  updateProfile: async (username: string, email: string) => {
    try {
      const response = await api.put('/me', { username, email });
      return response.data;
    } catch (error: any) {
      console.error('Profile update error:', error);
      if (error.response) {
        Alert.alert('Error', 'Failed to update profile');
      } else if (error.request) {
        Alert.alert('Network Error', 'Could not connect to the server. Please check your internet connection.');
      } else {
        Alert.alert('Error', 'Something went wrong while updating profile');
      }
      throw error;
    }
  }
};

export const todos = {
  getAll: async () => {
    try {
      const response = await api.get('/todos');
      return response.data;
    } catch (error: any) {
      Alert.alert('Error', 'Failed to fetch todos');
      throw error;
    }
  },
  create: async (todo: {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    category: string;
    dueDate?: string;
  }) => {
    try {
      const response = await api.post('/todos', todo);
      return response.data;
    } catch (error: any) {
      Alert.alert('Error', 'Failed to create todo');
      throw error;
    }
  },
  update: async (id: string, todo: {
    title?: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    category?: string;
    completed?: boolean;
  }) => {
    try {
      const response = await api.put(`/todos/${id}`, todo);
      return response.data;
    } catch (error: any) {
      Alert.alert('Error', 'Failed to update todo');
      throw error;
    }
  },
  delete: async (id: string) => {
    try {
      const response = await api.delete(`/todos/${id}`);
      return response.data;
    } catch (error: any) {
      Alert.alert('Error', 'Failed to delete todo');
      throw error;
    }
  },
};

export default api;