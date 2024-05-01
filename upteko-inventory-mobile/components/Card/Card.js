import React from "react";
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';

export const Card = ({ title, imageURL }) => {
    return (
        <View style={styles.cardContainer}>
            {imageURL && <Image source={{ uri: imageURL }} style={styles.image} testID="card-image" />}
            <Text style={styles.titleText} testID="card-title" >{title}</Text>
        </View>
    )
}

const deviceWidth = Math.round(Dimensions.get('window').width);
const styles = StyleSheet.create({
    cardContainer: {
        width: deviceWidth - 60,
        backgroundColor: 'white',
        height: 200,
        borderRadius: 20,

        shadowColor: '#000',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.75,
        elevation: 5,

        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },

    titleText: {
        textAlign: 'center',
        fontSize: 32,
        fontWeight: 'bold',
        position: 'absolute',
        bottom: '35%',
        left: 0,
        right: 0,
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for better readability
        padding: 10, // Add padding for better aesthetics
    },

    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 20,
    },
});