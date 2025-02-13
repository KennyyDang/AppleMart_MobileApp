import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { Calendar, BookmarkSimple, Gear } from 'phosphor-react-native';

const Tab = createBottomTabNavigator();

// Manage Screen Component
function ManageScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenText}>Manage Products</Text>
    </View>
  );
}

// Order Screen Component
function OrderScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenText}>Orders</Text>
    </View>
  );
}

// Setting Screen Component
function SettingScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenText}>Settings</Text>
    </View>
  );
}

export default function App() {
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
}

const styles = StyleSheet.create({
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
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  screenText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});