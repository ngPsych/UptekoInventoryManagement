import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableHighlight } from 'react-native';
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
        <View>
            <TouchableHighlight
                underlayColor="#777"
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
            </TouchableHighlight>
            {/* ADD SEPARATOR */}
            <View style={styles.separator} />
        </View>
    );

    // Calculate the maximum height the list should occupy
    const maxListHeight = windowHeight - navbarHeight - 150;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.headerText, styles.headerId]}>ID</Text>
                <Text style={[styles.headerText, styles.headerName]}>Name</Text>
                <Text style={[styles.headerText, styles.headerLocation]}>Location</Text>
                <Text style={[styles.headerText, styles.headerQuantity]}>Qty</Text>
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
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerId: {
        flex: 1,
        textAlign: 'center',
    },
    headerName: {
        flex: 2,
        textAlign: 'center',
    },
    headerLocation: {
        flex: 2,
        textAlign: 'center',
    },
    headerQuantity: {
        flex: 1,
        textAlign: 'center',
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
    },
    itemText: {
        fontSize: 16,
        color: 'white',
    },
    itemId: {
        flex: 1,
        textAlign: 'center',
    },
    itemName: {
        flex: 2,
        textAlign: 'center',
    },
    itemLocation: {
        flex: 2,
        textAlign: 'center',
    },
    itemQuantity: {
        flex: 1,
        textAlign: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
    },    
});
