import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const AddBlogScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter blog title"
          value={title}
          onChangeText={setTitle}
        />
        
        <Text style={styles.label}>Featured Image</Text>
        <TouchableOpacity style={styles.imageUpload}>
          <Feather name="image" size={24} color="#6C63FF" />
          <Text style={styles.uploadText}>Tap to upload image</Text>
        </TouchableOpacity>
        
        <Text style={styles.label}>Content</Text>
        <TextInput
          style={[styles.input, styles.contentInput]}
          placeholder="Write your blog content here..."
          multiline
          textAlignVertical="top"
          value={content}
          onChangeText={setContent}
        />
        
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryContainer}>
          <TouchableOpacity style={[styles.categoryButton, styles.categorySelected]}>
            <Text style={styles.categorySelectedText}>THÔNG BÁO BÁO CHÍ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>CẬP NHẬT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>TIN TỨC</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.publishButton}>
          <Text style={styles.publishButtonText}>Đăng bài</Text>
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
    height: 120,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
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
  publishButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  publishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddBlogScreen;