import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Alert,
  ActivityIndicator 
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { BlogPost, updateBlog } from '../services/BlogApiService';
import { StackNavigationProp } from '@react-navigation/stack';

type BlogStackParamList = {
  BlogList: undefined;
  AddBlog: undefined;
  EditBlog: { blog: BlogPost };
  BlogDetail: { blogId: number };
};
type BlogNavigationProp = StackNavigationProp<BlogStackParamList, 'BlogList'>;

type RootStackParamList = {
  EditBlog: { blog: BlogPost };
  // Add other screens if needed
};

type EditBlogRouteProp = RouteProp<RootStackParamList, 'EditBlog'>;

const EditBlogScreen = () => {
  const navigation = useNavigation<BlogNavigationProp>();
  const route = useRoute<EditBlogRouteProp>();
  const blog = route.params?.blog;
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [category, setCategory] = useState('THÔNG BÁO BÁO CHÍ');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title || '');
      setContent(blog.content || '');
      setCategory(blog.category || 'THÔNG BÁO BÁO CHÍ');
      if (blog.imageUrl) {
        setImage(blog.imageUrl);
      }
    }
  }, [blog]);

  // Chọn ảnh từ thư viện
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload images');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // Xử lý cập nhật bài viết
  const handleUpdateBlog = async () => {
    // Kiểm tra các trường bắt buộc
    if (!title.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tiêu đề bài viết');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập nội dung bài viết');
      return;
    }

    if (!blog || !blog.blogID) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin bài viết để cập nhật');
      return;
    }

    setLoading(true);

    try {
      // Tạo FormData nếu có ảnh
      let imageUrl = blog.imageUrl;
      if (image && image !== blog.imageUrl) {
        // Trong tình huống thực tế, bạn sẽ upload ảnh lên server trước
        // Sau đó nhận URL trả về để lưu vào blog post
        
        // Giả định ảnh đã được upload và có URL
        imageUrl = image;
      }

      // Tạo đối tượng blog cập nhật
      const blogData = {
        id: blog.blogID,
        title,
        content,
        author: blog.author || 'Current User',
        category,
        imageUrl,
        uploadDate: blog.uploadDate,
        updateDate: new Date().toISOString(),
        view: blog.view || 0,
        like: blog.like || 0,
        isDeleted: blog.isDeleted || false
      };

      // Gọi API để cập nhật bài viết
      const result = await updateBlog(blogData);

      if (result) {
        Alert.alert('Thành công', 'Bài viết đã được cập nhật thành công', [
          { text: 'OK', onPress: () => navigation.navigate('BlogList') }
        ]);
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật bài viết. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  return (
    <ScrollView style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Đang cập nhật bài viết...</Text>
        </View>
      )}
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa bài viết</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.label}>Tiêu đề</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tiêu đề bài viết"
          value={title}
          onChangeText={setTitle}
        />
        
        <Text style={styles.label}>Ảnh đại diện</Text>
        <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <>
              <Feather name="image" size={24} color="#6C63FF" />
              <Text style={styles.uploadText}>Nhấn để tải ảnh lên</Text>
            </>
          )}
        </TouchableOpacity>
        
        <Text style={styles.label}>Nội dung</Text>
        <TextInput
          style={[styles.input, styles.contentInput]}
          placeholder="Viết nội dung bài viết của bạn tại đây..."
          multiline
          textAlignVertical="top"
          value={content}
          onChangeText={setContent}
        />
        
        <Text style={styles.label}>Danh mục</Text>
        <View style={styles.categoryContainer}>
          <TouchableOpacity 
            style={[
              styles.categoryButton, 
              category === 'THÔNG BÁO BÁO CHÍ' && styles.categorySelected
            ]}
            onPress={() => handleCategorySelect('THÔNG BÁO BÁO CHÍ')}
          >
            <Text 
              style={category === 'THÔNG BÁO BÁO CHÍ' ? styles.categorySelectedText : styles.categoryText}
            >
              THÔNG BÁO BÁO CHÍ
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.categoryButton, 
              category === 'CẬP NHẬT' && styles.categorySelected
            ]}
            onPress={() => handleCategorySelect('CẬP NHẬT')}
          >
            <Text 
              style={category === 'CẬP NHẬT' ? styles.categorySelectedText : styles.categoryText}
            >
              CẬP NHẬT
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.categoryButton, 
              category === 'TIN TỨC' && styles.categorySelected
            ]}
            onPress={() => handleCategorySelect('TIN TỨC')}
          >
            <Text 
              style={category === 'TIN TỨC' ? styles.categorySelectedText : styles.categoryText}
            >
              TIN TỨC
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.updateButton} 
          onPress={handleUpdateBlog}
          disabled={loading}
        >
          <Text style={styles.updateButtonText}>Cập nhật bài viết</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  contentInput: {
    height: 200,
    textAlignVertical: 'top',
  },
  imageUpload: {
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadText: {
    marginTop: 8,
    color: '#6C63FF',
    fontSize: 14,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  categorySelected: {
    backgroundColor: '#6C63FF',
  },
  categoryText: {
    fontSize: 12,
  },
  categorySelectedText: {
    fontSize: 12,
    color: 'white',
  },
  updateButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6C63FF',
  },
});

export default EditBlogScreen;