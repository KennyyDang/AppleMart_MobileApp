import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the Notification interface based on the API response
export interface Notification {
  notificationID: number;
  userID: string;
  header: string;
  content: string;
  isRead: boolean;
  isDeleted: boolean;
  createdDate: string;
  user: any | null;
}

// Define an interface for the full API response
interface NotificationResponse {
  $id: string;
  $values: Notification[];
}

// Configuration constants
const API_BASE_URL = 'http://192.168.1.6:5069/api';

class NotificationApiService {
  private apiClient: AxiosInstance;

  constructor() {
    // Create axios instance with base configuration
    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'accept': 'text/plain'
      }
    });

    // Add interceptor for adding authentication token
    this.apiClient.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem("accessToken");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("Token added to request:", token.substring(0, 10) + '...'); 
          } else {
            console.log("No authentication token found in AsyncStorage");
          }
          return config;
        } catch (error) {
          console.error("Error retrieving auth token from AsyncStorage:", error);
          return config;
        }
      },
      (error) => Promise.reject(error)
    );
  }

  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await this.apiClient.get<NotificationResponse>('/Notification');
      
      // Explicitly extract $values array
      const notifications = response.data.$values;

      console.log('Notifications fetched:', notifications);

      // Ensure we have an array
      if (!Array.isArray(notifications)) {
        console.error('API did not return an array of notifications');
        return []; // Return empty array instead of throwing error
      }

      return notifications;
    } catch (error) {
      console.error('Detailed Error in getNotifications:', error);
      
      // If it's an axios error, log more details
      if (axios.isAxiosError(error)) {
        console.error('Axios Error Response:', error.response?.data);
        console.error('Axios Error Status:', error.response?.status);
      }

      return []; // Return empty array to prevent app from crashing
    }
  }
}

export default new NotificationApiService();