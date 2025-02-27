import { sendPushNotification } from './notifications';

export async function testNotification() {
    const expoPushToken = 'ExponentPushToken[CLcK2UMbOj8v8TB0UtzxQi]'; // kiem cai nay` trong terminal lúc chạy expo

    try {
        await sendPushNotification(expoPushToken);
        console.log('Test notification sent!');
    } catch (error) {
        console.error('Error sending test notification:', error);
    }
} 