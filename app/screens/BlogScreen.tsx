// BlogScreen.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl,
  Image,
  ActivityIndicator
} from 'react-native';
import { useNavigation,  } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { fetchAllBlogs, BlogPost, fetchBlogById, likeBlog, deleteBlog } from '../services/BlogApiService';
import { StackNavigationProp } from '@react-navigation/stack';

type BlogStackParamList = {
  BlogList: undefined;
  AddBlog: undefined;
  EditBlog: { blog: BlogPost };
  BlogDetail: { blogId: number };
};

type BlogNavigationProp = StackNavigationProp<BlogStackParamList, 'BlogList'>;

const BlogScreen = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<BlogNavigationProp>();
  const loadBlogPosts = async () => {
    setLoading(true);
    const data = await fetchAllBlogs();
    setBlogPosts(data);
    setLoading(false);
    setRefreshing(false);
  };


  useEffect(() => {
    loadBlogPosts();
    console.log("Updated BlogPosts state:", blogPosts);
    const unsubscribe = navigation.addListener('focus', loadBlogPosts);
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    loadBlogPosts();
  };

  const handleViewBlog = async (blog: BlogPost) => {
    if (!blog.blogID) return; 

    await fetchBlogById(blog.blogID);
    navigation.navigate('BlogDetail', { blogId: blog.blogID });
};

const handleLikeBlog = async (blogId: number) => {
  const success = await likeBlog(blogId);
  if (success) {
    setBlogPosts((prevPosts) =>
      prevPosts.map((blog) =>
        blog.blogID === blogId ? { ...blog, like: (blog.like || 0) + 1 } : blog
      )
    );
  }
};

  const handleEditBlog = (blog: BlogPost) => {
    if (!blog.blogID) return; 
    navigation.navigate('EditBlog', { blog });
  };

  const handleDeleteBlog = async (blogId: number) => {
    try {
      const success = await deleteBlog(blogId);
      if (success) {
        loadBlogPosts();
      } else {
        alert('Xóa bài viết thất bại.');
      }
    } catch (error) {
      console.error('Lỗi xóa bài viết:', error);
      alert('Đã xảy ra lỗi khi xóa bài viết.');
    }
  };

  const renderBlogItem = ({ item }: { item: BlogPost }) => (
    <TouchableOpacity 
      style={styles.blogCard} 
      onPress={() => handleViewBlog(item)}
    >
      <View style={styles.cardContent}>
        <Text style={styles.blogTitle}>{item.title}</Text>
        <Text style={styles.blogAuthor}>By {item.author || 'Unknown'}</Text>
        <Text style={styles.blogPreview} numberOfLines={2}>
          {item.content}
        </Text>
        
        <View style={styles.blogStats}>
          <View style={styles.statItem}>
            <Feather name="eye" size={14} color="#666" />
            <Text style={styles.statText}>{item.view || 0}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.statItem} 
            onPress={() => item.blogID && handleLikeBlog(item.blogID)}
          >
            <Feather name="heart" size={14} color="#666" />
            <Text style={styles.statText}>{item.like || 0}</Text>
          </TouchableOpacity>
          
          <Text style={styles.dateText}>
            {new Date(item.uploadDate || Date.now()).toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleEditBlog(item)}
        >
          <Feather name="edit" size={16} color="#6C63FF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => item.blogID && handleDeleteBlog(item.blogID)}
        >
          <Feather name="trash-2" size={16} color="#FF6C63" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Blog</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddBlog')}
        >
          <Feather name="plus" size={20} color="white" />
          <Text style={styles.addButtonText}>Tạo bài viết</Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#6C63FF" style={styles.loader} />
      ) : (
        <FlatList
          data={blogPosts}
          keyExtractor={(item, index) => item.blogID ? item.blogID.toString() : `blog-${index}`}
          renderItem={renderBlogItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="file-text" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Không có bài viết nào</Text>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={() => navigation.navigate('AddBlog')}
              >
                <Text style={styles.createButtonText}>Tạo bài viết đầu tiên</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6C63FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 4,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  blogCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  cardContent: {
    padding: 16,
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  blogAuthor: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  blogPreview: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
  },
  blogStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 'auto',
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
  },
  createButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#6C63FF',
    borderRadius: 20,
  },
  createButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default BlogScreen;