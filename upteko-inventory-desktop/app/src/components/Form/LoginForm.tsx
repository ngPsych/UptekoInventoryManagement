import React, { useState, useEffect } from 'react';
import styles from './LoginForm.module.css';
import { getFileDownloadURL } from '../../services/firebase/storageManagement';

interface LoginFormProps {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ email, setEmail, password, setPassword, handleSubmit }) => {
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
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                {imageURL && <img src={imageURL} alt="Upteko Icon" />}
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input 
                    className={styles.input}
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email"
                />
                <input 
                    className={styles.input}
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password"
                />
                <button className={styles.button}>Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
