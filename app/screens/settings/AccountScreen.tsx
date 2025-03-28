import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/theme/ThemeContext';

const AccountScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchUser = async () => {
      const json = await AsyncStorage.getItem('currentUser');
      if (json) {
        const parsed = JSON.parse(json);
        setUser(parsed);
        setName(parsed.name);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      Alert.alert('Lỗi', 'Họ tên không được để trống.');
      return;
    }

    const updatedUser = { ...user, name: trimmedName };
    await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    Alert.alert('Thành công', 'Thông tin đã được cập nhật!');
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin tài khoản</Text>

      <Text style={styles.label}>Email</Text>
      <Text style={styles.text}>{user.userName}</Text>

      <Text style={styles.label}>Họ tên</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nhập họ tên..."
        />
      ) : (
        <Text style={styles.text}>{user.name}</Text>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: isEditing ? '#28a745' : '#007BFF' }]}
        onPress={isEditing ? handleSave : () => setIsEditing(true)}
      >
        <Text style={styles.buttonText}>{isEditing ? 'Lưu' : 'Chỉnh sửa'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20, color: '#333' },
  label: { fontSize: 14, color: '#555', marginTop: 10 },
  text: { fontSize: 16, marginTop: 4, color: '#000' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 16,
    marginTop: 4,
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AccountScreen;
