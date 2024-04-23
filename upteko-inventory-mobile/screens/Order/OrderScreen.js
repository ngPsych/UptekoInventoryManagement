import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavBar } from '../../components/NavBar/NavBar';

export const OrderScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Your screen content goes here */}
                <Text>Order</Text>
            </View>
            <NavBar activeItem="Order" />
        </View>
    );
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