import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavBar } from '../../components/NavBar/NavBar';
import { signOutUser } from '../../api/firebase/authentication';

export const ProfileScreen = () => {
    const navigation = useNavigation(); 

    const handleSignOut = () => {
        signOutUser()
            .then(() => {
                navigation.navigate('Login');
            })
            .catch(error => {
                console.error('Sign out error:', error);
            });
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text>Profile</Text>
                <Button title="Sign out" onPress={handleSignOut} />
            </View>
            <NavBar activeItem="Profile" />
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
        alignItems: 'center',
        justifyContent: 'center',
    },
});
