import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications'; // Expo Notifications
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
    let token;

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.error('Permission not granted!');
            alert('Failed to get push token for push notification!');
            return;
        }

        try {
            token = await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas?.projectId,
            });
            console.log('Push Token Details:', token);
            console.log('Push Token Data:', token.data);
        } catch (error) {
            console.error('Detailed Push Token Error:', error);
        }
    } else {
        console.warn('Push notifications only work on physical devices');
        alert('Must use physical device for Push Notifications');
    }

    return token;
}

export async function sendPushNotification(
    expoPushToken: string, 
    {
      title = 'Thông báo mới', 
      body = 'Bạn có thông báo mới', 
      data = {}
    } = {}
  ) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data,
    };
  
    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
  
      const result = await response.json();
      console.log('Push Notification Response:', result);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
}

export default {
    registerForPushNotificationsAsync,
    sendPushNotification,
};