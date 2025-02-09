import { Platform } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export function useTabBarHeight() {
  const height = useBottomTabBarHeight();
  return Platform.OS === 'ios' ? height : 0;
} 