import React from 'react';
import { Text, TextProps } from 'react-native';
import { useColorScheme } from 'react-native';

interface ThemedTextProps extends TextProps {
  type?: 'title' | 'subtitle' | 'defaultSemiBold' | 'default';
}

export function ThemedText(props: ThemedTextProps) {
  const { style, type = 'default', ...otherProps } = props;
  const colorScheme = useColorScheme();

  const color = colorScheme === 'dark' ? '#fff' : '#000';

  return (
    <Text
      style={[{ color }, style]}
      {...otherProps}
    />
  );
} 