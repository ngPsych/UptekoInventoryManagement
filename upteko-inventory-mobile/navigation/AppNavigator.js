import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { InventoryScreen } from '../screens/Inventory/InventoryScreen';
import { AssemblyScreen } from '../screens/Assembly/AssemblyScreen';
import { ScannerNavigator } from './ScannerNavigator';
import { OrderScreen } from '../screens/Order/OrderScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { LoginScreen } from '../screens/Login/LoginScreen';
import { NavBar } from '../components/NavBar/NavBar';

const Stack = createStackNavigator();

export const AppNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{ animationEnabled: false }}>
                
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Inventory"
                component={InventoryScreen}
                options={{ headerLeft: null }}
            />
            <Stack.Screen
                name="Assembly"
                component={AssemblyScreen}
                options={{ headerLeft: null }}
            />
            <Stack.Screen
                name="Scanner"
                component={ScannerNavigator}
                options={{ headerLeft: null }}
            />
            <Stack.Screen
                name="Order"
                component={OrderScreen}
                options={{ headerLeft: null }}
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ headerLeft: null }}
            />
            <Stack.Screen
                name="NavBar"
                component={NavBar}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};
