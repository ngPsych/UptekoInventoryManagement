import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';

export const QRCodeScanner = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);
  const [lastScanTimestamp, setLastScanTimestamp] = useState(0);


  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === 'granted');
    })();
  }, []);

  const handleScanButtonPress = () => {
    // If already scanning, first stop scanning, then restart scanning after a short delay
    if (isScanning) {
      setIsScanning(false);
      setTimeout(() => setIsScanning(true), 100); // Restart scanning after a brief pause
    } else {
      setIsScanning(true);
    }
  
    // Ensure the scanned state is reset
    setScanned(false);
  };
  
  const handleBarCodeScanned = ({ type, data }) => {
    if (!scanned) {
      setScanned(true);
      alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  
      // Reset the scanned state immediately
      setScanned(false);
  
      // Stop scanning after a successful scan
      setIsScanning(false);
  
      // Optionally, restart scanning after a brief pause
      setTimeout(() => setIsScanning(true), 100);
    }
  };
  

  if (hasCameraPermission === null) {
    return <View />;
  }

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={cameraRef}
        onBarCodeScanned={isScanning && !scanned ? handleBarCodeScanned : undefined}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleScanButtonPress}>
          <Text style={styles.buttonText}>{isScanning ? 'Scanning...' : 'Scan'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    borderRadius: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  button: {
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 5,
    padding: 10,
    backgroundColor: 'white',
  },
  buttonText: {
    color: 'blue',
    fontSize: 16,
  },
});
