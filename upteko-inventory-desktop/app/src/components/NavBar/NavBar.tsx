import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NavBar.module.css';
import { getFileDownloadURL } from '../../services/firebase/storageManagement';
import { getCurrentUserInfo } from '../../services/firebase/userManagement';
import { getCurrentUser, signOutUser } from '../../services/firebase/authentication';
import { User } from '../../interfaces/IUser'
import dashboardIcon from '../../assets/icons/dashboard.png';
import inventoryIcon from '../../assets/icons/inventory.png';
import assemblyIcon from '../../assets/icons/tools.png';
import orderIcon from '../../assets/icons/shopping-cart.png';
import adminIcon from '../../assets/icons/admin.png';
import userIcon from "../../assets/icons/user.png";

export const NavigationBar = () => {
    const navigate = useNavigate();
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [activePage, setActivePage] = useState('dashboard'); // Default active page
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [userInfo, setUserInfo] = useState<User | null>(null);

    const handleLogout = () => {
        signOutUser()
            .then(() => {
                navigate('/'); // Redirect to login page after logout
            })
            .catch((error) => {
                console.error('Logout error:', error);
                // Handle error here, perhaps show a notification
            });
    };

    useEffect(() => {
        const fetchImageURL = async () => {
            try {
                const savedImageURL = localStorage.getItem('imageURL');
                if (savedImageURL) {
                    setImageURL(savedImageURL);
                } else {
                    const url = await getFileDownloadURL("upteko_logo_white.png");
                    setImageURL(url);
                    localStorage.setItem('imageURL', url);
                }
            } catch (error) {
                console.error("Error fetching image URL: ", error);
            }
        };

        fetchImageURL();

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

        const handleHashChange = () => {
            const hash = window.location.hash.substr(2);
            setActivePage(hash || 'dashboard');
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const handlePageClick = (page: string) => {
        setActivePage(page);
    };

    return (
        <div className={styles.navbar}>
            <div className={styles.logo}>
                {imageURL && <img src={imageURL} alt="Upteko Icon" draggable="false" />}
            </div>
            <div className={styles.pages}>
                <ul>
                    <li className={activePage === 'dashboard' ? styles.active : ''}>
                        <a href="#/dashboard" onClick={() => handlePageClick('dashboard')} draggable="false">
                            <img src={dashboardIcon} alt="" className={styles.icon}/>
                            Dashboard
                        </a>
                    </li>
                    <li className={activePage === 'inventory' ? styles.active : ''}>
                        <a href="#/inventory" onClick={() => handlePageClick('inventory')} draggable="false">
                        <img src={inventoryIcon} alt="" className={styles.icon} />
                            Inventory
                        </a>
                    </li>
                    <li className={activePage === 'assembly' ? styles.active : ''}>
                        <a href="#/assembly" onClick={() => handlePageClick('assembly')} draggable="false">
                            <img src={assemblyIcon} alt="" className={styles.icon} />
                            Assembly
                        </a>
                    </li>
                    <li className={activePage === 'order' ? styles.active : ''}>
                        <a href="#/order" onClick={() => handlePageClick('order')} draggable="false">
                            <img src={orderIcon} alt="" className={styles.icon} />
                            Order
                        </a>
                    </li>
                    {userInfo && userInfo.role === 'Admin' && (
                        <li className={activePage === 'admin' ? styles.active : ''}>
                            <a href="#/admin" onClick={() => handlePageClick('admin')} draggable="false">
                                <img src={adminIcon} alt="" className={styles.icon} />
                                Admin
                            </a>
                        </li>
                    )}
                </ul>
            </div>
            <div className={styles.dropdown} ref={dropdownRef}>
                <button onClick={toggleDropdown} className={styles.dropbtn}>
                    <img src={userIcon} alt="" className={styles.icon} />
                    {userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : 'Loading...'}
                </button>
                <div className={`${styles.dropdownContent} ${isOpen ? styles.showDropdown : ''}`}>
                    <a href="#" draggable="false">Settings</a>
                    <a onClick={handleLogout} draggable="false">Sign out</a>
                </div>
            </div>
        </div>
    );
};
