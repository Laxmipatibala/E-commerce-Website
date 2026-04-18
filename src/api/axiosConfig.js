import axios from 'axios';

// Create a base instance
// In a real app, replace the baseURL with your actual API endpoint.
const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Example backend URL placeholder
});

// Configure the interceptor to add the JWT token to every request
api.interceptors.request.use(
  (config) => {
    // 1. Get the token from localStorage
    const token = localStorage.getItem('token');
    
    // 2. If it exists, attach it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
