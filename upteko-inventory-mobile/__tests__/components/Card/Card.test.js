import React from 'react';
import { render } from '@testing-library/react-native';
import { Card } from '../../../components/Card/Card';

describe('Card', () => {
    const title = "Sample Title";
    const imageURL = "https://firebasestorage.googleapis.com/v0/b/uptekoinventory.appspot.com/o/images%2FDefault.png?alt=media&token=d9c61c9b-bcc5-4fde-abcc-a6e7f60901c3";

    it('renders correctly', () => {
        const { getByText } = render(<Card title={title} />);
        expect(getByText(title)).toBeTruthy();
    });

    it('displays title with correct styles', () => {
        const { getByText } = render(<Card title={title} />);
        const titleElement = getByText(title);
        expect(titleElement.props.style).toMatchObject({
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white'
        });
    });

    it('displays an image when imageURL is provided', () => {
        const { getByTestId } = render(<Card title={title} imageURL={imageURL} />);
        const image = getByTestId('card-image');
        expect(image.props.source.uri).toBe(imageURL);
    });

    it('does not display an image when no imageURL is provided', () => {
        const { queryByTestId } = render(<Card title={title} />);
        expect(queryByTestId('card-image')).toBeNull();
    });
});
