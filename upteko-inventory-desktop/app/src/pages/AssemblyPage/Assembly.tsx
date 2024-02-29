import React, { useState, useEffect } from 'react';
import styles from './Assembly.module.css';
import { NavigationBar } from '../../components/NavBar/NavBar';
import { useRequireAuth } from "../../hooks/useRequireAuth"
import { CreateNewAssemblyPopupCard } from '../../components/PopupCard/PopupCard';
import { Card } from '../../components/Card/Card';
import Lark from "../../assets/upteko/Lark.jpg";
import { getAllAssemblyItems } from '../../services/firebase/inventoryManagement';
import { AssemblyItem } from '../../interfaces/IAssemblyItem';

export default function AssemblyPage() {
    useRequireAuth();

    const [showCreateNewAssemblyPopup, setShowCreateNewAssemblyPupop] = useState(false);
    const [assemblyItems, setAssemblyItems] = useState<AssemblyItem[]>([]);

    useEffect(() => {
        const unsubscribe = getAllAssemblyItems(items => {
            setAssemblyItems(items);
        });

        // Return a cleanup function to unsubscribe when the component unmounts
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <div className={styles.assemblyContainer}>
            <NavigationBar />
            <button onClick={() => setShowCreateNewAssemblyPupop(true)}>Create new assembly</button>

            {showCreateNewAssemblyPopup && (
                <CreateNewAssemblyPopupCard
                    onClose={() => setShowCreateNewAssemblyPupop(false)}
                />
            )}

            <div className={styles.assemblyCardContainer}>
                {assemblyItems.map(item => (
                    <div key={item.id} className={styles.assemblyCard}>
                        <Card imgSrc={Lark} title={item.id}/>
                    </div>
                ))}
            </div>
        </div>
    );
}