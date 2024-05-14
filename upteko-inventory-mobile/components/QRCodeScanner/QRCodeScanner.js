import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { confirmSubAssembly } from '../../api/firebase/AssemblyManagement';

export const QRCodeScanner = () => {
  const [hasCameraPermission, setHasCameraPermission] = useCameraPermissions();//useState(false);
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  console.log("CAMERA", Camera);

  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Camera.requestCameraPermissionsAsync();
  //     console.log(status === 'granted');
  //     setHasCameraPermission(status === 'granted');
  //   })();
  // }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (!scanned) {
      setScanned(true);
      if (data.startsWith("CONFIRM:")) {
        console.log(data);
        const subAssemblyConfirmed = await confirmSubAssembly(
          parseAssemblyText(data).assemblyId, 
          parseAssemblyText(data).subAssemblyId, 
          parseAssemblyText(data).progressId, 
          "Alexander Nguyen" // Needs a function to get current user full name
        );
        console.log(parseAssemblyText(data).progressId);
        console.log("confirmed", subAssemblyConfirmed);
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
        navigation.navigate('PostScan', { currentScannedSKU: data }); // Pass data as parameter
        setScanned(false);
      } else {
        Alert.alert('INVALID ITEM NUMBER', 'Please scan a valid item number.');
      }
    }
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
    // Define your item number patterns
    const itemNumberPattern1 = /^P\d{4}$/; // P followed by 4 digits

    // Check if data matches any of the patterns
    return itemNumberPattern1.test(data);
  };
  
  if (!hasCameraPermission) {
    return <View />;
  }

  if (!hasCameraPermission.granted) {
    // return <Text>No access to camera</Text>;
    <View style={styles.container}>
      <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
      <Button onPress={setHasCameraPermission} title="grant permission" />
    </View>
  }

  return (
    <View style={styles.container}>
      {/* <Camera
        style={styles.camera}
        type={"back"}
        ref={cameraRef}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      /> */}
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
