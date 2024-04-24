import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { InventoryScreen } from '../screens/Inventory/InventoryScreen';
import { ItemPartScreen } from '../screens/Inventory/ItemPartScreen';
import { AddPartScreen } from '../screens/Inventory/AddPartScreen'
import CustomHeader from '../components/CustomHeader/CustomHeader';

const Inventory = createStackNavigator();

export const InventoryNavigator = () => {
    return (
        <Inventory.Navigator
            screenOptions={{ animationEnabled: false }}>

            <Inventory.Screen
                name="InventoryScreen"
                component={InventoryScreen}
                options={
                    {header: () => <CustomHeader title="UPTEKO" screen="Inventory" />}
                }
            />
            <Inventory.Screen
                name="Part"
                component={ItemPartScreen}
                options={
                    {header: () => <CustomHeader title="Part" screen="Part" />}
                }
            />
            <Inventory.Screen
                name="AddPart"
                component={AddPartScreen}
                options={
                    {header: () => <CustomHeader title="Add Part" screen="AddPart" />}
                }
            />
        </Inventory.Navigator>
    );
};