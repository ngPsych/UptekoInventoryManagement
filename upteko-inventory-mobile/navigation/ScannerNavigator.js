import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ScannerScreen } from '../screens/Scanner/ScannerScreen';
import { PostScanScreen } from '../screens/Scanner/PostScanScreen';

const Scanner = createStackNavigator();

export const ScannerNavigator = () => {
    return (
        <Scanner.Navigator
            screenOptions={{ animationEnabled: false }}>

            <Scanner.Screen
                name="QRScanner"
                component={ScannerScreen}
                options={{ headerShown: false }}
            />
            <Scanner.Screen
                name="PostScan"
                component={PostScanScreen}
                options={{ headerShown: false }}
            />
        </Scanner.Navigator>
    );
};