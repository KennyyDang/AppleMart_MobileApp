// src/services/authService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.1.11:5069';


export const refreshToken = async () => {
    try {
        const token = await AsyncStorage.getItem('refreshToken');

        if (!token) throw new Error('No refresh token found');

        const response = await axios.post(`${API_URL}/api/Account/RefreshToken`, {
            refreshToken: token
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        if (accessToken && newRefreshToken) {
            await AsyncStorage.multiSet([
                ['accessToken', accessToken],
                ['refreshToken', newRefreshToken],                
            ]);
            return accessToken;
        } else {
            throw new Error('Invalid refresh token response');
        }
    } catch (error: any) {
        console.log('Refresh token error:', error);
        throw error;
    }
};

export const registerUser = async ({
    name,
    email,
    password,
    confirmPassword,
}: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}) => {
    try {
        const response = await axios.post(`${API_URL}/api/Account/Register`, {
            name,
            email,
            password,
            confirmPassword,
        });

        if (response.status !== 200) {
            throw new Error(response.data?.message || 'Đăng ký thất bại');
        }

        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.log('Register error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
        } else {
            console.log('Register error:', (error as Error).message);
            throw new Error('Đăng ký thất bại');
        }
    }
};

export const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
      console.log('Logged out successfully.');
    } catch (error) {
      console.log('Logout error:', error);
      throw error;
    }
  };

export const getCurrentUser = async () => {
    try {
      const json = await AsyncStorage.getItem('currentUser');
      return json ? JSON.parse(json) : null;
    } catch (error) {
      console.log('Lỗi khi lấy user từ storage:', error);
      return null;
    }
  };
  


