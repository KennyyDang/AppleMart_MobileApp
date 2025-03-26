import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the API base URL - replace with your actual API base URL

const API_BASE_URL = 'http://192.168.2.15:5069/api/Order';

// Define TypeScript interfaces based on the SQL tables
export interface OrderDetail {
  orderDetailID: number;
  productItemID: number;
  orderID: number;
  quantity: number;
  price: number;
  isDeleted: boolean;
}

export interface Order {
  orderID: number;
  userID: string;
  shipperID: string;
  orderDate: string;
  address: string;
  paymentMethod: string;
  shippingMethodID: number;
  total: number;
  orderStatus: string;
  voucherID?: number;
  isDeleted: boolean;
  orderDetails?: OrderDetail[];
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        // Add token to header
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log('No authentication token found');
      }
      return config;
    } catch (error) {
      console.error('Error setting auth token:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

class OrderApiService {

  async getOrders(): Promise<Order[]> {
    try {
      const response = await apiClient.get('/orders');
      if (response.data && response.data.orders && response.data.orders.$values) {
        return response.data.orders.$values;
      }
      if (response.data && Array.isArray(response.data.orders)) {
        return response.data.orders;
      }
      
      if (Array.isArray(response.data)) {
        return response.data;
      }

      console.error('Could not find orders in response:', response.data);
      return [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Message:', error.response?.data);
      }
      throw error;
    }
  }

  async updateOrder(id: number, order: Partial<Order>): Promise<Order> {
    try {
      console.log(`Updating order ${id} with data:`, JSON.stringify(order, null, 2));
  
      // Prepare the update data in the format expected by the backend
      const updateData: any = {};
      
      if (order.orderStatus) {
        updateData.newStatus = order.orderStatus;
      }
      
      if (order.shipperID) {
        updateData.shipperID = order.shipperID;
      }
      
      // Only proceed if we have data to update
      if (Object.keys(updateData).length === 0) {
        throw new Error('No valid update data provided.');
      }
      
      const response = await apiClient.put(`/${id}/status`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${id}:`, error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
      }
      throw error;
    }
  }
  
  // Other methods remain the same
  async getOrderById(id: number): Promise<Order> {
    try {
      const response = await apiClient.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  }
  
  async createOrder(order: Omit<Order, 'orderID'>): Promise<Order> {
    try {
      const response = await apiClient.post('', order);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
  
  async deleteOrder(id: number): Promise<void> {
    try {
      await apiClient.delete(`/${id}`);
    } catch (error) {
      console.error(`Error deleting order ${id}:`, error);
      throw error;
    }
  }
}
export default new OrderApiService();