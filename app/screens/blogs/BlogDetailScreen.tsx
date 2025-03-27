import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Share,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import {
  BlogPost,
  fetchBlogById,
  likeBlog,
} from "../../services/BlogApiService";
import { useTabBar } from "@/navigation/TabBarContext";

type BlogStackParamList = {
  BlogList: undefined;
  AddBlog: undefined;
  EditBlog: { blog: BlogPost };
  BlogDetail: { blogId: number };
};

type BlogDetailRouteProp = RouteProp<BlogStackParamList, "BlogDetail">;

const BlogDetailScreen = () => {
  const { setIsTabBarVisible } = useTabBar();
  const lastScrollY = useRef(0);
  const navigation = useNavigation();
  const route = useRoute<BlogDetailRouteProp>();
  const { blogId } = route.params;

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  const { handleScroll } = useTabBar();

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
          return;
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

  const handleLikeBlog = async () => {
    if (!blog?.blogID) return;

    try {
      const success = await likeBlog(blog.blogID);
      if (success) {
        setIsLiked(true);
        setBlog((prevBlog) => {
          if (!prevBlog) return null;
          return {
            ...prevBlog,
            like: (prevBlog.like || 0) + 1,
          };
        });
      }
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  const handleShareBlog = async () => {
    if (!blog) return;

    try {
      await Share.share({
        message: `Xem bài viết "${blog.title}" ngay!`,
        title: blog.title,
      });
    } catch (error) {
      console.error("Error sharing blog:", error);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Không có thông tin";

    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      onScroll={handleScroll}
      scrollEventThrottle={16}
      nestedScrollEnabled={true}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {blog.title}
          </Text>
        </View>

        <View style={styles.content}>
          {(blog.imageUrl ||
            (blog.blogImages &&
              blog.blogImages.$values &&
              blog.blogImages.$values.length > 0)) && (
            <Image
              source={{
                uri:
                  blog.imageUrl ||
                  (blog.blogImages.$values[0] &&
                    blog.blogImages.$values[0].imageUrl),
              }}
              style={styles.featuredImage}
              resizeMode="cover"
              onError={(e) =>
                console.error("Image load error", e.nativeEvent.error)
              }
            />
          )}

          <Text style={styles.blogTitle}>{blog.title}</Text>

          <View style={styles.metadataContainer}>
            <View style={styles.metadataItem}>
              <Feather name="user" size={16} color="#666" />
              <Text style={styles.metadataText}>
                Tác giả: {blog.author || "Không có thông tin"}
              </Text>
            </View>

            {blog.category && (
              <View style={styles.metadataItem}>
                <Feather name="tag" size={16} color="#666" />
                <Text style={styles.metadataText}>
                  Thể loại: {blog.category}
                </Text>
              </View>
            )}

            {blog.uploadDate && (
              <View style={styles.metadataItem}>
                <Feather name="calendar" size={16} color="#666" />
                <Text style={styles.metadataText}>
                  Đăng ngày: {formatDate(blog.uploadDate)}
                </Text>
              </View>
            )}

            {blog.updateDate && (
              <View style={styles.metadataItem}>
                <Feather name="edit" size={16} color="#666" />
                <Text style={styles.metadataText}>
                  Cập nhật: {formatDate(blog.updateDate)}
                </Text>
              </View>
            )}

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Feather name="eye" size={16} color="#666" />
                <Text style={styles.statText}>{blog.view || 0} lượt xem</Text>
              </View>

              <View style={styles.statItem}>
                <Feather name="heart" size={16} color="#666" />
                <Text style={styles.statText}>{blog.like || 0} lượt thích</Text>
              </View>
            </View>
          </View>

          {blog.productId && (
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>
                Sản phẩm liên quan: #{blog.productId}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <Text style={styles.blogContent}>{blog.content}</Text>

          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                isLiked && styles.actionButtonActive,
              ]}
              onPress={handleLikeBlog}
            >
              <Feather
                name="heart"
                size={20}
                color={isLiked ? "#fff" : "#6C63FF"}
              />
              <Text
                style={[styles.actionText, isLiked && styles.actionTextActive]}
              >
                Thích
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShareBlog}
            >
              <Feather name="share-2" size={20} color="#6C63FF" />
              <Text style={styles.actionText}>Chia sẻ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1,
  },
  content: {
    padding: 16,
  },
  blogTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  blogContent: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  metadataContainer: {
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  metadataText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    marginLeft: 6,
    color: "#666",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 16,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#6C63FF",
  },
  actionButtonActive: {
    backgroundColor: "#6C63FF",
  },
  actionText: {
    marginLeft: 8,
    color: "#6C63FF",
    fontWeight: "bold",
  },
  actionTextActive: {
    color: "#fff",
  },
  productInfo: {
    backgroundColor: "#efefff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  productTitle: {
    fontWeight: "bold",
    color: "#444",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#FF6C63",
    marginTop: 8,
    textAlign: "center",
  },
  backButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: "#6C63FF",
    borderRadius: 8,
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  featuredImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: "#f0f0f0",
  },
});

export default BlogDetailScreen;
