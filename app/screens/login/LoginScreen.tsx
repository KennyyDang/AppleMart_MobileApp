import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Ionicons } from '@expo/vector-icons';

// Định nghĩa kiểu navigation
type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Register: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
}

const API_URL = 'https://api.apple-mart.capybara.pro.vn';
// const API_URL = 'http://172.20.10.2:5069';

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleLogin = async () => {
    // Validate input
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      // Detailed logging
      console.log("Login attempt:", { email, password });

      // Modify the login endpoint call to ensure proper data sending
      const response = await axios.post(`${API_URL}/api/Account/Login`, 
        { 
          email, 
          password 
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const { 
        accessToken = '', 
        refreshToken = '', 
        userID = '', 
        userName = '', 
        name = '' 
      } = response.data || {};

      // Validate tokens
      if (accessToken && refreshToken) {
        // Create user object
        const currentUser = {
          userID,
          userName,
          name
        };
      
        // Store multiple items securely
        await AsyncStorage.multiSet([ 
          ['accessToken', accessToken],
          ['refreshToken', refreshToken],
          ['currentUser', JSON.stringify(currentUser)]
        ]);

        // Verify storage (optional but helpful for debugging)
        const storedToken = await AsyncStorage.getItem('accessToken');

        // Navigate to main screen
        navigation.replace('Main');
      } else {
        // Handle case where tokens are missing
        Alert.alert('Lỗi', 'Không nhận được token xác thực. Vui lòng thử lại.');
      }
    } catch (error) {
      // Comprehensive error handling
      console.error('Login error details:', error);

      // Check if it's an axios error with response
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message 
          || error.response?.data 
          || 'Đăng nhập thất bại. Vui lòng kiểm tra kết nối.';
        
        Alert.alert('Lỗi Đăng Nhập', errorMessage);
      } else {
        // Generic error handling
        Alert.alert('Lỗi', 'Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    }
  };  

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("assets/Apple.png")} style={styles.logo} />

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

      {/* Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#7F7F7F"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureTextEntry}
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
