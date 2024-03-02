import React, { useState, useEffect } from 'react';
import styles from './Assembly.module.css';
import { NavigationBar } from '../../components/NavBar/NavBar';
import { useRequireAuth } from "../../hooks/useRequireAuth"
import { CreateNewAssemblyPopupCard } from '../../components/PopupCard/PopupCard';
import { Card } from '../../components/Card/Card';
import { subscribeToAssemblyItems, subscribeToSubassemblyItems } from '../../services/firebase/inventoryManagement';
import { AssemblyItem } from '../../interfaces/IAssemblyItem';

export default function AssemblyPage() {
    useRequireAuth();

    const [showCreateNewAssemblyPopup, setShowCreateNewAssemblyPupop] = useState(false);
    const [assemblyItems, setAssemblyItems] = useState<AssemblyItem[]>([]);
    const [subassemblyItems, setSubassemblyItems] = useState<AssemblyItem[]>([]);
    const [selectedAssemblyId, setSelectedAssemblyId] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribeAssembly = subscribeToAssemblyItems(items => {
            setAssemblyItems(items);
        });

        return () => {
            unsubscribeAssembly();
        };
    }, []);

    useEffect(() => {
        if (selectedAssemblyId) {
            const unsubscribeSubassembly = subscribeToSubassemblyItems(selectedAssemblyId, items => {
                setSubassemblyItems(items);
            });
            return () => {
                unsubscribeSubassembly();
            };
        } else {
            // Clear subassembly items if no assembly is selected
            setSubassemblyItems([]);
        }
    }, [selectedAssemblyId]);

    const handleAssemblyCardClick = (assemblyId: string) => {
        setSelectedAssemblyId(assemblyId);
    };

    const handleBackButtonClick = () => {
        setSelectedAssemblyId(null);
    };

    // Remember to add functionality for this one
    const handleAddSubassemblyButtonClick = () => {

    }

    return (
        <div className={styles.assemblyContainer}>
            <NavigationBar />
            {!selectedAssemblyId && (
                <button onClick={() => setShowCreateNewAssemblyPupop(true)}>Create new assembly</button>
            )}
            {selectedAssemblyId && (
                <div>
                    <button onClick={handleBackButtonClick}>Back</button>
                    <button onClick={handleAddSubassemblyButtonClick}>Add subassembly</button>
                </div>
            )}

            {showCreateNewAssemblyPopup && (
                <CreateNewAssemblyPopupCard
                    onClose={() => setShowCreateNewAssemblyPupop(false)}
                />
            )}

            <div className={styles.assemblyCardContainer}>
                {subassemblyItems.length === 0 ? (
                    assemblyItems.map(item => (
                        <div key={item.id} className={styles.assemblyCard} onClick={() => handleAssemblyCardClick(item.id)}>
                            <Card imgSrc={item.imageURL} title={item.id}/>
                        </div>
                    ))
                ) : (
                    subassemblyItems.map(item => (
                        <div key={item.id} className={styles.assemblyCard}>
                            <Card imgSrc={item.imageURL} title={item.id} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
