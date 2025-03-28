import React, { useState, useEffect, useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Animated } from "react-native";
import {
  Calendar,
  BookmarkSimple,
  Gear,
  AppleLogo,
  AlignBottom,
  AppWindow,
} from "phosphor-react-native";

import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync, sendPushNotification } from '../utils/notifications';
import NotificationApiService, { Notification } from '../services/NotificationApiService';

import ManageScreen from "../screens/ManageScreen";

import OrderScreen from "../screens/order/OrderScreen";
import OrderDetailScreen from "../screens/order/OrderDetailScreen";

import BlogScreen from "../screens/blogs/BlogScreen";
import AddBlogScreen from "../screens/blogs/AddBlogScreen";
import EditBlogScreen from "../screens/blogs/EditBlogScreen";
import BlogDetailScreen from "../screens/blogs/BlogDetailScreen";

import SettingScreen from "../screens/settings/SettingScreen";
import AccountScreen from "../screens/settings/AccountScreen";
import NotificationScreen from "@/screens/settings/NotificationScreen";

import LoginScreen from "../screens/login/LoginScreen";
import RegisterScreen from "../screens/login/RegisterScreen";

import { BlogPost } from "../services/BlogApiService";
import { TabBarProvider, useTabBar } from "./TabBarContext";


type BlogStackParamList = {
  BlogList: undefined;
  AddBlog: undefined;
  EditBlog: { blog: BlogPost };
  BlogDetail: { blogId: number };
};

type OrderStackParamList = {
  OrderList: undefined;
  OrderDetail: { orderId: number };
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const BlogStack = createStackNavigator<BlogStackParamList>();
const OrderStack = createStackNavigator<OrderStackParamList>();

const OrderStackNavigator = () => {
  return (
    <OrderStack.Navigator screenOptions={{ headerShown: false }}>
      <OrderStack.Screen name="OrderList" component={OrderScreen} />
      <OrderStack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </OrderStack.Navigator>
  );
};

const BlogStackNavigator = () => {
  return (
    <BlogStack.Navigator screenOptions={{ headerShown: false }}>
      <BlogStack.Screen name="BlogList" component={BlogScreen} />
      <BlogStack.Screen name="AddBlog" component={AddBlogScreen} />
      <BlogStack.Screen name="EditBlog" component={EditBlogScreen} />
      <BlogStack.Screen name="BlogDetail" component={BlogDetailScreen} />
    </BlogStack.Navigator>
  );
};

const MainTabNavigator = () => {
  const { isTabBarVisible } = useTabBar();
  const tabBarHeight = useRef(
    new Animated.Value(isTabBarVisible ? 1 : 0)
  ).current;

  useEffect(() => {
    Animated.timing(tabBarHeight, {
      toValue: isTabBarVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: false, 
    }).start();
  }, [isTabBarVisible, tabBarHeight]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: [
          styles.tabBar,
          {
            transform: [
              {
                translateY: tabBarHeight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }),
              },
            ],
            opacity: tabBarHeight,
            display: isTabBarVisible ? "flex" : "none",
          },
        ],
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#666",
        headerShown: false,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Manage"
        component={ManageScreen}
        options={{
          tabBarIcon: ({ color }) => <AlignBottom size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Order"
        component={OrderStackNavigator}
        options={{
          tabBarIcon: ({ color }) => <BookmarkSimple size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Blog"
        component={BlogStackNavigator}
        options={{
          tabBarIcon: ({ color }) => <AppleLogo size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          tabBarIcon: ({ color }) => <Gear size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const AppNavigator = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [lastCheckedNotificationId, setLastCheckedNotificationId] = useState(0);

  useEffect(() => {
    // Đăng ký push notifications
    async function setupPushNotifications() {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token.data);
      }
    }

    // Hàm kiểm tra và gửi notification mới
    async function checkNewNotifications() {
      try {
        console.log('Checking notifications...');
        console.log('Current Push Token:', expoPushToken);

        if (!expoPushToken) {
          console.log('No push token available. Skipping notification check.');
          return;
        }

        const notifications = await NotificationApiService.getNotifications();
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

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      const notificationId = response.notification.request.content.data.notificationId;
      console.log('Notification clicked:', notificationId);
    });

    const receivedListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification Received:', notification);
    });

    return () => {
      clearInterval(notificationInterval);
      responseListener.remove();
      receivedListener.remove();
    };
  }, [expoPushToken]);

  return (
    <TabBarProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Login"
          component={LoginScreen as React.ComponentType<any>}
        />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
      </Stack.Navigator>
    </TabBarProvider>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    elevation: 5,
    backgroundColor: "#fff",
    borderRadius: 20,
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
    borderTopWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default AppNavigator;
