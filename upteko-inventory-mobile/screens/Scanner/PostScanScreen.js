import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { getPartBySKU, updateItemQuantity } from '../../api/firebase/inventoryManagement';

export const PostScanScreen = ({ route }) => {
    const { currentScannedSKU } = route.params;
    const [currentScannedPart, setCurrentScannedPart] = useState(null);
    const [newQuantity, setNewQuantity] = useState("1");

    const fetchScannedPart = async () => {
        try {
            const scannedPart = await getPartBySKU({ sku: currentScannedSKU });
            setCurrentScannedPart(scannedPart);
        } catch (error) {
            console.error('Error fetching scanned part:', error);
        }
    };

    useEffect(() => {        
        fetchScannedPart();
    }, [currentScannedSKU]);

    const updateQuantity = async (isAdding) => {
        // checks if value is 0 > and is not NaN
        const quantityChange = parseInt(newQuantity);
        if (isNaN(quantityChange) || quantityChange <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        // checks if isAdding is true/false, if true then increment else decrement
        let updatedQuantity = isAdding
            ? currentScannedPart.quantity + quantityChange
            : currentScannedPart.quantity - quantityChange;

        if (updatedQuantity < 0) {
            alert('Cannot have negative amount');
            return;
        }

        // this checks through if the sku/item number starts with 'p' then it is from parts inventory else 's' for subassembly
        let collectionName;
        if (currentScannedPart.id.startsWith('P')) {
            collectionName = 'parts';
        } else if (currentScannedPart.id.startsWith('S')) {
            collectionName = 'subassembly';
        } else {
            alert('Invalid part ID');
            return;
        }

        try {
            await updateItemQuantity({ collectionName, sku: currentScannedSKU, quantity: updatedQuantity });
            alert('Amount added/removed successfully');
            fetchScannedPart();
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Error adding/removing amount');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <Text style={styles.title}>Current Scanned SKU: {currentScannedSKU}</Text>
                {currentScannedPart && (
                    <View style={styles.partDetails}>
                        <Text style={styles.partText}>Part ID: {currentScannedPart.id}</Text>
                        <Text style={styles.partText}>Part Name: {currentScannedPart.name}</Text>
                        <Text style={styles.partText}>Quantity: {currentScannedPart.quantity}</Text>

                        <Text style={styles.quantityText}>Quantity to Add/Remove:</Text>
                        <TextInput 
                            style={styles.input}
                            placeholder="1"
                            value={newQuantity}
                            onChangeText={setNewQuantity}
                            keyboardType="numeric"
                        />
                        <View style={styles.buttonContainer}>
                            <Button 
                                title="Add" 
                                onPress={() => updateQuantity(true)} 
                            />
                            <Button 
                                title="Remove" 
                                onPress={() => updateQuantity(false)} 
                            />
                        </View>
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5', // Light gray background
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    partDetails: {
        alignItems: 'center',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#fff', // White background for part details
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // Shadow effect for elevation
    },
    partText: {
        fontSize: 16,
        marginVertical: 5,
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '500',
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: 200,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    }
});
