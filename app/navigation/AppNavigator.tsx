import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { Calendar, BookmarkSimple, Gear, AppleLogo, AlignBottom, AppWindow } from 'phosphor-react-native';

import ManageScreen from '../screens/ManageScreen';
import SettingScreen from '../screens/SettingScreen';
import AccountScreen from '../screens/AccountScreen'; 
import NotificationScreen from '@/screens/NotificationScreen';
import LoginScreen from '../screens/LoginScreen'; 
import RegisterScreen from '../screens/RegisterScreen'; 


import OrderScreen from '../screens/order/OrderScreen';
import OrderDetailScreen from '../screens/order/OrderDetailScreen';

import BlogScreen from '../screens/blogs/BlogScreen'; 
import AddBlogScreen from '../screens/blogs/AddBlogScreen'; 

import EditBlogScreen from '../screens/blogs/EditBlogScreen';
import BlogDetailScreen from '../screens/blogs/BlogDetailScreen';
import { BlogPost } from '../services/BlogApiService';

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

// Tạo Bottom Tab Navigator cho màn hình chính
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#666',
        headerShown: false,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
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

const AppNavigator = () => {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen as React.ComponentType<any>} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
      </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    elevation: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default AppNavigator;