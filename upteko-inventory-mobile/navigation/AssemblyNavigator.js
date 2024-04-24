import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AssemblyScreen } from '../screens/Assembly/AssemblyScreen';
import { SubAssemblyScreen } from '../screens/Assembly/SubAssemblyScreen';
import CustomHeader from '../components/CustomHeader/CustomHeader';

const Assembly = createStackNavigator();

export const AssemblyNavigator = () => {
    return (
        <Assembly.Navigator
            screenOptions={{ animationEnabled: false }}>

            <Assembly.Screen
                name="AssemblyScreen"
                component={AssemblyScreen}
                options={{header: () => <CustomHeader title="UPTEKO" screen="Assembly" />}}
            />
            <Assembly.Screen
                name="SubAssembly"
                component={SubAssemblyScreen}
                options={{header: () => <CustomHeader title="Sub-Assembly" screen="SubAssembly" />}}
            />
        </Assembly.Navigator>
    );
};