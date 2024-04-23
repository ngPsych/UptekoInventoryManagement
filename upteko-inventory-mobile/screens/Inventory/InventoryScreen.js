import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { NavBar } from '../../components/NavBar/NavBar';
import { subscribeToAllParts } from '../../api/firebase/inventoryManagement';
import { useNavigation } from '@react-navigation/native';

const windowHeight = Dimensions.get('window').height;

export const InventoryScreen = () => {
    const [items, setItems] = useState([]);
    const [navbarHeight, setNavbarHeight] = useState(0);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = subscribeToAllParts((items) => {
            setItems(items);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleNavBarLayout = (height) => {
        setNavbarHeight(height);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate('Part', { partSKU: item.sku });
            }}
        >
            <View style={styles.item}>
                <Text style={[styles.itemText, styles.itemId]} numberOfLines={1} ellipsizeMode="tail">{item.sku}</Text>
                <Text style={[styles.itemText, styles.itemName]} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                <Text style={[styles.itemText, styles.itemLocation]} numberOfLines={1} ellipsizeMode="tail">{item.location}</Text>
                <Text style={[styles.itemText, styles.itemQuantity]}>x{item.quantity}</Text>
            </View>
        </TouchableOpacity>
    );

    // Calculate the maximum height the list should occupy
    const maxListHeight = windowHeight - navbarHeight - 150;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.headerText, styles.headerId]}>ID</Text>
                <Text style={[styles.headerText, styles.headerName]}>Name</Text>
                <Text style={[styles.headerText, styles.headerLocation]}>Location</Text>
                <Text style={[styles.headerText, styles.headerQuantity]}>Quantity</Text>
                {/* Add more header columns as needed */}
            </View>
            <View style={[styles.content, { maxHeight: maxListHeight }]}>
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.sku}
                />
            </View>
            <NavBar activeItem="Inventory" onNavBarLayout={handleNavBarLayout} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#666',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#444',
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexWrap: 'nowrap',
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerId: {
        flex: 1,
        paddingLeft: 10,
    },
    headerName: {
        flex: 2,
        paddingLeft: 10,
    },
    headerLocation: {
        flex: 2,
        paddingLeft: 10,
    },
    headerQuantity: {
        // flex: 1,
        paddingLeft: 10,
    },
    content: {
        flex: 1,
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemText: {
        fontSize: 16,
        color: '#fff',
    },
    itemId: {
        flex: 1,
        paddingLeft: 10,
    },
    itemName: {
        flex: 2,
        paddingLeft: 10,
    },
    itemLocation: {
        flex: 2,
        paddingLeft: 10,
    },
    itemQuantity: {
        flex: 1,
        paddingLeft: 10,
    },
});
