import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';

// Import images
import inventoryIcon from '../../assets/icons/inventory.png';
import assemblyIcon from '../../assets/icons/tools.png';
import scannerIcon from '../../assets/icons/qr-code-scan.png';
import orderIcon from '../../assets/icons/shopping-cart.png';
import profileIcon from '../../assets/icons/user.png';

export const NavBar = ({ activeItem, onNavBarLayout }) => {
    const navigation = useNavigation();
    const window = useWindowDimensions();
    const [navBarHeight, setNavBarHeight] = useState(0);

    useEffect(() => {
        if (onNavBarLayout) {
            onNavBarLayout(navBarHeight);
        }
    }, [navBarHeight, onNavBarLayout]);

    const onSelect = (screenName) => {
        // Reset the navigation stack
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: screenName }],
            })
        );
    };

    // Helper function to get the appropriate image source based on the active item
    const getImageSource = (itemName) => {
        switch (itemName) {
            case 'Inventory':
                return inventoryIcon;
            case 'Assembly':
                return assemblyIcon;
            case 'Scanner':
                return scannerIcon;
            case 'Order':
                return orderIcon;
            case 'Profile':
                return profileIcon;
            default:
                return null;
        }
    };

    return (
        <View style={styles.container} onLayout={(event) => setNavBarHeight(event.nativeEvent.layout.height)}>
            {['Inventory', 'Assembly', 'Scanner', 'Order', 'Profile'].map((item) => (
                <TouchableOpacity
                    key={item}
                    style={[styles.button, activeItem === item && styles.activeButton]}
                    onPress={() => onSelect(item)}>
                    <Image source={getImageSource(item)} style={styles.icon} />
                    <Text style={[styles.buttonText, activeItem === item && styles.activeButtonText]}>{item}</Text>
                </TouchableOpacity>
            ))}
            <View style={[styles.activeIndicator, { left: `${(100 / 5) * ['Inventory', 'Assembly', 'Scanner', 'Order', 'Profile'].indexOf(activeItem)}%` }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#333',
        paddingBottom: 20,
        paddingTop: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    button: {
        flex: 1,
        alignItems: 'center',
    },
    activeButton: {},
    buttonText: {
        fontSize: 14,
        color: 'white',
    },
    activeButtonText: {
        fontWeight: 'bold',
    },
    icon: {
        width: 24,
        height: 24,
        marginBottom: 5,
        tintColor: 'white',
    },
    activeIndicator: {
        position: 'absolute',
        height: 3,
        backgroundColor: '#4CAF50',
        width: `${100 / 5}%`, // assuming there are 5 buttons
        top: 0,
    },
});
