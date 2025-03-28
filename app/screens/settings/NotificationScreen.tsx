import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';
import NotificationApiService, { Notification } from "../../services/NotificationApiService";

const NotificationScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setRefreshing(true);
    try {
      const fetchedNotifications = await NotificationApiService.getNotifications();
      // Sort notifications with unread notifications first
      const sortedNotifications = fetchedNotifications.sort((a, b) => 
        Number(a.isRead) - Number(b.isRead)
      );
      setNotifications(sortedNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.isRead) {
      const marked = await NotificationApiService.markNotificationAsRead(notification.notificationID);
      if (marked) {
        // Update local state to reflect read status
        setNotifications(prevNotifications => 
          prevNotifications.map(n => 
            n.notificationID === notification.notificationID 
              ? { ...n, isRead: true } 
              : n
          )
        );
      }
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => {
    return (
      <TouchableOpacity 
        style={[
          styles.notificationItem, 
          item.isRead ? styles.readNotification : styles.unreadNotification
        ]}
        onPress={() => handleNotificationPress(item)}
      >
        <View>
          <Text 
            style={[
              styles.notificationHeader, 
              item.isRead ? styles.readText : styles.unreadText
            ]}
          >
            {item.header}
          </Text>
          <Text 
            style={[
              styles.notificationContent, 
              item.isRead ? styles.readText : styles.unreadText
            ]}
            numberOfLines={2}
          >
            {item.content}
          </Text>
          <Text style={styles.notificationDate}>
            {new Date(item.createdDate).toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông Báo</Text>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.notificationID.toString()}
        refreshing={refreshing}
        onRefresh={fetchNotifications}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có thông báo</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  unreadNotification: {
    backgroundColor: '#f0f0ff', // Lighter blue for unread
  },
  readNotification: {
    backgroundColor: '#f9f9f9', // Very light gray for read
  },
  notificationHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  unreadText: {
    color: '#000', // Dark text for unread
    fontWeight: 'bold',
  },
  readText: {
    color: '#888', // Lighter text for read
  },
  notificationContent: {
    fontSize: 14,
    marginBottom: 5,
  },
  notificationDate: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default NotificationScreen;