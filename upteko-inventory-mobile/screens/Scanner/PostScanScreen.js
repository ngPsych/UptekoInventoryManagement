import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { getPartBySKU, updateItemQuantity } from '../../api/firebase/InventoryManagement';
import { NavBar } from '../../components/NavBar/NavBar';
import { useNavigation } from '@react-navigation/native';

export const PostScanScreen = ({ route }) => {
    const { currentScannedSKU } = route.params;
    const navigation = useNavigation();
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
        let updatedQuantity;
        if (isAdding) {
            updatedQuantity = currentScannedPart.quantity + quantityChange;
        } else {
            // Ensure updatedQuantity doesn't become negative or exceed current quantity
            updatedQuantity = Math.max(0, currentScannedPart.quantity - quantityChange);
        }
    
        if (!isAdding && updatedQuantity > currentScannedPart.quantity) {
            alert('Updated quantity cannot be greater than current quantity');
            return;
        }
    
        try {
            await updateItemQuantity({ sku: currentScannedSKU, quantity: updatedQuantity });
            if (isAdding) {
                alert('Amount added successfully');
            } else {
                alert('Amount removed successfully');
            }
            navigation.navigate('QRScanner');
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Error adding/removing amount');
        }
    };
    

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.content}>
                    <Text style={styles.title}>Scanned SKU: {currentScannedSKU}</Text>
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
                                <TouchableOpacity 
                                    style={styles.button}
                                    onPress={() => updateQuantity(true)} 
                                >
                                    <Text style={styles.buttonText}>Add</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.button}
                                    onPress={() => updateQuantity(false)} 
                                >
                                    <Text style={styles.buttonText}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>
            <NavBar activeItem="Scanner" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#666',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        marginBottom: 100,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
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
        elevation: 5,
        margin: 35,
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
    },
    button: {
        backgroundColor: '#007bff',
        borderRadius: 5,
        padding: 10,
        width: 100,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
