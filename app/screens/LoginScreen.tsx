import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Ionicons } from '@expo/vector-icons'; // Import icon để bật/tắt mật khẩu

// Định nghĩa kiểu navigation
type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
}

const API_URL = 'http://192.168.2.23:5069';


const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true); // Trạng thái ẩn/hiện mật khẩu

  const handleLogin1 = () => {
    navigation.replace('Main');
  };

  const handleLogin = async () => {
    console.log("Trying to login with:", email, password);
    try {
      const response = await axios.post(`${API_URL}/api/Account/Login`, { email, password });


      console.log('API response:', response.data);

      const { accessToken, refreshToken, userID, userName, name } = response.data;

      if (accessToken && refreshToken) {
        // Lưu vào AsyncStorage
        await AsyncStorage.multiSet([
          ['accessToken', accessToken],
          ['refreshToken', refreshToken],
          ['userID', userID],
          ['userName', userName],
          ['name', name]
        ]);

        // Điều hướng sang trang chính
        navigation.replace('Main');
      } else {
        Alert.alert('Lỗi', 'Thông tin đăng nhập không hợp lệ!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Sai email hoặc mật khẩu. Vui lòng thử lại!';
      console.log('Login error:', errorMessage);
      Alert.alert('Lỗi', errorMessage);
    }
  };



  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../../assets/Apple.png')} style={styles.logo} />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#7F7F7F"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input với Icon để hiển thị mật khẩu */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#7F7F7F"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureTextEntry} // Ẩn/hiện mật khẩu
        />
        <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
          <Ionicons
            name={secureTextEntry ? 'eye-off' : 'eye'}
            size={24}
            color="#7F7F7F"
          />
        </TouchableOpacity>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotText}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton1} onPress={handleLogin1}>
        <Text style={styles.loginText}>Login as Guest</Text>
      </TouchableOpacity>

      {/* Sign Up */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.signupText}>
          Bạn không có tài khoản? <Text style={{ fontWeight: 'bold' }}>Đăng ký</Text>
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: '50%',
    height: undefined,
    aspectRatio: 1,
    marginBottom: 50,
    resizeMode: 'contain',
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#F0EAFB',
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    height: 50,
    backgroundColor: '#F0EAFB',
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    height: 50,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginRight: '10%',
    marginBottom: 20,
  },
  forgotText: {
    color: '#555',
    fontSize: 14,
  },
  loginButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 20,
  },
  loginButton1: {
    width: '80%',
    height: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 20,
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupText: {
    color: '#333',
    fontSize: 14,
  },
});
