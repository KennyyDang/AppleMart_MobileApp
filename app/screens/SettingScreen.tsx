// app/screens/SettingScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SettingScreen = () => {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenText}>Settings</Text>
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

export default SettingScreen;