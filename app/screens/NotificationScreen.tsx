import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { BellSimple, ChatText, ShoppingCart } from 'phosphor-react-native';
import { useTheme } from '@/theme/ThemeContext';

const mockNotifications = [
  {
    id: '1',
    icon: <BellSimple size={24} weight="bold" color="#4b7bec" />,
    title: 'Chào mừng bạn!',
    message: 'Cảm ơn bạn đã sử dụng ứng dụng của chúng tôi.',
    time: 'Vừa xong',
  },
  {
    id: '2',
    icon: <ShoppingCart size={24} weight="bold" color="#20bf6b" />,
    title: 'Đơn hàng mới',
    message: 'Bạn có một đơn hàng mới từ khách hàng A.',
    time: '2 giờ trước',
  },
  {
    id: '3',
    icon: <ChatText size={24} weight="bold" color="#eb3b5a" />,
    title: 'Tin nhắn mới',
    message: 'Bạn nhận được tin nhắn từ khách hàng B.',
    time: 'Hôm qua',
  },
];

const NotificationScreen = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, isDark && styles.darkBackground]}>
      <Text style={[styles.header, isDark && styles.darkText]}>Thông báo</Text>

      <FlatList
        data={mockNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, isDark && styles.darkCard]}>
            <View style={styles.iconContainer}>{item.icon}</View>
            <View style={styles.content}>
              <Text style={[styles.title, isDark && styles.darkText]}>{item.title}</Text>
              <Text style={[styles.message, isDark && styles.darkSubText]}>{item.message}</Text>
              <Text style={[styles.time, isDark && styles.darkSubText]}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 16,
  },
  darkBackground: {
    backgroundColor: '#1c1c1e',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#222',
  },
  darkText: {
    color: '#eee',
  },
  darkSubText: {
    color: '#aaa',
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  message: {
    fontSize: 14,
    marginTop: 4,
    color: '#666',
  },
  time: {
    fontSize: 12,
    marginTop: 4,
    color: '#999',
  },
});

export default NotificationScreen;
