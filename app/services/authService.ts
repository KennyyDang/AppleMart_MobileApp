// services/authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.2.15:5069';


const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) throw new Error('No access token found');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};

const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        console.log('Retrieved token:', token);
        return token;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

export const getNotifications = async () => {
    try {
        let token = await getToken();
        if (!token) {
            console.error('No token found');
            throw new Error('No token found');
        }

        console.log('Sending request with token:', token);

        const response = await fetch(`${API_URL}/api/Notification`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error('API request failed with status:', response.status, response.statusText);
            const text = await response.text();
            console.error('Response content:', text);

            if (response.status === 401) {
                try {
                    token = await refreshToken();
                    console.log('New token after refresh:', token);

                    const retryResponse = await fetch(`${API_URL}/api/Notification`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!retryResponse.ok) {
                        console.error('Retry request failed with status:', retryResponse.status, retryResponse.statusText);
                        const retryText = await retryResponse.text();
                        console.error('Retry response content:', retryText);
                        throw new Error(`Retry request failed with status ${retryResponse.status}`);
                    }

                    const retryText = await retryResponse.text();
                    console.log('Retry raw response:', retryText);

                    if (!retryText) {
                        console.error('Retry response is empty');
                        return { notifications: [], shippedOrders: [], userBlogViews: [], recentBlogs: [], orders: [] };
                    }

                    const retryData = JSON.parse(retryText);
                    if (!retryData || typeof retryData !== 'object') {
                        console.error('Invalid retry API response:', retryData);
                        return { notifications: [], shippedOrders: [], userBlogViews: [], recentBlogs: [], orders: [] };
                    }

                    const notifications = retryData.$values || retryData.notifications || [];
                    const shippedOrders = retryData.shippedOrders || [];
                    const userBlogViews = retryData.userBlogViews || [];
                    const recentBlogs = retryData.recentBlogs || [];
                    const orders = retryData.orders || [];

                    return {
                        notifications: Array.isArray(notifications) ? notifications : [],
                        shippedOrders: Array.isArray(shippedOrders) ? shippedOrders : [],
                        userBlogViews: Array.isArray(userBlogViews) ? userBlogViews : [],
                        recentBlogs: Array.isArray(recentBlogs) ? recentBlogs : [],
                        orders: Array.isArray(orders) ? orders : [],
                    };
                } catch (refreshError) {
                    console.error('Failed to refresh token:', refreshError);
                    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
                    throw new Error('Unauthorized: Token refresh failed');
                }
            }

            throw new Error(`API request failed with status ${response.status}`);
        }

        const text = await response.text();
        console.log('Raw response:', text);

        if (!text) {
            console.error('Response is empty');
            return { notifications: [], shippedOrders: [], userBlogViews: [], recentBlogs: [], orders: [] };
        }

        const data = JSON.parse(text);
        if (!data || typeof data !== 'object') {
            console.error('Invalid API response:', data);
            return { notifications: [], shippedOrders: [], userBlogViews: [], recentBlogs: [], orders: [] };
        }

        const notifications = data.$values || data.notifications || [];
        const shippedOrders = data.shippedOrders || [];
        const userBlogViews = data.userBlogViews || [];
        const recentBlogs = data.recentBlogs || [];
        const orders = data.orders || [];

        return {
            notifications: Array.isArray(notifications) ? notifications : [],
            shippedOrders: Array.isArray(shippedOrders) ? shippedOrders : [],
            userBlogViews: Array.isArray(userBlogViews) ? userBlogViews : [],
            recentBlogs: Array.isArray(recentBlogs) ? recentBlogs : [],
            orders: Array.isArray(orders) ? orders : [],
        };
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return { notifications: [], shippedOrders: [], userBlogViews: [] };
    }
};

export const markAsRead = async (id) => {
    try {
        const token = await getToken();
        if (!token) {
            console.error('No token found');
            throw new Error('No token found');
        }

        const response = await fetch(`${API_URL}/api/Notification/${id}/markAsRead`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error('API request failed with status:', response.status, response.statusText);
            const text = await response.text();
            console.error('Response content:', text);
            throw new Error(`API request failed with status ${response.status}`);
        }
    } catch (error) {
        console.error('Error marking as read:', error);
    }
};

export const refreshToken = async () => {
    try {
        const token = await AsyncStorage.getItem('refreshToken');
        if (!token) throw new Error('No refresh token found');

        const response = await axios.post(`${API_URL}/api/Account/RefreshToken`, {
            refreshToken: token,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data as {
            accessToken: string;
            refreshToken: string;
        };

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

export const registerUser = async ({ name, email, password, confirmPassword }) => {
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
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('Register error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
        } else {
            console.log('Register error:', error.message);
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
