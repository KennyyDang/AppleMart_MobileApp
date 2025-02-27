import React, { useEffect, useRef, useState } from 'react';
import { registerRootComponent } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import * as Notifications from 'expo-notifications'; // expo
import { registerForPushNotificationsAsync } from './utils/notifications';
import { Alert } from 'react-native';

// expo
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const App = () => {
  // expo
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token.data);
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      const { title, body } = notification.request.content;
      if (title && body) {
        Alert.alert(title, body);
      }
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const { data } = response.notification.request.content;
      console.log('Notification tapped:', data);
    });

    /* firebase
    messaging().getToken().then(token => {
      console.log('FCM Token:', token);
    });

    messaging().onMessage(async remoteMessage => {
      Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background message:', remoteMessage);
    });
    */

    return () => {
      // expo
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return <AppNavigator />;
};

registerRootComponent(App);

export default App;