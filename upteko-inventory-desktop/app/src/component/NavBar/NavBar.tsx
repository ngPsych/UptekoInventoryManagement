import React, { useState, useEffect } from 'react';
import styles from './NavBar.module.css';
import { getFileDownloadURL } from '../../services/firebase/storageManagement';

export const NavigationBar = () => {
    const [imageURL, setImageURL] = useState<string | null>(null);

    useEffect(() => {
        const fetchImageURL = async () => {
            try {
                const url = await getFileDownloadURL("upteko_logo.png");
                setImageURL(url);
            } catch (error) {
                console.error("Error fetching image URL: ", error);
            }
        };

        fetchImageURL();
    }, []);

    return (
        <div className={styles.navbar}>
        <div className={styles.logo}>
            {imageURL && <img src={imageURL} alt="Upteko Icon" />}
        </div>
        <div className={styles.profile}>
            <button>Profile</button>
        </div>
        <div className={styles.pages}>
            <ul>
                <li className={styles.active}><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </div>
        </div>
    );
};
