import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, BookmarkSimple, Gear } from 'phosphor-react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import OrderScreen from '../screens/OrderScreen'; // Đã import đúng
import SettingScreen from '../screens/SettingScreen'; // Đã import đúng

const screenWidth = Dimensions.get('window').width;

const Tab = createBottomTabNavigator();

const ManageScreen = () => {
  const data = [
    { name: 'Red', population: 40, color: 'red', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Yellow', population: 30, color: 'yellow', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Blue', population: 20, color: 'blue', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Green', population: 10, color: 'green', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  ];

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.header}>Manage screen</Text>
      <PieChart
        data={data}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        absolute
      />
    </View>
  );
};

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
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />, 
        }}
      />
      <Tab.Screen
        name="Order"
        component={OrderScreen} // Thay View bằng OrderScreen
        options={{
          tabBarIcon: ({ color }) => <BookmarkSimple size={24} color={color} />, 
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen} // Thay View bằng SettingScreen
        options={{
          tabBarIcon: ({ color }) => <Gear size={24} color={color} />, 
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
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
    fontWeight: '500',
  },
});

export default AppNavigator;
