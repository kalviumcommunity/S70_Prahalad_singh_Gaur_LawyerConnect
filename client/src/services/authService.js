import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'; 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const register = async (userData) => {
  try {
    // The 'role' in userData will determine if it's a user or lawyer registration
    const response = await apiClient.post('/auth/register', userData);
    return response.data; 
  } catch (error) {
    console.error('Registration service error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Registration failed');
  }
};

const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data; 
  } catch (error) {
    console.error('Login service error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Login failed');
  }
};

const googleSignIn = () => {
  window.location.href = `${API_BASE_URL}/auth/google`;
};

const authService = {
  register,
  login,
  googleSignIn,
};

export default authService;

