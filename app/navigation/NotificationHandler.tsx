import React, { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import NotificationApiService, { Notification } from '../services/NotificationApiService';
import { registerForPushNotificationsAsync, sendPushNotification } from '../utils/notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NotificationManager() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [lastAddedNotificationID, setLastAddedNotificationID] = useState<number | null>(null);

  useEffect(() => {
    async function setupPushNotifications() {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token.data);
      }
    }

    async function checkNewNotifications() {
      try {
        if (!expoPushToken) {
          console.log('No push token available. Skipping notification check.');
          return;
        }

        const notifications = await NotificationApiService.getNotifications();

        
        // Filter only unread notifications
        const unreadNotifications = notifications.filter(n => n.isRead === false);


        if (unreadNotifications.length === 0) {
          console.log('No unread notifications');
          return;
        }

        // Sort unread notifications to get the newest
        const sortedUnreadNotifications = unreadNotifications.sort(
          (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );

        const newestUnreadNotification = sortedUnreadNotifications[0];

        // Check if this is a completely new notification
        if (
          newestUnreadNotification && 
          (!lastAddedNotificationID || newestUnreadNotification.notificationID > lastAddedNotificationID)
        ) {
          
          await sendPushNotification(expoPushToken, {
            title: newestUnreadNotification.header,
            body: newestUnreadNotification.content,
            data: { 
              notificationID: newestUnreadNotification.notificationID 
            }
          });
          setLastAddedNotificationID(newestUnreadNotification.notificationID);
        }

      } catch (error) {
        console.error('Error in checkNewNotifications:', error);
      }
    }

    setupPushNotifications();

    // Listener for when a notification is received while the app is open
    const receivedSubscription = Notifications.addNotificationReceivedListener(async notification => {
    });
  
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(async response => {
      
      try {
        // Trích xuất ID từ nhiều nguồn
        const notificationID = 
          response.notification.request.content.data?.notificationID ||
          response.notification.request.content.data?.id ||
          response.notification.request.identifier;
  
        if (notificationID) {
          const id = typeof notificationID === 'string' 
            ? parseInt(notificationID, 10) 
            : notificationID;
        }
      } catch (error) {
        console.error('Error handling notification response:', error);
      }
    });
  
    setupPushNotifications();
    const notificationInterval = setInterval(checkNewNotifications, 30000);
  
    return () => {
      clearInterval(notificationInterval);
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, [expoPushToken]);

  return null; 
}