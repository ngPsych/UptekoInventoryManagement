import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NavBar } from '../../components/NavBar/NavBar';
import { Card } from '../../components/Card/Card';
import { subscribeToAssemblyItems } from '../../api/firebase/AssemblyManagement';
import { useNavigation } from '@react-navigation/native';

export const AssemblyScreen = () => {
    const navigation = useNavigation();
    const [assemblyItems, setAssemblyItems] = useState([]);

    useEffect(() => {
        const unsubscribe = subscribeToAssemblyItems((items) => {
            setAssemblyItems(items);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const renderAssemblyItems = () => {
        return assemblyItems.map(item => (
            <TouchableOpacity key={item.id} style={styles.assemblyCard} onPress={() => navigation.navigate('SubAssembly', item.id)}>
                <Card title={item.id} imageURL={item.imageURL} />
            </TouchableOpacity>
        ));
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    {renderAssemblyItems()}
                </View>
            </ScrollView>
            <NavBar activeItem="Assembly" />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#666',
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        alignItems: 'center',
        marginBottom: 80,
    },
    assemblyCard: {
        marginTop: 10,
        marginBottom: 10,
    }
});
