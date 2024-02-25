import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavBar } from './components/NavBar/NavBar';
import { AppNavigator } from './navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  const [activeItem, setActiveItem] = useState('Inventory');

  const handleSelect = (item) => {
    setActiveItem(item);
    // Implement navigation logic here based on the selected item
  };

  return (
    <NavigationContainer>
      <AppNavigator />
      <NavBar />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
