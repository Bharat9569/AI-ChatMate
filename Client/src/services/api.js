import axios from 'axios';

// Create Axios instance with backend base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Change if your backend URL differs
});

// Add a request interceptor to include JWT token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // token stored on login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
