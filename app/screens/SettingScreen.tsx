import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { User, Bell, Lock, SignOut } from 'phosphor-react-native';
import { useTheme } from '@/theme/ThemeContext';

const SettingScreen = () => {
  const navigation = useNavigation<any>();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const loadSettings = async () => {
      const json = await AsyncStorage.getItem('currentUser');
      if (json) setCurrentUser(JSON.parse(json));
    };
    loadSettings();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'currentUser']);
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      console.log('Logout error:', error);
      Alert.alert('Đăng xuất thất bại', 'Có lỗi xảy ra khi đăng xuất.');
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, isDark && styles.darkBackground]}>
      <View style={styles.headerBox}>
        <Text style={[styles.title, isDark && styles.darkText]}>Cài đặt</Text>
        <Text style={[styles.name, isDark && styles.darkText]}>{currentUser?.name || 'Người dùng'}</Text>
        <Text style={[styles.email, isDark && styles.darkSubText]}>{currentUser?.userName || 'user@example.com'}</Text>
      </View>

      <View style={[styles.menuContainer, isDark && styles.darkCard]}>
        <MenuItem
          icon={<User size={22} color={isDark ? '#ddd' : '#555'} />}
          title="Tài khoản"
          onPress={() => navigation.navigate('Account')}
          dark={isDark} renderRight={undefined} />
        <MenuItem
          icon={<Bell size={22} color={isDark ? '#ddd' : '#555'} />}
          title="Thông báo"
          onPress={() => navigation.navigate('Notification')}
          dark={isDark} renderRight={undefined} />
        <MenuItem
          icon={<Lock size={22} color={isDark ? '#ddd' : '#555'} />}
          title="Dark Mode"
          dark={isDark}
          renderRight={<Switch value={isDark} onValueChange={toggleTheme} />} onPress={undefined} />
        <MenuItem
          icon={<SignOut size={22} color="red" />}
          title="Đăng xuất"
          color="red"
          onPress={handleLogout}
          dark={isDark} renderRight={undefined} />
      </View>
    </ScrollView>
  );
};

const MenuItem = ({ icon, title, color = '#000', onPress, renderRight, dark = false }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={onPress ? 0.6 : 1}>
    <View style={styles.iconBox}>{icon}</View>
    <Text style={[styles.menuText, { color: color || (dark ? '#eee' : '#000') }]}>{title}</Text>
    {renderRight && <View style={{ marginLeft: 'auto' }}>{renderRight}</View>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f6f8',
    padding: 20,
    flexGrow: 1,
  },
  darkBackground: {
    backgroundColor: '#1c1c1e',
  },
  headerBox: {
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  email: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  darkText: {
    color: '#eee',
  },
  darkSubText: {
    color: '#aaa',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 2,
  },
  darkCard: {
    backgroundColor: '#2c2c2e',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '500',
  },
  iconBox: {
    width: 30,
    alignItems: 'center',
  },
});

export default SettingScreen;
