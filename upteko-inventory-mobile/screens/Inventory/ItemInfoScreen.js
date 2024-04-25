import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { NavBar } from '../../components/NavBar/NavBar';
import { subscribeToPart, deletePartBySKU, subscribeToSubAssembly } from '../../api/firebase/inventoryManagement';
import { formatFirestoreTimestamp } from '../../utils/TimeFormat';
import { ImageButton } from '../../components/Button/ImageButton';
import { useNavigation } from '@react-navigation/native';

import deleteIcon from '../../assets/icons/delete.png';

export const ItemInfoScreen = ({ route }) => {
    const { itemSKU } = route.params;
    const navigation = useNavigation();
    const [itemData, setItemData] = useState(null);

    useEffect(() => {
        const unsubscribe = subscribeToPart(itemSKU, (data) => {
            setItemData(data);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleDeletePart = async () => {
        try {
            const deleted = await deletePartBySKU(itemSKU);
            if (deleted) {
                navigation.goBack();
                Alert.alert("Success", "Part deleted successfully");
            } else {
                Alert.alert("Error", "Part document does not exist");
            }
        } catch (error) {
            console.error("Error deleting part:", error);
            if (error.message) {
                Alert.alert("Error", error.message);
            } else {
                Alert.alert("Error", "Failed to delete part");
            }
        }
    }

    const handleDeletePartButton = () => {
        Alert.alert(`Delete ${itemSKU}`, "Click confirm to delete.", [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Confirm',
                onPress: () => handleDeletePart()
            },
        ]);
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.itemContainer}>
                    <View style={styles.titleColumn}>
                        <Text style={styles.titleText}>ID:</Text>
                        <Text style={styles.titleText}>Name:</Text>
                        <Text style={styles.titleText}>Location:</Text>
                        <Text style={styles.titleText}>Quantity:</Text>
                        <Text style={styles.titleText}>Min. Point:</Text>
                        <Text style={styles.titleText}>Description:</Text>
                        <Text style={styles.titleText}>Supplier:</Text>
                        <Text style={styles.titleText}>Supplier Item Number:</Text>
                        <Text style={styles.titleText}>Last Modified:</Text>
                    </View>
                    <View style={styles.dataColumn}>
                        {itemData && (
                            <>
                                <Text style={styles.partDataText}>{itemData ? itemData.id : "-"}</Text>
                                <Text style={styles.partDataText}>{itemData ? itemData.name : "-"}</Text>
                                <Text style={styles.partDataText}>{itemData ? itemData.location : "-"}</Text>
                                <Text style={styles.partDataText}>{itemData ? "x" + itemData.quantity : "-"}</Text>
                                <Text style={styles.partDataText}>{itemData ? "x" + itemData.min_point : "-"}</Text>
                                <Text style={styles.partDataText}>{itemData ? itemData.description : "-"}</Text>
                                <Text style={styles.partDataText}>{itemData ? itemData.supplier : "-"}</Text>
                                <Text style={styles.partDataText}>{itemData ? itemData.supplier_item_number : "-"}</Text>
                                <Text style={styles.partDataText}>{itemData ? formatFirestoreTimestamp(itemData.last_modified) : "-"}</Text>
                            </>
                        )}
                    </View>
                </View>
                <ImageButton
                    style={{marginTop: 75}}
                    onPress={handleDeletePartButton}
                    imageSource={deleteIcon}
                    width={75}
                    height={75}
                    whiteTint={false}
                    disabled={false}
                />
            </View>
            <NavBar activeItem="Inventory" />
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
        paddingHorizontal: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 50,
    },
    titleColumn: {
        marginRight: 20,
    },
    dataColumn: {
        flex: 1,
    },
    titleText: {
        color: 'white',
        fontSize: 20,
        marginBottom: 15,
    },
    partDataText: {
        color: 'white',
        fontSize: 20,
        marginBottom: 15,
        textAlign: 'right',
    }
});