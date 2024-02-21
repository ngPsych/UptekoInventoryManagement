import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export const NavBar = ({ activeItem, onSelect }) => {
    return (
        <View style={styles.container}>
        <TouchableOpacity
            style={[styles.button, activeItem === 'Inventory' && styles.activeButton]}
            onPress={() => onSelect('Inventory')}>
            <Text style={styles.buttonText}>Inventory</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.button, activeItem === 'Assembly' && styles.activeButton]}
            onPress={() => onSelect('Assembly')}>
            <Text style={styles.buttonText}>Assembly</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.button, activeItem === 'Scanner' && styles.activeButton]}
            onPress={() => onSelect('Scanner')}>
            <Text style={styles.buttonText}>Scanner</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.button, activeItem === 'Order' && styles.activeButton]}
            onPress={() => onSelect('Order')}>
            <Text style={styles.buttonText}>Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.button, activeItem === 'Profile' && styles.activeButton]}
            onPress={() => onSelect('Profile')}>
            <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
        container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingBottom: 15,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        },
        button: {
        flex: 1,
        alignItems: 'center',
        },
        activeButton: {
        borderBottomWidth: 2,
        borderBottomColor: 'blue',
        },
        buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        },
});
