import React from 'react';
import { registerRootComponent } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import { ThemeProvider } from '@/theme/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
};

registerRootComponent(App);

export default App;