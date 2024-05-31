import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import { NavBar } from '../../components/NavBar/NavBar';
import { subscribeToAllParts, subscribeToAllSubAssemblies } from '../../api/firebase/InventoryManagement';
import { useNavigation } from '@react-navigation/native';
import { startTimer, endTimer } from '../../utils/Timer';

const windowHeight = Dimensions.get('window').height;

export const InventoryScreen = () => {
    const [items, setItems] = useState([]);
    const [navbarHeight, setNavbarHeight] = useState(0);
    const navigation = useNavigation();
    const [listMode, setListMode] = useState('Parts');

    useEffect(() => {
        let unsubscribe = () => {};

        if (listMode === 'Parts') {
            unsubscribe = subscribeToAllParts((items) => {
                setItems(items);
            });
        } else if (listMode === 'Sub-Assemblies') {
            unsubscribe = subscribeToAllSubAssemblies((items) => {
                setItems(items);
                console.log(items);
            });
        }

        return () => {
            unsubscribe();
        };
    }, [listMode]);

    const handleNavBarLayout = (height) => {
        setNavbarHeight(height);
    };

    const renderItem = ({ item }) => {
        startTimer('Inventory RenderItem');
        const renderedItem = (
            <View>
                {listMode === 'Parts' ? (
                    <TouchableHighlight
                        underlayColor="#777"
                        onPress={() => {
                            navigation.navigate('ItemInfo', { itemSKU: item.sku });
                        }}
                    >
                        <View style={styles.item}>
                            <Text style={[styles.itemText, styles.itemId]} numberOfLines={1} ellipsizeMode="tail">{item.sku}</Text>
                            <Text style={[styles.itemText, styles.itemName]} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                            <Text style={[styles.itemText, styles.itemLocation]} numberOfLines={1} ellipsizeMode="tail">{item.location}</Text>
                            <Text style={[styles.itemText, styles.itemQuantity]}>x{item.quantity}</Text>
                        </View>
                    </TouchableHighlight>
                ) : (
                    <View style={styles.item}>
                        <Text style={[styles.itemText, styles.itemId]} numberOfLines={1} ellipsizeMode="tail">{item.assembly}</Text>
                        <Text style={[styles.itemText, styles.itemName]} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                        <Text style={[styles.itemText, styles.itemQuantity]}>x{item.quantity}</Text>
                    </View>
                )}
                <View style={styles.separator} />
            </View>
        );
        endTimer('Inventory RenderItem');
        return renderedItem;
    };

    const handleListModeClick = () => {
        if (listMode === 'Parts') {
            setListMode('Sub-Assemblies');
            console.log(listMode);
        } else {
            setListMode('Parts');
            console.log(listMode);
        }
    };

    // Calculate the maximum height the list should occupy
    const maxListHeight = windowHeight - navbarHeight - 150;

    startTimer('InventoryScreen render');
    const renderedScreen = (
        <View style={styles.container}>
            {listMode === 'Parts' ? (
                <View style={styles.header}>
                    <Text style={[styles.headerText, styles.headerId]}>ID</Text>
                    <Text style={[styles.headerText, styles.headerName]}>Name</Text>
                    <Text style={[styles.headerText, styles.headerLocation]}>Location</Text>
                    <Text style={[styles.headerText, styles.headerQuantity]}>Qty</Text>
                </View>
            ) : (
                <View style={styles.header}>
                    <Text style={[styles.headerText, styles.headerId]}>Assembly</Text>
                    <Text style={[styles.headerText, styles.headerName]}>Sub-Assembly</Text>
                    <Text style={[styles.headerText, styles.headerQuantity]}>Quantity</Text>
                </View>
            )}
            <View style={[styles.content, { maxHeight: maxListHeight }]}>
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    // keyExtractor={(item) => item.sku}
                />
            </View>
            <TouchableOpacity
                style={[styles.listModeButton, { bottom: navbarHeight + 30 }]}
                onPress={handleListModeClick}
            >
                <Text style={styles.listModeButtonText}>
                    {listMode === 'Parts' ? 'PART' : 'SUB'}
                </Text>
            </TouchableOpacity>
            <NavBar activeItem="Inventory" onNavBarLayout={handleNavBarLayout} />
        </View>
    );
    endTimer('InventoryScreen render');

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
    listModeButton: {
        position: 'absolute',
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(76, 175, 80, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listModeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
