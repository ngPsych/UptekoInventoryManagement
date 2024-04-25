import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NavBar } from '../../components/NavBar/NavBar';
import { Card } from '../../components/Card/Card';
import { subscribeToSubAssemblyItems } from '../../api/firebase/assemblyManagement';
import { useNavigation } from '@react-navigation/native';

export const SubAssemblyScreen = ({ route }) => {
    const navigation = useNavigation();
    const assemblyId = route.params;
    const [subAssemblyItems, setSubAssemblyItems] = useState([]);

    useEffect(() => {
        const unsubscribe = subscribeToSubAssemblyItems(assemblyId, (items) => {
            setSubAssemblyItems(items);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const renderSubAssemblyItems = () => {
        return subAssemblyItems.map(item => (
            <TouchableOpacity 
                key={item.sku} 
                style={styles.subAssemblyCard} 
                onPress={() => navigation.navigate('MaterialsList', {assemblyId: assemblyId, subAssemblyId: item.sku})}
            >
                <Card title={item.sku} imageURL={item.imageURL} />
            </TouchableOpacity>
        ));
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    {renderSubAssemblyItems()}
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
    subAssemblyCard: {
        marginTop: 10,
        marginBottom: 10,
    }
});
