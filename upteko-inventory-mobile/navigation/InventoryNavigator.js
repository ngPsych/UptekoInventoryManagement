import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { InventoryScreen } from '../screens/Inventory/InventoryScreen';
import { ItemPartScreen } from '../screens/Inventory/ItemPartScreen';
import { AddPartScreen } from '../screens/Inventory/AddPartScreen'
import CustomHeader from '../components/CustomHeader/CustomHeader';

const Scanner = createStackNavigator();

export const InventoryNavigator = () => {
    return (
        <Scanner.Navigator
            screenOptions={{ animationEnabled: false }}>

            <Scanner.Screen
                name="Inventory"
                component={InventoryScreen}
                options={
                    {header: () => <CustomHeader title="UPTEKO" screen="Inventory" />}
                }
            />
            <Scanner.Screen
                name="Part"
                component={ItemPartScreen}
                options={
                    {header: () => <CustomHeader title="Part" screen="Part" />}
                }
            />
            <Scanner.Screen
                name="AddPart"
                component={AddPartScreen}
                options={
                    {header: () => <CustomHeader title="AddPart" screen="AddPart" />}
                }
            />
        </Scanner.Navigator>
    );
};