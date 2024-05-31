import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { confirmSubAssembly } from '../../api/firebase/AssemblyManagement';
import { startTimer, endTimer } from '../../utils/Timer';

export const QRCodeScanner = () => {
  const [hasCameraPermission, setHasCameraPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();

  const handleBarCodeScanned = async ({ type, data }) => {
    startTimer("handleBarCodeScanner Render");
    if (!scanned) {
      setScanned(true);
      if (data.startsWith("CONFIRM:")) {
        const subAssemblyConfirmed = await confirmSubAssembly(
          parseAssemblyText(data).assemblyId, 
          parseAssemblyText(data).subAssemblyId, 
          parseAssemblyText(data).progressId, 
          "Alexander Nguyen" // Needs a function to track user that confirms
        );
        if (subAssemblyConfirmed) {
          Alert.alert(
            `Confirmed that ${parseAssemblyText(data).progressId} has been finalized`,
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  setScanned(false);
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert(
            'Error confirming. Please CHECK all materials!',
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  setScanned(false);
                },
              },
            ],
            { cancelable: false }
          );
        }
      } else if (validateItemNumber(data)) {
        navigation.navigate('PostScan', { currentScannedSKU: data });
        setScanned(false);
      } else {
        Alert.alert('INVALID ITEM NUMBER', 'Please scan a valid item number.');
      }
    }
    endTimer("handleBarCodeScanner Render")
  };

  const parseAssemblyText = (text) => {
    const parts = text.split(':');

    if (parts.length !== 4 || parts[0] !== 'CONFIRM') {
        throw new Error('Invalid QR code format');
    }

    // Extract necessary parts
    const [_, assemblyId, subAssemblyId, progressId] = parts;

    return {
        assemblyId,
        subAssemblyId,
        progressId
    };
  };

  const validateItemNumber = (data) => {
    // Define item number patterns
    const itemNumberPattern1 = /^P\d{4}$/; // P followed by 4 digits

    // Check if data matches any of the patterns
    return itemNumberPattern1.test(data);
  };
  
  if (!hasCameraPermission) {
    return <View />;
  }

  if (!hasCameraPermission.granted) {
    <View style={styles.container}>
      <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
      <Button onPress={setHasCameraPermission} title="grant permission" />
    </View>
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={'back'}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#666',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
});
