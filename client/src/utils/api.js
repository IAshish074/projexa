import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? 'https://projexa-2ndeazqnn-iashish074s-projects.vercel.app/api' : 'http://localhost:5001/api'),
  withCredentials: true, // Required for cookies (JWT)
  headers: {}
});

// Add a request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if error is unauthorized (token expired/invalid)
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if necessary
      // We can also trigger a global event here if we want AuthContext to catch it
      localStorage.removeItem('token');
      // If we are not already on the login page, redirect
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
