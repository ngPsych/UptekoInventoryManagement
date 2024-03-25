import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

export const QRCodeScanner = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isScanningEnabled, setIsScanningEnabled] = useState(false); // Initially disable scanning
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    if (!scanned) {
      setScanned(true);
      setIsScanningEnabled(false); // Disable scanning after successful scan
      if (data.startsWith("CONFIRM:")) {
        Alert.alert(`Code: ${parseAssemblyText(data).code}, User: ${parseAssemblyText(data).currentUserFullName}`)
      }
      // if (validateItemNumber(data)) {
      //   navigation.navigate('PostScan', { currentScannedSKU: data }); // Pass data as parameter
      // } 
      else {
        Alert.alert('INVALID ITEM NUMBER', 'Please scan a valid item number.');
      }
    }
  };

  const parseAssemblyText = (text) => {
    const parts = text.split(':');

    // Extract necessary parts
    const [confirm, assemblyId, subAssemblyId, fullName] = parts;

    // Extract first characters of LA code and A code
    const assemblyIdFirstChar = assemblyId.charAt(0);
    const subAssemblyIdFirstChar = subAssemblyId.charAt(0);

    // Concatenate the first characters of LA code and A code
    const code = assemblyIdFirstChar + subAssemblyIdFirstChar;

    // Extract the full name
    const currentUserFullName = fullName.trim();

    return {
      code,
      currentUserFullName
    };
  }

  const validateItemNumber = (data) => {
    // Define your item number patterns
    const itemNumberPattern1 = /^P\d{6}$/; // P followed by 6 digits
    const itemNumberPattern2 = /^A\d{6}$/; // A followed by 6 digits

    // Check if data matches any of the patterns
    return itemNumberPattern1.test(data) || itemNumberPattern2.test(data);
  };

  const toggleScanning = () => {
    setIsScanningEnabled(!isScanningEnabled);
    setScanned(false);
  };
  
  if (hasCameraPermission === null) {
    return <View />;
  }

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!isScanningEnabled && <Text style={styles.text}>Click Scan to start scanning QR Code</Text>}
      {isScanningEnabled && (
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          ref={cameraRef}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
      )}
      <TouchableOpacity style={styles.buttonContainer} onPress={toggleScanning}>
        <Text style={styles.buttonText}>{isScanningEnabled ? 'Scanning' : 'Scan'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
    alignItems: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 70,
    alignSelf: 'center',
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  text: {
    backgroundColor: 'white',
    padding: 10,
    textAlign: 'center',
  },
});
