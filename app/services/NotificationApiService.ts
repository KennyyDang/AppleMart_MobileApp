import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

interface NotificationResponse {
  $id: string;
  $values: Notification[];
}

const API_BASE_URL = 'http://172.20.10.2:5069/api';

class NotificationApiService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'accept': 'text/plain',
        'Content-Type': 'application/json'
      }
    });

    this.apiClient.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem("accessToken");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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

  async markNotificationAsRead(notificationID: number): Promise<boolean> {
    try {
      const response = await this.apiClient.put(`/Notification/${notificationID}/read`);
      
      return response.status === 200;
    } catch (error) {
      console.error(`[NotificationApiService] Detailed error marking notification ${notificationID} as read:`, error);

      if (axios.isAxiosError(error)) {
        console.error('[NotificationApiService] Axios Error Details:', {
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
          message: error.message,
          config: error.config
        });
      }
      
      return false;
    }
  }

  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await this.apiClient.get<NotificationResponse>('/Notification');
      const notifications = response.data.$values;

      if (!Array.isArray(notifications)) {
        console.error('API did not return an array of notifications');
        return []; 
      }

      return notifications;
    } catch (error) {
      console.error('Detailed Error in getNotifications:', error);
      return []; 
    }
  }
}

export default new NotificationApiService();