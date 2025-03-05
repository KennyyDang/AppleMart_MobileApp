import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BlogScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blog Screen</Text>
      <Text style={styles.content}>Nội dung blog sẽ hiển thị tại đây.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: '#666',
  },
});

export default BlogScreen;
