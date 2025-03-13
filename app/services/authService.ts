// src/services/authService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.2.23:5069';

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
                ['refreshToken', newRefreshToken]
            ]);
            return accessToken;
        } else {
            throw new Error('Invalid refresh token response');
        }
    } catch (error) {
        console.log('Refresh token error:', error);
        throw error;
    }
};

export const registerUser = async ({
    email,
    password,
    name,
}: {
    email: string;
    password: string;
    name: string;
}) => {
    try {
        const response = await axios.post(`${API_URL}/api/Account/Register`, {
            email,
            password,
            name,
        });

        if (response.status !== 200) {
            throw new Error(response.data?.message || 'Đăng ký thất bại');
        }

        return response.data;
    } catch (error) {
        console.log('Register error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
    }
};

