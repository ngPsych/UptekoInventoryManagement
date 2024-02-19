import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Button, Dimensions } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export const QRCodeScanner = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);
  // const [scanned, setScanned] = useState(false);
  // const [data, setData] = useState('');

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === 'granted');
    })();
  }, [])

  if (hasCameraPermission === false) {
    return <View>No access to camera</View>
  }

  const { width, height } = Dimensions.get('window');

  return (
    <View>
      <Camera
        style={{width:width, height:height}}
        type={type}
        flashMode={flash}
        ref={cameraRef}>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },

  camera: {
    flex: 1,
    borderRadius: 20,
  }
})
