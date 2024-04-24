import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';

export const ImageButton = ({ style, onPress, disabled, imageSource, width, height, whiteTint }) => {
    const imageStyle = [
        styles.image,
        {
            width: width || 28, // default width is 28
            height: height || 28, // default height is 28
            opacity: disabled ? 0.7 : 1,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            // elevation: 5,
        }
    ];

    if (whiteTint) {
        imageStyle.push({ tintColor: 'white' });
    }

    return (
        <TouchableOpacity onPress={onPress} style={[styles.buttonContainer, style]}>
            <Image
                source={imageSource}
                style={imageStyle}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        // No default tint color applied
    },
});
