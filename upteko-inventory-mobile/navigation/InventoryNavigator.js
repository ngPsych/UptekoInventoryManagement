import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { InventoryScreen } from '../screens/Inventory/InventoryScreen';
import { ItemInfoScreen } from '../screens/Inventory/ItemInfoScreen';
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
                name="ItemInfo"
                component={ItemInfoScreen}
                options={
                    {header: () => <CustomHeader title="Info" screen="ItemInfo" />}
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