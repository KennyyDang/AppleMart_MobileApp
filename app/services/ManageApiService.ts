import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshToken } from './authService'; // Import the refreshToken function from your auth service

const BASE_URL = 'http://192.168.1.15:5069/api/Admin';

// Create an axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken();

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);


        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

class ManageApiService {
  // Get total users
  static getTotalUsers() {
    return apiClient.get('/get-total-user');
  }

  // Get total revenue
  static getTotalRevenue() {
    return apiClient.get('/get-total-revenue');
  }
  
  // Get total products
  static getTotalProducts() {
    return apiClient.get('/total-products');
  }

  // Get top selling products
  static getTopSellingProducts() {
    return apiClient.get('/get-top-selling-product-items')
      .then(response => {
        return response;
      })
      .catch(error => {
        console.error('Error fetching top products:', error);
        throw error;
      });
  }

  static getTopCustomers() {
    return apiClient.get('/get-top-costumers')  // Corrected endpoint
      .then(response => {
        return response;
      })
      .catch(error => {
        console.error('Error fetching top customers:', error);
        throw error;
      });
  }
}

export default ManageApiService;