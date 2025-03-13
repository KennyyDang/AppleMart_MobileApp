import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';


type BlogScreenNavigationProp = NavigationProp<ParamListBase>;

const BlogScreen = () => {
  // Properly type the navigation
  const navigation = useNavigation<BlogScreenNavigationProp>();
  const blogPosts = [
    {
      id: '1',
      title: 'Apple giới thiệu MacBook Air mới với chip M4 và có màu xanh da trời',
      date: '05 tháng 2 2025',
      type: 'THÔNG BÁO BÁO CHÍ'
    },
    {
      id: '2',
      title: 'Apple ra mắt Mac Studio mới, máy Mac mạnh mẽ nhất từ trước tới nay',
      date: '01 tháng 2 2025',
      type: 'THÔNG BÁO BÁO CHÍ'
    },
    {
      id: '3',
      title: 'Apple ra mắt iPhone 16e',
      date: '19 tháng 2 2025',
      type: 'THÔNG BÁO BÁO CHÍ'
    },
    {
      id: '4',
      title: 'Apple mở Apple Developer Academy thứ tư tại Indonesia',
      date: '15 tháng 2 2025',
      type: 'CẬP NHẬT'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New Blog</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Featured Article (Large) */}
        <View style={styles.featuredArticle}>
         
          <View style={styles.featuredContent}>
            <Text style={styles.postType}>{blogPosts[0].type}</Text>
            <Text style={styles.featuredTitle}>{blogPosts[0].title}</Text>
            <Text style={styles.date}>{blogPosts[0].date}</Text>
          </View>
        </View>
        
        {/* Secondary Articles */}
        <View style={styles.secondaryRow}>
          <View style={styles.secondaryArticle}>
        
            <View style={styles.secondaryContent}>
              <Text style={styles.postType}>{blogPosts[1].type}</Text>
              <Text style={styles.secondaryTitle}>{blogPosts[1].title}</Text>
              <Text style={styles.date}>{blogPosts[1].date}</Text>
            </View>
          </View>
          
          <View style={styles.secondaryArticle}>
   
            <View style={styles.secondaryContent}>
              <Text style={styles.postType}>{blogPosts[2].type}</Text>
              <Text style={styles.secondaryTitle}>{blogPosts[2].title}</Text>
              <Text style={styles.date}>{blogPosts[2].date}</Text>
            </View>
          </View>
        </View>
        
        {/* Small Article */}
        <View style={styles.smallArticle}>
          <Image 
            style={styles.smallImage}
            resizeMode="cover"
          />
          <View style={styles.smallContent}>
            <Text style={styles.postType}>{blogPosts[3].type}</Text>
            <Text style={styles.smallTitle}>{blogPosts[3].title}</Text>
            <Text style={styles.date}>{blogPosts[3].date}</Text>
          </View>
        </View>
      </ScrollView>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  featuredArticle: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    margin: 8,
    marginBottom: 4,
  },
  featuredImage: {
    width: '100%',
    height: 200,
  },
  featuredContent: {
    padding: 10,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postType: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 4,
  },
  secondaryArticle: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    margin: 4,
  },
  secondaryImage: {
    width: '100%',
    height: 120,
  },
  secondaryContent: {
    padding: 10,
  },
  secondaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  smallArticle: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    margin: 8,
    marginTop: 4,
  },
  smallImage: {
    width: 80,
    height: 80,
  },
  smallContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  smallTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default BlogScreen;