import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { signIn } from '../../api/firebase/authentication';
import { useNavigation } from '@react-navigation/native';

export const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleLogin = () => {
        signIn({ email, password })
            .then((user) => {
                console.log('Login successful');
                navigation.navigate('Inventory'); // Navigate to Inventory screen
            })
            .catch((error) => {
                console.error('Login Error - Code:', error.code);
                console.error('Login Error - Message:', error.message);
            });
    };    

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
});
