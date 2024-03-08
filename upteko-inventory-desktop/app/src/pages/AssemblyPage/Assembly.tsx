import React, { useState, useEffect } from 'react';
import styles from './Assembly.module.css';
import { NavigationBar } from '../../components/NavBar/NavBar';
import { useRequireAuth } from "../../hooks/useRequireAuth"
import { CreateNewAssemblyPopupCard } from '../../components/PopupCard/CreateNewAssemblyPopupCard';
import { Card } from '../../components/Card/Card';
import { subscribeToAssemblyItems, subscribeToSubassemblyItems } from '../../services/firebase/assemblyManagement';
import { AssemblyItem } from '../../interfaces/IAssemblyItem';
import { CreatePopup } from '../../components/PopupCard/Test/CreatePopup';

export default function AssemblyPage() {
    useRequireAuth();
    const MemoizedAssemblyCard = React.memo(Card);

    const [showCreateNewAssemblyPopup, setShowCreateNewAssemblyPupop] = useState(false);
    const [assemblyItems, setAssemblyItems] = useState<AssemblyItem[]>([]);
    const [subassemblyItems, setSubassemblyItems] = useState<AssemblyItem[]>([]);
    const [selectedAssemblyId, setSelectedAssemblyId] = useState<string | null>(null);

    const [showTest, setShowTest] = useState(false);

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
                <div>
                    <button onClick={() => setShowCreateNewAssemblyPupop(true)}>Create new assembly</button>
                    <button onClick={() => setShowTest(true)}>CREATE TEST</button>
                </div>
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

            {/* remove below later, this is for testing*/}
            {showTest && (
                <CreatePopup
                    onClose={() => setShowTest(false)}
                />
            )}

            <div className={styles.assemblyCardContainer}>
                {subassemblyItems.length === 0 ? (
                    assemblyItems.map(item => (
                        <div key={item.id} className={styles.assemblyCard} onClick={() => handleAssemblyCardClick(item.id)}>
                            <MemoizedAssemblyCard imgSrc={item.imageURL} title={item.id}/>
                        </div>
                    ))
                ) : (
                    subassemblyItems.map(item => (
                        <div key={item.id} className={styles.assemblyCard}>
                            <MemoizedAssemblyCard imgSrc={item.imageURL} title={item.id} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
