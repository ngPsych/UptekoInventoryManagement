import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/firebase/authentication';

export const useRequireAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserSignIn = async () => {
        try {
            const user = await getCurrentUser();
            if (!user) {
            navigate('/');
            }
        } catch (error) {
            console.error('Error checking user sign-in:', error);
        }
        };

        checkUserSignIn();
    }, [navigate]);
};
