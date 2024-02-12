import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NavBar.module.css';
import { useUserInfo } from '../../hooks/useUserInfo';
import uptekoLogoWhite from '../../assets/upteko/upteko_logo_white.png'
import dashboardIcon from '../../assets/icons/dashboard.png';
import inventoryIcon from '../../assets/icons/inventory.png';
import assemblyIcon from '../../assets/icons/tools.png';
import orderIcon from '../../assets/icons/shopping-cart.png';
import adminIcon from '../../assets/icons/admin.png';
import userIcon from "../../assets/icons/user.png";

export const NavigationBar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const { userInfo, handleLogout } = useUserInfo();

    const initialPage = window.location.hash.substr(2) || 'dashboard';
    const [activePage, setActivePage] = useState(initialPage);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const onLogout = () => {
        handleLogout()
            .then(() => navigate('/'))
            .catch((error) => console.error('Logout error:', error));
    };

    useEffect(() => {
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
                <img src={uptekoLogoWhite} alt=""/>
                {/* {imageURL && <img src={imageURL} alt="Upteko Icon" draggable="false" />} */}
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
                    <a href="javascript:void(0)" onClick={onLogout} draggable="false">Sign out</a>
                </div>
            </div>
        </div>
    );
};
