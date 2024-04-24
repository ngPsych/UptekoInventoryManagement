import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// import { InventoryScreen } from '../screens/Inventory/InventoryScreen';
import { InventoryNavigator } from './InventoryNavigator';
import { AssemblyNavigator } from './AssemblyNavigator';
import { ScannerNavigator } from './ScannerNavigator';
import { OrderScreen } from '../screens/Order/OrderScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { LoginScreen } from '../screens/Login/LoginScreen';
import { NavBar } from '../components/NavBar/NavBar';
import CustomHeader from '../components/CustomHeader/CustomHeader';

const Stack = createStackNavigator();

export const AppNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                // header: () => <CustomHeader title="UPTEKO" />,
                animationEnabled: false
            }}>
                
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Inventory"
                component={InventoryNavigator}
                options={
                    {headerShown: false}
                }
            />
            <Stack.Screen
                name="Assembly"
                component={AssemblyNavigator}
                options={
                    {headerShown: false}
                }
            />
            <Stack.Screen
                name="Scanner"
                component={ScannerNavigator}
                options={
                    {header: () => <CustomHeader title="UPTEKO" />,}
                }
            />
            <Stack.Screen
                name="Order"
                component={OrderScreen}
                options={
                    {header: () => <CustomHeader title="UPTEKO" />,}
                }
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={
                    {header: () => <CustomHeader title="UPTEKO" />,}
                }
            />
            <Stack.Screen
                name="NavBar"
                component={NavBar}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};
