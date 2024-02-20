import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { QRCodeScanner } from './components/QRCodeScanner/QRCodeScanner';

export default function App() {
  return (
    // <View style={styles.container}>
    //   {/* Render the QRCodeScanner component */}
    //   <QRCodeScanner />
    //   <StatusBar style="auto" />
    // </View>
    <QRCodeScanner/>
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
