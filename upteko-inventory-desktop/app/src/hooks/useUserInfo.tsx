import { useState, useEffect } from 'react';
import { getCurrentUser, signOutUser } from '../services/firebase/authentication';
import { getCurrentUserInfo } from '../services/firebase/userManagement';
import { User } from '../interfaces/IUser';

export const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState<User | null>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.email) {
                const savedUserInfo = localStorage.getItem('userInfo');
                if (savedUserInfo) {
                    setUserInfo(JSON.parse(savedUserInfo));
                } else {
                    getCurrentUserInfo(currentUser.email.toString())
                        .then(userInfo => {
                            setUserInfo(userInfo as User);
                            localStorage.setItem('userInfo', JSON.stringify(userInfo));
                        })
                        .catch(error => {
                            console.error("Error fetching user info: ", error);
                        });
                }
            } else {
                console.error("User email is not available.");
            }
        };

        fetchUserInfo();
    }, []);

    const handleLogout = () => {
        return signOutUser();
    };

    return { userInfo, handleLogout };
};
