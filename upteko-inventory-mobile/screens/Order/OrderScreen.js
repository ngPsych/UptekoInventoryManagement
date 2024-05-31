import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Dimensions, FlatList } from 'react-native';
import { NavBar } from '../../components/NavBar/NavBar';
import { subscribeToAllParts } from '../../api/firebase/InventoryManagement';
import { startTimer, endTimer } from '../../utils/Timer';

const windowHeight = Dimensions.get('window').height;

export const OrderScreen = () => {
    const [items, setItems] = useState([]);
    const [navbarHeight, setNavbarHeight] = useState(0);

    useEffect(() => {
        startTimer('OrderScreen Data fetching');
        let unsubscribe = () => {}

        unsubscribe = subscribeToAllParts((items) => {
            // Filter items where item.quantity > item.minPoint
            const filteredItems = items.filter(item => item.quantity < item.minPoint);
            setItems(filteredItems);
            endTimer('OrderScreen Data fetching');
        });
        return () => {
            unsubscribe();
        };
    }, []);

    const handleNavBarLayout = (height) => {
        setNavbarHeight(height);
    };

    const renderItem = ({ item }) => {
        startTimer('OrderScreen Render item');
        const renderedItem = (
            <View>
                <TouchableHighlight
                    underlayColor="#777"
                    onPress={() => {
                        console.log('HI');
                    }}
                >
                    <View style={styles.item}>
                        <Text style={[styles.itemText, styles.itemId]} numberOfLines={1} ellipsizeMode="tail">{item.sku}</Text>
                        <Text style={[styles.itemText, styles.itemName]} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                        <Text style={[styles.itemText, styles.itemQuantity]}>x{item.quantity}</Text>
                        <Text style={[styles.itemText, styles.itemMinPoint]} numberOfLines={1} ellipsizeMode="tail">x{item.minPoint}</Text>
                    </View>
                </TouchableHighlight>
                <View style={styles.separator} />
            </View>
        );
        endTimer('OrderScreen Render item');
        return renderedItem;
    };

    const maxListHeight = windowHeight - navbarHeight - 150;

    startTimer('OrderScreen render');
    const renderedScreen = (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.headerText, styles.headerId]}>ID</Text>
                <Text style={[styles.headerText, styles.headerName]}>Name</Text>
                <Text style={[styles.headerText, styles.headerQuantity]}>Qty</Text>
                <Text style={[styles.headerText, styles.headerMinQuantity]}>Min. Qty</Text>
            </View>

            <View style={[styles.content, { maxHeight: maxListHeight }]}>
                <FlatList
                    data={items}
                    renderItem={renderItem}
                />
            </View>
            <NavBar activeItem="Order" onNavBarLayout={handleNavBarLayout} />
        </View>
    );
    endTimer('OrderScreen render');

    return renderedScreen;
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
    headerQuantity: {
        flex: 2,
        textAlign: 'center',
    },
    headerMinQuantity: {
        flex: 0,
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
        flex: 2,
        textAlign: 'center',
    },
    itemName: {
        flex: 3,
        textAlign: 'center',
    },
    itemQuantity: {
        flex: 5,
        textAlign: 'center',
    },
    itemMinQuantity: {
        flex: 1,
        textAlign: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
    },
});
