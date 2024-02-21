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
    if (isScanning) {
      setIsScanning(false);
      setTimeout(() => setIsScanning(true), 100);
    } else {
      setIsScanning(true);
    }
    setScanned(false);
  };
  
  const handleBarCodeScanned = ({ type, data }) => {
    if (!scanned) {
      setScanned(true);
      alert(`Bar code with type ${type} and data ${data} has been scanned!`);
      setScanned(false);
      setIsScanning(false);
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
    justifyContent: 'flex-end', // Align content at the bottom
  },
  camera: {
    ...StyleSheet.absoluteFillObject, // Fill the entire container
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 80, // Adjust this value as per your preference
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
