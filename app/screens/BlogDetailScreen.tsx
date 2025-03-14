import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Share,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { fetchBlogById, BlogPost, likeBlog } from '../services/BlogApiService';

type BlogStackParamList = {
  BlogList: undefined;
  AddBlog: undefined;
  EditBlog: { blog: BlogPost };
  BlogDetail: { blogId: number }; // Nhận blogId từ navigation params
};

type BlogDetailRouteProp = RouteProp<BlogStackParamList, 'BlogDetail'>;

const BlogDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<BlogDetailRouteProp>();
  const { blogId } = route.params; // Lấy blogId từ params

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogDetails = async () => {
      if (!blogId) {
        console.error("Blog ID is missing!");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const blogData = await fetchBlogById(blogId);
        if (!blogData) {
          console.error("Blog not found with ID:", blogId);
        }
        setBlog(blogData);
      } catch (error) {
        console.error("Error fetching blog details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBlogDetails();
  }, [blogId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (!blog) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={48} color="#FF6C63" />
        <Text style={styles.errorText}>Không tìm thấy bài viết</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{blog.title}</Text>
      </View>

      <ScrollView style={styles.content}>
  {blog.imageUrl ? (
    <Image source={{ uri: blog.imageUrl.startsWith('http') ? blog.imageUrl : `${API_URL}/${blog.imageUrl}` }} 
           style={styles.featuredImage} 
           resizeMode="cover" />
  ) : (
    <Text style={styles.noImageText}>Không có ảnh</Text>
  )}
  <Text style={styles.blogTitle}>{blog.title}</Text>
  <Text style={styles.blogContent}>{blog.content}</Text>
</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#f8f8f8'
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  content: { padding: 16 },
  featuredImage: { width: '100%', height: 200, borderRadius: 10, marginBottom: 16 },
  blogTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  blogContent: { fontSize: 16, color: '#333' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: '#FF6C63', marginTop: 8 },
  backButton: { marginTop: 16, padding: 10, backgroundColor: '#6C63FF', borderRadius: 8 },
  backButtonText: { color: 'white', fontWeight: 'bold' }
});

export default BlogDetailScreen;