import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Calendar, BookmarkSimple, Gear } from 'phosphor-react-native';
import ManageScreen from '../screens/ManageScreen';
import OrderScreen from '../screens/OrderScreen';
import SettingScreen from '../screens/SettingScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
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
          tabBarIcon: ({ color }) => (
            <Calendar size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Order"
        component={OrderScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <BookmarkSimple size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Gear size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = {
  tabBar: {
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
};

export default AppNavigator;