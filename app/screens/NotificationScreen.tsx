import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { BellSimple, ShoppingCart, Newspaper } from 'phosphor-react-native';
import { useTheme } from '@/theme/ThemeContext';
import { getNotifications, markAsRead } from '@/services/authService';
import { useNavigation } from '@react-navigation/native';

const NotificationScreen = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigation = useNavigation();
  const [combinedNotifications, setCombinedNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();

      // Thông báo từ bảng Notifications
      const dbNotifications = data.notifications || [];

      // Thông báo từ shippedOrders
      const shippedOrderNotifications = (data.shippedOrders || []).map((order) => {
        console.log('Processing shipped order:', order);
        return {
          notificationID: `shipped_order_${order.orderID}`,
          isRead: false,
          header: `Đơn hàng #${order.orderID} đã được vận chuyển`,
          content: `Đơn hàng của bạn đã được giao tới ${order.address}. Tổng tiền: ${order.total} VNĐ. Giao bởi: ${order.shipper || 'N/A'}.`,
          createdDate: order.orderDate,
          type: 'shipped_order',
          orderData: order,
        };
      });
      console.log('Shipped Order Notifications:', shippedOrderNotifications);

      // Thông báo từ userBlogViews
      const blogViewNotifications = (data.userBlogViews || []).map((view) => {
        console.log('Processing blog view:', view);
        const blog = view.blog || {};
        return {
          notificationID: `blog_view_${view.userBlogViewID}`,
          isRead: false,
          header: `Bài viết "${blog.title || 'Không có tiêu đề'}"`,
          content: `Bạn đã xem bài viết của ${blog.author || 'N/A'} vào ngày ${new Date(blog.uploadDate).toLocaleDateString()}.`,
          createdDate: blog.uploadDate || new Date().toISOString(),
          type: 'blog_view',
          blogData: blog,
        };
      });
      console.log('Blog View Notifications:', blogViewNotifications);

      // Thông báo từ recentBlogs
      const blogCreationNotifications = (data.recentBlogs || []).map((blog) => {
        console.log('Processing recent blog:', blog);
        return {
          notificationID: `blog_creation_${blog.blogID}`,
          isRead: false,
          header: `Bài viết mới: "${blog.title || 'Không có tiêu đề'}"`,
          content: `Bạn đã tạo bài viết vào ngày ${new Date(blog.uploadDate).toLocaleDateString()}.`,
          createdDate: blog.uploadDate || new Date().toISOString(),
          type: 'blog_creation',
          blogData: blog,
        };
      });
      console.log('Blog Creation Notifications:', blogCreationNotifications);

      // Thông báo từ orders (tất cả đơn hàng)
      const orderNotifications = (data.orders || []).map((order) => {
        console.log('Processing order:', order);
        return {
          notificationID: `order_${order.orderID}`,
          isRead: false,
          header: `Đơn hàng #${order.orderID} - Trạng thái: ${order.orderStatus}`,
          content: `Đơn hàng được đặt vào ngày ${new Date(order.orderDate).toLocaleDateString()}. Tổng tiền: ${order.total} VNĐ. Địa chỉ: ${order.address}.`,
          createdDate: order.orderDate,
          type: 'order',
          orderData: order,
        };
      });
      console.log('Order Notifications:', orderNotifications);

      // Kết hợp tất cả thông báo và sắp xếp theo ngày
      const allNotifications = [
        ...dbNotifications,
        ...shippedOrderNotifications,
        ...blogViewNotifications,
        ...blogCreationNotifications,
        ...orderNotifications,
      ].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      console.log('Combined Notifications:', allNotifications);

      setCombinedNotifications(allNotifications);
      setError(null);
    } catch (error) {
      if (error.message === 'No token found' || error.message === 'Unauthorized: Token refresh failed') {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => {
          navigation.replace('Login');
        }, 2000);
      } else {
        setError('Không thể tải thông báo. Vui lòng thử lại sau.');
      }
    }
  };

  const handlePress = async (notification) => {
    if (notification.type === 'shipped_order') {
      console.log('Navigating to shipped order details:', notification.orderData);
      // navigation.navigate('OrderDetail', { order: notification.orderData });
      setCombinedNotifications((prev) =>
        prev.map((n) =>
          n.notificationID === notification.notificationID ? { ...n, isRead: true } : n
        )
      );
    } else if (notification.type === 'order') {
      console.log('Navigating to order details:', notification.orderData);
      // navigation.navigate('OrderDetail', { order: notification.orderData });
      setCombinedNotifications((prev) =>
        prev.map((n) =>
          n.notificationID === notification.notificationID ? { ...n, isRead: true } : n
        )
      );
    } else if (notification.type === 'blog_view') {
      console.log('Navigating to blog details:', notification.blogData);
      // navigation.navigate('BlogDetail', { blog: notification.blogData });
      setCombinedNotifications((prev) =>
        prev.map((n) =>
          n.notificationID === notification.notificationID ? { ...n, isRead: true } : n
        )
      );
    } else if (notification.type === 'blog_creation') {
      console.log('Navigating to blog details:', notification.blogData);
      // navigation.navigate('BlogDetail', { blog: notification.blogData });
      setCombinedNotifications((prev) =>
        prev.map((n) =>
          n.notificationID === notification.notificationID ? { ...n, isRead: true } : n
        )
      );
    } else {
      try {
        await markAsRead(notification.notificationID);
        setCombinedNotifications((prev) =>
          prev.map((n) =>
            n.notificationID === notification.notificationID ? { ...n, isRead: true } : n
          )
        );
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
  };

  const renderIcon = (item) => {
    if (item.type === 'shipped_order' || item.type === 'order') {
      return <ShoppingCart size={24} weight="bold" color={item.isRead ? '#999' : '#4b7bec'} />;
    } else if (item.type === 'blog_view' || item.type === 'blog_creation') {
      return <Newspaper size={24} weight="bold" color={item.isRead ? '#999' : '#4b7bec'} />;
    }
    return <BellSimple size={24} weight="bold" color={item.isRead ? '#999' : '#4b7bec'} />;
  };

  if (error) {
    return (
      <View style={[styles.container, isDark && styles.darkBackground]}>
        <Text style={[styles.header, isDark && styles.darkText]}>Thông báo</Text>
        <Text style={[styles.message, isDark && styles.darkSubText]}>{error}</Text>
        {error.includes('đăng nhập') ? null : (
          <TouchableOpacity onPress={fetchNotifications} style={styles.retryButton}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (!combinedNotifications.length) {
    return (
      <View style={[styles.container, isDark && styles.darkBackground]}>
        <Text style={[styles.header, isDark && styles.darkText]}>Thông báo</Text>
        <Text style={[styles.message, isDark && styles.darkSubText]}>
          Không có thông báo nào.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.darkBackground]}>
      <Text style={[styles.header, isDark && styles.darkText]}>Thông báo</Text>
      <TouchableOpacity onPress={fetchNotifications} style={styles.refreshButton}>
        <Text style={styles.refreshText}>Làm mới</Text>
      </TouchableOpacity>
      <FlatList
        data={combinedNotifications}
        keyExtractor={(item) => item.notificationID.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, isDark && styles.darkCard]}
            onPress={() => handlePress(item)}
          >
            <View style={styles.iconContainer}>{renderIcon(item)}</View>
            <View style={styles.content}>
              <Text
                style={[styles.title, isDark && styles.darkText, !item.isRead && styles.unreadText]}
              >
                {item.header}
              </Text>
              <Text style={[styles.message, isDark && styles.darkSubText]}>{item.content}</Text>
              <Text style={[styles.time, isDark && styles.darkSubText]}>
                {new Date(item.createdDate).toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8', padding: 16 },
  darkBackground: { backgroundColor: '#1c1c1e' },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#222' },
  darkText: { color: '#eee' },
  darkSubText: { color: '#aaa' },
  unreadText: { fontWeight: 'bold', color: '#000' },
  card: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  darkCard: { backgroundColor: '#2c2c2e' },
  iconContainer: { marginRight: 16, justifyContent: 'center' },
  content: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', color: '#333' },
  message: { fontSize: 14, marginTop: 4, color: '#666' },
  time: { fontSize: 12, marginTop: 4, color: '#999' },
  retryButton: {
    backgroundColor: '#4b7bec',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: '#4b7bec',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  refreshText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NotificationScreen;