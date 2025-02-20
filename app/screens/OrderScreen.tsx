// app/screens/OrderScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OrderScreen = () => {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenText}>Orders</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default OrderScreen;