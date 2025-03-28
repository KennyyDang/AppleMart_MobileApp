import React, { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import NotificationApiService, { Notification } from '../services/NotificationApiService';
import { registerForPushNotificationsAsync, sendPushNotification } from '../utils/notifications';

// Cấu hình cách hiển thị notification
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NotificationManager() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [lastCheckedNotificationId, setLastCheckedNotificationId] = useState(0);

  useEffect(() => {
    // Đăng ký push notifications khi component mount
    async function setupPushNotifications() {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token.data);
      }
    }

    async function checkNewNotifications() {
      try {
        console.log('Checking notifications...');
        console.log('Current Push Token:', expoPushToken);
    
        if (!expoPushToken) {
          console.log('No push token available. Skipping notification check.');
          return;
        }
    
        const notifications = await NotificationApiService.getNotifications();
        
        // Add this check
        if (!notifications || notifications.length === 0) {
          console.log('No notifications found or API returned empty array');
          return;
        }
    
        console.log('Total notifications:', notifications.length);
        
        const newNotifications = notifications.filter(
          notification => 
            notification.notificationID > lastCheckedNotificationId && 
            !notification.isRead
        );
    
        console.log('New unread notifications:', newNotifications.length);
      
          for (const notification of newNotifications) {
            console.log('Sending push notification:', notification);
            
            await sendPushNotification(expoPushToken, {
              title: notification.header,
              body: notification.content,
              data: { notificationId: notification.notificationID }
            });
      
            setLastCheckedNotificationId(notification.notificationID);
          }
        } catch (error) {
          console.error('Error in checkNewNotifications:', error);
        }
      }

    setupPushNotifications();
    const notificationInterval = setInterval(checkNewNotifications, 30000); 

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const notificationId = response.notification.request.content.data.notificationId;
      console.log('Notification clicked:', notificationId);
    });

    // Dọn dẹp khi component unmount
    return () => {
      clearInterval(notificationInterval);
      subscription.remove();
    };
  }, [expoPushToken]);

  return null; // Component này chỉ xử lý logic, không render gì
}