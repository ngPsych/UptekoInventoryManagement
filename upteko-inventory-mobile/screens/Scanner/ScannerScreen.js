import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavBar } from '../../components/NavBar/NavBar';
import { QRCodeScanner } from '../../components/QRCodeScanner/QRCodeScanner';
import { startTimer, endTimer } from '../../utils/Timer';

export const ScannerScreen = ({ navigation }) => {
    startTimer('ScannerScreen render');

    const renderedScreen = (
        <View style={styles.container}>
            <View style={styles.content}>
                <QRCodeScanner />
            </View>
            <NavBar activeItem="Scanner" />
        </View>
    );

    endTimer('ScannerScreen render');
    return renderedScreen;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#666',
    },
    content: {
        flex: 1,
    },
});
