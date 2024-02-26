import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavBar } from '../../components/NavBar/NavBar';
import { getPartBySKU } from '../../api/firebase/inventoryManagement';

export const PostScanScreen = ({ route }) => {
    const { currentScannedSKU } = route.params;
    const [currentScannedPart, setCurrentScannedPart] = useState(null);

    useEffect(() => {
        const fetchScannedPart = async () => {
            try {
                const scannedPart = await getPartBySKU({sku: currentScannedSKU});
                setCurrentScannedPart(scannedPart);
            } catch (error) {
                console.error('Error fetching scanned part:', error);
            }
        };
        
        fetchScannedPart();
    }, [currentScannedSKU]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text>Current Scanned SKU: {currentScannedSKU}</Text>
                {currentScannedPart && (
                    <View>
                        <Text>Part ID: {currentScannedPart.id}</Text>
                        <Text>Part Name: {currentScannedPart.name}</Text>
                        {/* Render other properties of the part as needed */}
                    </View>
                )}
            </View>
            <NavBar activeItem="Scanner" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
