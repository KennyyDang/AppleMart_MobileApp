import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const API_BASE_URL = "http://192.168.1.106:5069/api";

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

export interface Shipper {
  shipperID: string;
  name: string;
  phoneNumber: string;
  email?: string;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log("No authentication token found");
      }
      return config;
    } catch (error) {
      console.error("Error setting auth token:", error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

class OrderApiService {
  async getOrders(): Promise<Order[]> {
    try {
      const response = await apiClient.get("/Order/orders");

      let orders: Order[] = [];

      // Extremely comprehensive order extraction
      if (response.data) {
        if (response.data.orders?.$values) {
          orders = response.data.orders.$values;
        } else if (Array.isArray(response.data.orders)) {
          orders = response.data.orders;
        } else if (Array.isArray(response.data)) {
          orders = response.data;
        } else {
          console.error("Unexpected response structure:", response.data);
          return [];
        }
      }

      // Extreme validation and transformation
      const validOrders = orders
        .map((order) => ({
          orderID: order?.orderID ?? -1,
          userID: order?.userID ?? "",
          shipperID: order?.shipperID ?? "",
          orderDate: order?.orderDate ?? "",
          address: order?.address ?? "",
          paymentMethod: order?.paymentMethod ?? "",
          shippingMethodID: order?.shippingMethodID ?? -1,
          total: order?.total ?? 0,
          orderStatus: order?.orderStatus ?? "Unknown",
          isDeleted: order?.isDeleted ?? false,
        }))
        .filter(
          (order) => order.orderID !== -1 && order.orderStatus !== "Unknown"
        );
      return validOrders;
    } catch (error) {
      console.error("Comprehensive error in getOrders:", error);

      if (axios.isAxiosError(error)) {
        console.error("Detailed Axios Error:", {
          status: error.response?.status,
          data: JSON.stringify(error.response?.data),
          headers: error.response?.headers,
          message: error.message,
        });
      }

      return []; // Return empty array instead of throwing
    }
  }

  async getOrderById(id: number): Promise<Order> {
    try {
      const response = await apiClient.get(`/Order/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  }

  async updateOrderStatus(
    orderId: number,
    newStatus: string,
    shipperId?: string
  ): Promise<Order> {
    try {
      // Construct the URL based on the status and shipper ID
      let url = `/Admin/${orderId}/status?NewStatus=${newStatus}`;

      // Add shipper ID for Shipped status
      if (newStatus === "Shipped" && shipperId) {
        url += `&ShipperId=${shipperId}`;
      }

      const response = await apiClient.put(url);

      return response.data;
    } catch (error) {
      console.error(`Error updating order ${orderId} status:`, error);

      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.errors?.NewStatus?.[0] ||
          error.message ||
          "Failed to update order status";

        Alert.alert("Status Update Error", errorMessage);
        throw new Error(errorMessage);
      }

      throw error;
    }
  }
}

export default new OrderApiService();
