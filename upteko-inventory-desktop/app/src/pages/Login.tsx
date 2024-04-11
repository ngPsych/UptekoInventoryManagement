import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, getCurrentUser } from '../services/firebase/authentication';
import { LoginForm } from '../components/Form/LoginForm'
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
    }, [navigate]); // Empty dependency array ensures the effect runs only on mount

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
                toast.error("Failed to login. Wrong e-mail or password!", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Zoom
                });
            })
    };

    return (
        <div>
            <ToastContainer />
            <LoginForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleSubmit={handleSubmit}
            />
        </div>
    );
};
