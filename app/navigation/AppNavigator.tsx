import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { Calendar, BookmarkSimple, Gear } from 'phosphor-react-native';

// Import màn hình
import ManageScreen from '../screens/ManageScreen';
import OrderScreen from '../screens/OrderScreen';
import SettingScreen from '../screens/SettingScreen';
import LoginScreen from '../screens/LoginScreen'; 
import BlogScreen from '../screens/BlogScreen'; 
// import RegisterScreen from '../screens/RegisterScreen';



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />, 
        }}
      />
      <Tab.Screen
        name="Order"
        component={OrderScreen}
        options={{
          tabBarIcon: ({ color }) => <BookmarkSimple size={24} color={color} />, 
        }}
      />
      <Tab.Screen
        name="Blog"
        component={BlogScreen}
        options={{
        tabBarIcon: ({ color }) => <BookmarkSimple size={24} color={color} />, 
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

// Tạo Stack Navigator để điều hướng từ LoginScreen vào MainTabNavigator
const AppNavigator = () => {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        {/* <Stack.Screen name="Register" component={RegisterScreen} /> */}
        <Stack.Screen name="Main" component={MainTabNavigator} />
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
    fontWeight: '600', // ✅ Thay thế giá trị hợp lệ
  },
});


export default AppNavigator;
