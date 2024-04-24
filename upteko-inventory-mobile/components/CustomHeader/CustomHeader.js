import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ImageButton } from '../Button/ImageButton';

import cameraDroneIcon from '../../assets/icons/camera-drone.png';
import addItemIcon from '../../assets/icons/add.png';
import backButtonIcon from '../../assets/icons/back-button.png'

const CustomHeader = ({ title, screen }) => {
    // const [addItemPressed, setAddItemPressed] = useState(false);
    const navigation = useNavigation();

    const handleAddItemPress = () => {
        // add additional functionality here
        navigation.navigate('AddPart');
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <View style={[styles.container, { height: Platform.OS === 'ios' ? 100 : 60 }]}>
            <View style={styles.content}>
                {screen === "Part" ||
                screen === "AddPart" || 
                screen === "SubAssembly"
                ? (
                    <ImageButton
                        style={{ marginLeft: 20, marginTop: Platform.OS === 'ios' ? 40 : 0 }}
                        onPress={handleBackPress}
                        imageSource={backButtonIcon}
                        width={28}
                        height={28}
                        whiteTint={true}
                        disabled={false}
                    />
                ) : (
                    <Image source={cameraDroneIcon} style={[styles.image, { marginTop: Platform.OS === 'ios' ? 40 : 0 }]} />
                )}
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[styles.title, { marginTop: Platform.OS === 'ios' ? 40 : 0 }]}>{title}</Text>
                    {screen === "Inventory" && (
                        <ImageButton
                            style={{ marginRight: 20, marginTop: Platform.OS === 'ios' ? 40 : 0 }}
                            onPress={handleAddItemPress}
                            imageSource={addItemIcon}
                            width={28}
                            height={28}
                            whiteTint={true}
                            disabled={false}
                        />
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#333',
        justifyContent: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 10,
        marginTop: 12,
    },
    image: {
        width: 28,
        height: 28,
        marginLeft: 20,
        tintColor: 'white',
    }
});

export default CustomHeader;
