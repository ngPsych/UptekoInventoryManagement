import { useState, useEffect } from 'react';
import { getFileDownloadURL } from '../services/firebase/storageManagement';

export const useImageURL = (imageKey: string) => {
    const [imageURL, setImageURL] = useState<string | null>(null);

    useEffect(() => {
        const fetchImageURL = async () => {
            try {
                const savedImageURL = localStorage.getItem('imageURL');
                if (savedImageURL) {
                    setImageURL(savedImageURL);
                } else {
                    const url = await getFileDownloadURL(imageKey);
                    setImageURL(url);
                    localStorage.setItem('imageURL', url);
                }
            } catch (error) {
                console.error("Error fetching image URL: ", error);
            }
        };

        fetchImageURL();
    }, [imageKey]);

    return imageURL;
};
