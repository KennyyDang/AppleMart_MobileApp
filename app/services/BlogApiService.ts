import axios from 'axios';


const API_URL = "http://192.168.2.15:5069/api/Blog";



export interface BlogPost {
  productId?: number;
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


export const fetchAllBlogs = async (): Promise<BlogPost[]> => {
  try {
    const response = await axios.get(API_URL);

    let blogs = response.data?.$values ? response.data.$values : response.data;

    return blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
};

export const fetchBlogById = async (id: number): Promise<BlogPost | null> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog ${id}:`, error);
    return null;
  }
};

export const createBlog = async (blogPost: any) => {
  try {
    const formData = new FormData();

    formData.append('Title', blogPost.Title || blogPost.title || '');
    formData.append('Content', blogPost.Content || blogPost.content || '');
    formData.append('Author', blogPost.Author || blogPost.author || 'Unknown');
    const productId = blogPost.ProductId || blogPost.productID || blogPost.productId;
    if (productId) {
      const productIdNum = parseInt(productId.toString());
      if (productIdNum > 0) {
        formData.append('ProductId', productIdNum.toString());
        formData.append('ProductID', productIdNum.toString());
        formData.append('productId', productIdNum.toString());
        formData.append('productID', productIdNum.toString());
      } else {
        throw new Error('ProductId must be a positive number');
      }
    } else {
      throw new Error('ProductId is required');
    }
    if (blogPost.Category || blogPost.category) {
      formData.append('Category', blogPost.Category || blogPost.category);
    }
    
    if (blogPost.ImageUrl || blogPost.imageUrl) {
      formData.append('ImageUrl', blogPost.ImageUrl || blogPost.imageUrl);
    }
    
    if (blogPost.UploadDate || blogPost.uploadDate) {
      formData.append('UploadDate', blogPost.UploadDate || blogPost.uploadDate);
    }
    
    console.log("Sending form data to API with fields:", 
      Object.fromEntries(formData.entries()));
    
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("Blog created successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error in createBlog:", error.response?.data || error);
    throw error;
  }
};

export const updateBlog = async (blog: BlogPost): Promise<boolean> => {
  try {
    const response = await axios.put(`${API_URL}/${blog.blogID}`, blog);
    return response.status === 200;
  } catch (error) {
    console.error(`Error updating blog ${blog.blogID}:`, error);
    return false;
  }
};

export const deleteBlog = async (id: number): Promise<boolean> => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.status === 200;
  } catch (error) {
    console.error(`Error deleting blog ${id}:`, error);
    return false;
  }
};

export const likeBlog = async (id: number): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_URL}/${id}`);
    return response.status === 200;
  } catch (error) {
    console.error(`Error liking blog ${id}:`, error);
    return false;
  }
}



