import axios from 'axios';

const BASE_URL = 'http://192.168.1.12:5069/api/Admin'; // Replace with your actual API base URL

class ManageApiService {
  // Get total users
  static getTotalUsers() {
    return axios.get(`${BASE_URL}/get-total-user`);
  }

  // Get total revenue
  static getTotalRevenue() {
    return axios.get(`${BASE_URL}/get-total-revenue`);
  }
  
  // Get total products
  static getTotalProducts() {
    return axios.get(`${BASE_URL}/total-products`);
  }

  // Get top selling products
  static getTopSellingProducts() {
    return axios.get(`${BASE_URL}/get-top-selling-product-items`);
  }
}

export default ManageApiService;