import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavBar } from '../../components/NavBar/NavBar';

export const AssemblyScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Your screen content goes here */}
                <Text>Assembly</Text>
            </View>
            <NavBar activeItem="Assembly" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});