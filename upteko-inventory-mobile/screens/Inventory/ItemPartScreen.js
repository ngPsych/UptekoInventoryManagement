import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { NavBar } from '../../components/NavBar/NavBar';
import { subscribeToPart } from '../../api/firebase/inventoryManagement';
import { formatFirestoreTimestamp } from '../../utils/TimeFormat';
import { ImageButton } from '../../components/Button/ImageButton';
import { deletePartBySKU } from '../../api/firebase/inventoryManagement';
import { useNavigation } from '@react-navigation/native';

import deleteIcon from '../../assets/icons/delete.png';

export const ItemPartScreen = ({ route }) => {
    const { partSKU } = route.params;
    const navigation = useNavigation();
    const [partData, setPartData] = useState(null);

    useEffect(() => {
        const unsubscribe = subscribeToPart(partSKU, (data) => {
            setPartData(data);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleDeletePart = async () => {
        try {
            const deleted = await deletePartBySKU(partSKU);
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
        Alert.alert(`Delete ${partSKU}`, "Click confirm to delete.", [
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
                        {partData && (
                            <>
                                <Text style={styles.partDataText}>{partData ? partData.id : "-"}</Text>
                                <Text style={styles.partDataText}>{partData ? partData.name : "-"}</Text>
                                <Text style={styles.partDataText}>{partData ? partData.location : "-"}</Text>
                                <Text style={styles.partDataText}>{partData ? "x" + partData.quantity : "-"}</Text>
                                <Text style={styles.partDataText}>{partData ? "x" + partData.min_point : "-"}</Text>
                                <Text style={styles.partDataText}>{partData ? partData.description : "-"}</Text>
                                <Text style={styles.partDataText}>{partData ? partData.supplier : "-"}</Text>
                                <Text style={styles.partDataText}>{partData ? partData.supplier_item_number : "-"}</Text>
                                <Text style={styles.partDataText}>{partData ? formatFirestoreTimestamp(partData.last_modified) : "-"}</Text>
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