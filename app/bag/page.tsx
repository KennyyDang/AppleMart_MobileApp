import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BagScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bag</Text>
      
      <View style={styles.emptyStateContainer}>
        <Ionicons name="cart-outline" size={64} color="#86868b" />
        <Text style={styles.emptyStateTitle}>Your bag is empty.</Text>
        <Text style={styles.emptyStateSubtitle}>
          Continue browsing Apple Store or buy an item you've previously saved.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 40,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#86868b',
    textAlign: 'center',
    lineHeight: 22,
  },
}); 