import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavBar } from '../../components/NavBar/NavBar';
import { QRCodeScanner } from '../../components/QRCodeScanner/QRCodeScanner';

export const ScannerScreen = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <QRCodeScanner />
            </View>
            <NavBar activeItem="Scanner" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});
