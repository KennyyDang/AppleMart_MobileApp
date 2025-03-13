import axios from 'axios';

const API_URL = "http://192.168.1.15:5069/api/Blog";

export interface BlogPost {
  productID?: number;
  blogID?: number;
  title: string;
  content: string;
  author?: string;
  category?: string;
  imageUrl?: string;
  uploadDate?: string;
  updateDate?: string;
  view?: number;
  like?: number;
  isDeleted?: boolean;
}

// Fetch all blog posts
export const fetchAllBlogs = async (): Promise<BlogPost[]> => {
  try {
    const response = await axios.get(API_URL);
    console.log("API Response:", response.data);

    let blogs = response.data?.$values ? response.data.$values : response.data;
    
    console.log("Processed Blogs:", blogs); // Kiểm tra dữ liệu sau khi xử lý

    return blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
};

// Fetch single blog post by ID
export const fetchBlogById = async (id: number): Promise<BlogPost | null> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog ${id}:`, error);
    return null;
  }
};

// Create a new blog post
export const createBlog = async (BlogPost) => {
  try {
    console.log("Sending blog data:", JSON.stringify(BlogPost, null, 2));

    const response = await axios.post(`${API_URL}`, BlogPost, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Blog created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in createBlog:", error.response?.data || error);
    throw error;
  }
};

// Update an existing blog post
export const updateBlog = async (blog: BlogPost): Promise<boolean> => {
  try {
    const response = await axios.put(`${API_URL}/${blog.blogID}`, blog);
    return response.status === 200;
  } catch (error) {
    console.error(`Error updating blog ${blog.blogID}:`, error);
    return false;
  }
};

// Delete a blog post
export const deleteBlog = async (id: number): Promise<boolean> => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.status === 200;
  } catch (error) {
    console.error(`Error deleting blog ${id}:`, error);
    return false;
  }
};



// Like a blog post
export const likeBlog = async (id: number): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_URL}/${id}/like`);
    return response.status === 200;
  } catch (error) {
    console.error(`Error liking blog ${id}:`, error);
    return false;
  }
};