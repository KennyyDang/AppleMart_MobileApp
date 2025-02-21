import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { User, Bell, Lock, SignOut } from 'phosphor-react-native';

const SettingScreen = () => {
  return (
    <View style={styles.container}>
      {/* User Profile */}
      <View style={styles.profileContainer}>
        <Image 
          source={{ uri: 'https://i.pravatar.cc/150?img=3' }} 
          style={styles.avatar} 
        />
        <View>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>johndoe@example.com</Text>
        </View>
      </View>

      {/* Settings Menu */}
      <View style={styles.menuContainer}>
        <MenuItem icon={<User size={24} color="#4A4A4A" />} title="Account" />
        <MenuItem icon={<Bell size={24} color="#4A4A4A" />} title="Notifications" />
        <MenuItem icon={<Lock size={24} color="#4A4A4A" />} title="Security" />
        <MenuItem icon={<SignOut size={24} color="red" />} title="Sign Out" color="red" />
      </View>
    </View>
  );
};

// Reusable Menu Item Component
const MenuItem = ({ icon, title, color = "#000" }) => (
  <TouchableOpacity style={styles.menuItem}>
    {icon}
    <Text style={[styles.menuText, { color }]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.5,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.5,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 15,
  },
});

export default SettingScreen;
