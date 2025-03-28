import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const API_URL = "https://api.apple-mart.capybara.pro.vn/api/Blog";
const API_URL = "http://172.20.10.2:5069/api/Blog";

// Create an axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
});

// Add interceptor to handle authentication
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

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    return token;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

// Tạo một hàm để lấy tên người dùng từ AsyncStorage
const getName = async () => {
  try {
    const username = await AsyncStorage.getItem("name");
    return username || "Unknown";
  } catch (error) {
    console.error("Error getting username:", error);
    return "Unknown";
  }
};

export interface BlogPost {
  productId?: number;
  blogID?: number;
  title: string;
  content: string;
  author?: string;
  category?: string;
  imageUrl?: string | undefined;
  blogImages?: { imageUrl: string }[];
  uploadDate?: string;
  updateDate?: string;
  view?: number;
  like?: number;
  isDeleted?: boolean;
}

export const fetchAllBlogs = async (): Promise<BlogPost[]> => {
  try {
    const response = await apiClient.get("");
    let blogs = response.data?.$values ? response.data.$values : response.data;
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
};

export const fetchBlogById = async (id: number): Promise<BlogPost | null> => {
  try {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog ${id}:`, error);
    return null;
  }
};

export const createBlog = async (blogPost: BlogPost) => {
  try {
    const author = await getName();

    // Prepare blog data matching the exact API schema
    const blogData: BlogPost = {
      title: blogPost.title || '',
      content: blogPost.content || '',
      author: author, 
      productId: blogPost.productId,
      category: blogPost.category,
      uploadDate: blogPost.uploadDate || new Date().toISOString(),
      blogImages: [] // Initialize as empty array
    };

    // Add image if available
    if (blogPost.imageUrl) {
      blogData.blogImages = [{ imageUrl: blogPost.imageUrl }];
    }

    if (!blogData.productId || parseInt(blogData.productId.toString()) <= 0) {
      throw new Error('ProductId must be a positive number');
    }

    
    const response = await apiClient.post('', blogData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error in createBlog:", error.response?.data || error);
    throw error;
  }
};

export const updateBlog = async (blog: BlogPost): Promise<boolean> => {
  try {
    // Ensure blogImages is properly set
    const blogData = {
      ...blog,
      blogImages: blog.imageUrl 
        ? [{ imageUrl: blog.imageUrl }]
        : blog.blogImages || []
    };

    const response = await apiClient.put(`/${blog.blogID}`, blogData);
    return response.status === 200;
  } catch (error) {
    console.error(`Error updating blog ${blog.blogID}:`, error);
    return false;
  }
};

export const deleteBlog = async (id: number): Promise<boolean> => {
  try {
    const response = await apiClient.delete(`/${id}`);
    return response.status === 200;
  } catch (error) {
    console.error(`Error deleting blog ${id}:`, error);
    return false;
  }
};

export const likeBlog = async (id: number): Promise<boolean> => {
  try {
    const response = await apiClient.post(`/${id}`);
    return response.status === 200;
  } catch (error) {
    console.error(`Error liking blog ${id}:`, error);
    return false;
  }
};
