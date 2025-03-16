import { sendPushNotification } from './notifications';

export async function testNotification() {
    const expoPushToken = 'ExponentPushToken[CLcK2UMbOj8v8TB0UtzxQi]';

    try {
        await sendPushNotification(expoPushToken);
        console.log('Test notification sent!');
    } catch (error) {
        console.error('Error sending test notification:', error);
    }
}