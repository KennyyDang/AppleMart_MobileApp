import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { User, Bell, Lock, SignOut, Gear } from 'phosphor-react-native';

const SettingScreen = () => {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const json = await AsyncStorage.getItem('currentUser');
      if (json) {
        setCurrentUser(JSON.parse(json));
      }
    };
    fetchUser();
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
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title Section */}
      <View style={styles.headerBox}>
  <Text style={styles.title}>Cài đặt</Text>
  <Text style={styles.name}>{currentUser?.name || 'Người dùng'}</Text>
  <Text style={styles.email}>{currentUser?.userName || 'user@example.com'}</Text>
</View>


      {/* Menu Section */}
      <View style={styles.menuContainer}>
        <MenuItem icon={<User size={22} color="#555" />} title="Tài khoản" onPress={undefined} />
        <MenuItem icon={<Bell size={22} color="#555" />} title="Thông báo" onPress={undefined} />
        <MenuItem icon={<Lock size={22} color="#555" />} title="Bảo mật" onPress={undefined} />
        <MenuItem icon={<Gear size={22} color="#555" />} title="Cài đặt khác" onPress={undefined} />
        <MenuItem
          icon={<SignOut size={22} color="red" />}
          title="Đăng xuất"
          color="red"
          onPress={handleLogout}
        />
      </View>
    </ScrollView>
  );
};

const MenuItem = ({ icon, title, color = '#000', onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.iconBox}>{icon}</View>
    <Text style={[styles.menuText, { color }]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f6f8',
    padding: 20,
    flexGrow: 1,
  },
  headerBox: {
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    fontFamily: 'System',
  },
  subTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontFamily: 'System',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 2,
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
    fontFamily: 'System',
  },
  iconBox: {
    width: 30,
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    fontFamily: 'System',
  },
  email: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
    fontFamily: 'System',
  },
  
});

export default SettingScreen;
