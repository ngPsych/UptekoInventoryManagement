import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, getCurrentUser } from '../services/firebase/authentication';
import { LoginForm } from '../components/Form/LoginForm'

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserSignIn = async () => {
            try {
                const user = await getCurrentUser();
                if (user) {
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error('Error checking user sign-in:', error);
            }
        };

        checkUserSignIn();
    }, []); // Empty dependency array ensures the effect runs only on mount

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.clear();
        // Handle login logic here
        // If login is successful:
        signIn(email, password)
            .then(user => {
                navigate('/dashboard')
            })
            .catch(error => {
                console.error('Login error:', error);
                setError(error.message);
            })
    };

    return (
        <LoginForm 
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
            error={error}
        />
    );
};
