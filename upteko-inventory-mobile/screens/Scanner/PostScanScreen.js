import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
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
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Current Scanned SKU: {currentScannedSKU}</Text>
            {currentScannedPart && (
                <View>
                    <Text>Part ID: {currentScannedPart.id}</Text>
                    <Text>Part Name: {currentScannedPart.name}</Text>
                    {/* Render other properties of the part as needed */}
                </View>
            )}
        </View>
    );
};
