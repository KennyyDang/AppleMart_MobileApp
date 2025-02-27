import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications'; // Expo Notifications
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
    let token;

    // expo - firebase
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'Default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            sound: 'default',
            enableVibrate: true,
        });
    }

    if (Device.isDevice) {
        // expo - firebase
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }

        try {
            // expo
            token = await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas?.projectId,
            });
            console.log('Push token:', token.data);

            /* firebase
            import messaging from '@react-native-firebase/messaging';
            token = await messaging.getToken();
            */
        } catch (error) {
            console.error('Error getting push token:', error);
        }
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}

// expo
export async function sendPushNotification(expoPushToken: string) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Test notification',
        body: 'This is a test notification',
        data: { someData: 'goes here' },
    };

    // expo
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

    /* firebase
    try {
        await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=YOUR_FCM_SERVER_KEY'
            },
            body: JSON.stringify({
                to: fcmToken,
                notification: {
                    title: message.title,
                    body: message.body,
                },
                data: message.data,
            })
        });
    } catch (error) {
        console.error('Error:', error);
    }
    */
}

export default {
    registerForPushNotificationsAsync,
    sendPushNotification,
};