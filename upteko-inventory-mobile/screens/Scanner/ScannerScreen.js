import React from 'react';
import { View } from 'react-native';
import { QRCodeScanner } from '../../components/QRCodeScanner/QRCodeScanner';

export const ScannerScreen = ({ navigation }) => {
    return (
        <View style={{ flex: 1 }}>
            <QRCodeScanner />
        </View>
    );
};