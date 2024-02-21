import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { QRCodeScanner } from './components/QRCodeScanner/QRCodeScanner';
import { NavBar } from './components/NavBar/NavBar';

export default function App() {
  const [activeItem, setActiveItem] = useState('Inventory');

  const handleSelect = (item) => {
    setActiveItem(item);
    // Implement navigation logic here based on the selected item
  };

  return (
    // <View style={styles.container}>
    //   {/* Render the QRCodeScanner component */}
    //   <QRCodeScanner />
    //   <StatusBar style="auto" />
    // </View>
    
    <View>
      {/* <QRCodeScanner/> */}
      <NavBar activeItem={activeItem} onSelect={handleSelect} />
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
