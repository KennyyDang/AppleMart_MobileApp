// app/screens/ManageScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';

const ManageScreen = () => {
  return (
    <View style={styles.screenContainer}>
      <Header title="Manage" />
      <Text style={styles.screenText}>Manage Products</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  screenText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ManageScreen;