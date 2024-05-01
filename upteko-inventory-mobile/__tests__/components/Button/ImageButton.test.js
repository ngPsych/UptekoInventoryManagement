import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { ImageButton } from '../../../components/Button/ImageButton';

describe('ImageButton', () => {
    const mockPress = jest.fn();

    it('renders correctly', () => {
        const { getByTestId } = render(<ImageButton onPress={mockPress} imageSource={require('../../assets/delete.png')} />);
        expect(getByTestId('image-button')).toBeTruthy();
    });

    it('handles onPress', () => {
        const { getByTestId } = render(<ImageButton onPress={mockPress} imageSource={require('../../assets/delete.png')} />);
        fireEvent.press(getByTestId('image-button'));
        expect(mockPress).toHaveBeenCalled();
    });

    it('applies disabled opacity', () => {
        const { getByTestId } = render(<ImageButton disabled={true} onPress={mockPress} imageSource={require('../../assets/delete.png')} />);
        const button = getByTestId('image');
        const styles = StyleSheet.flatten(button.props.style);
        expect(styles.opacity).toBe(0.7);
    });    

    it('applies white tint when whiteTint is true', () => {
        const { getByTestId } = render(<ImageButton whiteTint={true} onPress={mockPress} imageSource={require('../../assets/delete.png')} />);
        const button = getByTestId('image');
        const styles = StyleSheet.flatten(button.props.style);
        expect(styles.tintColor).toBe('white');
    });    
});
