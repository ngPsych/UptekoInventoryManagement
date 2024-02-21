import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { InventoryScreen } from '../screens/Inventory/InventoryScreen';
import { AssemblyScreen } from '../screens/Assembly/AssemblyScreen';
import { ScannerScreen } from '../screens/Scanner/ScannerScreen';
import { OrderScreen } from '../screens/Order/OrderScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';

const Stack = createStackNavigator();

export const AppNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                animationEnabled: false
            }}
        >
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
                component={ScannerScreen}
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
        </Stack.Navigator>
    );
};
