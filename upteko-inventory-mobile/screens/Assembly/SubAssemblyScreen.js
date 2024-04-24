import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NavBar } from '../../components/NavBar/NavBar';
import { Card } from '../../components/Card/Card';
import { getMaterialsNeeded, subscribeToSubAssemblyItems } from '../../api/firebase/assemblyManagement';

export const SubAssemblyScreen = ({ route }) => {
    const assemblyId = route.params;
    const [subAssemblyItems, setSubAssemblyItems] = useState([]);
    
    //test
    const [materialsNeeded, setMaterialsNeeded] = useState([]);

    const fetchMaterialsNeeded = async (assemblyId, subAssemblyId) => {
        try {
            const materialsNeeded = await getMaterialsNeeded(assemblyId, subAssemblyId);
            setMaterialsNeeded(materialsNeeded);
            console.log(materialsNeeded)
        } catch (error) {
            console.error('Error fetching materials needed:', error);
        }
    }

    useEffect(() => {
        const unsubscribe = subscribeToSubAssemblyItems(assemblyId, (items) => {
            setSubAssemblyItems(items);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleSubAssemblyCardClick = (itemId) => {
        // Handle click event for assembly card
        console.log('Clicked on sub-assembly item with ID:', itemId);
    };

    const renderSubAssemblyItems = () => {
        return subAssemblyItems.map(item => (
            <TouchableOpacity key={item.sku} style={styles.subAssemblyCard} onPress={() => fetchMaterialsNeeded(assemblyId, item.sku)}>
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
