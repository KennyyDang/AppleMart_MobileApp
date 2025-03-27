// services/authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const API_URL = 'https://api.apple-mart.capybara.pro.vn';


const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) throw new Error('No access token found');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};


export const refreshToken = async () => {
    try {
        const token = await AsyncStorage.getItem('refreshToken');

        if (!token) throw new Error('No refresh token found');

        const response = await axios.post(`${API_URL}/api/Account/RefreshToken`, {
            refreshToken: token,
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
    } catch (error) {
        console.log('Refresh token error:', error);
        throw error;
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
