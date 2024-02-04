import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../services/firebase/authentication';
import { LoginForm } from '../component/user/LoginForm'

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Handle login logic here
        // If login is successful:
        signIn(email, password)
            .then(user => {
                console.log("Logged in successfully:", user)
                navigate('/home')
            })
            .catch(error => {
                console.error('Login error:', error);
                setError(error.message);
            })
    };

    return (
        <div>
            <LoginForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleSubmit={handleSubmit}
                error={error}
            />
        </div>
    );
};
