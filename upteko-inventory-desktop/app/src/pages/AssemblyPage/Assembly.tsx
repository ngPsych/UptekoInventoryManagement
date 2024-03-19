import React, { useState, useEffect } from 'react';
import styles from './Assembly.module.css';
import { NavigationBar } from '../../components/NavBar/NavBar';
import { useRequireAuth } from "../../hooks/useRequireAuth"
import { CreateNewAssemblyPopupCard } from '../../components/PopupCard/CreateNewAssemblyPopupCard';
import { Card } from '../../components/Card/Card';
import { subscribeToAssemblyItems, subscribeToSubassemblyItems, getMaterialsNeeded, deleteAssembly, getProgressCheckedMaterials } from '../../services/firebase/assemblyManagement';
import { AssemblyItem, Material, SubAssemblyItem } from '../../interfaces/IAssembly';
import { CreatePopup } from '../../components/PopupCard/Test/CreatePopup';
import MaterialListPopupCard from '../../components/PopupCard/Test/MaterialListPopupCard';
import ExitConfirmationPopup from '../../components/PopupCard/ExitConfirmationPopup';
import { deleteImage } from '../../services/firebase/storageManagement';
import { useUserInfo } from '../../hooks/useUserInfo';

export default function AssemblyPage() {
    useRequireAuth();
    const MemoizedAssemblyCard = React.memo(Card);

    const [showCreateNewAssemblyPopup, setShowCreateNewAssemblyPupop] = useState(false);
    const [assemblyItems, setAssemblyItems] = useState<AssemblyItem[]>([]);
    const [subassemblyItems, setSubassemblyItems] = useState<SubAssemblyItem[]>([]);
    const [selectedAssemblyId, setSelectedAssemblyId] = useState<string | null>(null);
    const [selectedSubAssemblyId, setSelectedSubAssemblyId] = useState<string | null>(null);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [showMaterialListPopup, setShowMaterialListPopup] = useState(false);
    const [showTest, setShowTest] = useState(false);
    const [contextMenuState, setContextMenuState] = useState<{
        visible: boolean;
        position: { top: number; left: number };
        cardId: string | null; // Assuming cardId is of type string
    }>({
        visible: false,
        position: { top: 0, left: 0 },
        cardId: null
    });
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const currentUser = useUserInfo();
    const [checkedProgressMaterials, setCheckedProgressMaterials] = useState<string[]>([]);

    useEffect(() => {
        const fetchCheckedMaterials = async () => {
            try {
                if (selectedAssemblyId  && selectedSubAssemblyId) {
                    const mats = await getProgressCheckedMaterials(selectedAssemblyId, selectedSubAssemblyId, (currentUser.userInfo?.firstName + " " + currentUser.userInfo?.lastName));
                    setCheckedProgressMaterials(mats);
                }
            } catch (error) {
                console.error("Error fetching checked materials:", error);
            }
        };

        fetchCheckedMaterials();
    }, [selectedAssemblyId, selectedSubAssemblyId, (currentUser.userInfo?.firstName + " " + currentUser.userInfo?.lastName)]);
    
// ----- ContextMenu handler ----- //
    // Function to handle context menu with type annotations
    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>, cardId: string) => {
        event.preventDefault();
        setContextMenuState({
            visible: true,
            position: { top: event.clientY, left: event.clientX },
            cardId
        });
    };

    // Function to handle Modify action
    const handleModifyAssembly = () => {
        console.log("Modify functionality here");
        setContextMenuState({ ...contextMenuState, visible: false });
    };
    
    const handleDeleteAssembly = () => {
        // Function to delete a chosen assembly
        if (contextMenuState.cardId) {
            setShowDeleteConfirmation(false);
            deleteAssembly(contextMenuState.cardId);
            deleteImage(contextMenuState.cardId);
        } else {
            console.log("[Assembly] Missing ID to delete Assembly");
        }
    };

    const handleModifySubAssembly = (assemblyId: string) => {

    }

    const handleDeleteSubAssembly = (assemblyId: string) => {

    }

    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Element;
        if (!target.closest('.cardContainer')) {
            setContextMenuState({ ...contextMenuState, visible: false });
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [contextMenuState]);

// ----- SUBS ----- //
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

    useEffect(() => {
        // Checks if assembly and sub-assembly have been selected
        if (selectedAssemblyId && selectedSubAssemblyId) {
            getMaterialsNeeded(selectedAssemblyId, selectedSubAssemblyId)
            .then(materials => {
                setMaterials(materials as Material[]);
            })
            .catch(error => {
                console.error("[Assembly] Error fetching materials:", error);
                throw error;
            })
        } else {
            setMaterials([]);
        }
    }, [selectedAssemblyId, selectedSubAssemblyId]);

    const handleAssemblyCardClick = (assemblyId: string) => {
        setSelectedAssemblyId(assemblyId);
    };

// ----- SUB-ASSEMBLY CARD ----- //
    const handleSubAssemblyCardClick = (subAssemblyId: string) => {
        setSelectedSubAssemblyId(subAssemblyId);
        setShowMaterialListPopup(true);
    }

// ----- BUTTON HANDLERS ----- //
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

            {showMaterialListPopup && (
                <MaterialListPopupCard
                    onClose={() => setShowMaterialListPopup(false)}
                    assemblyId={selectedAssemblyId}
                    subAssemblyId={selectedSubAssemblyId}
                    materials={materials}
                    defaultCheckedIds={checkedProgressMaterials}
                />
            )}

            {showDeleteConfirmation && (
                <ExitConfirmationPopup
                    confirmationText="Do you want to DELETE this assembly?"
                    onConfirmExit={handleDeleteAssembly}
                    onCancelExit={() => setShowDeleteConfirmation(false)}
                />
            )}

            <div className={styles.assemblyCardContainer}>
                {subassemblyItems.length === 0 ? (
                    assemblyItems.map(item => (
                        <div key={item.id} className={styles.assemblyCard} onClick={() => handleAssemblyCardClick(item.id)}>
                            <MemoizedAssemblyCard
                                imgSrc={item.imageURL}
                                title={item.id}
                                onContextMenu={handleContextMenu}
                                cardId={item.id}
                                isContextMenuVisible={contextMenuState.cardId === item.id && contextMenuState.visible}
                                contextMenuPosition={contextMenuState.position}
                                handleModify={handleModifyAssembly}
                                handleDelete={() => {setShowDeleteConfirmation(true); setContextMenuState({ ...contextMenuState, visible: false })}}
                            />
                        </div>
                    ))
                ) : (
                    subassemblyItems.map(item => (
                        <div key={item.sku} className={styles.assemblyCard} onClick={() => handleSubAssemblyCardClick(item.sku)}>
                            <MemoizedAssemblyCard
                                imgSrc={item.imageURL}
                                title={item.name}
                                onContextMenu={handleContextMenu}
                                cardId={item.sku}
                                isContextMenuVisible={contextMenuState.cardId === item.sku && contextMenuState.visible}
                                contextMenuPosition={contextMenuState.position}
                                handleModify={handleModifyAssembly}
                                handleDelete={handleDeleteAssembly}
                                selectedAssemblyId={selectedAssemblyId}
                                subAssemblyId={item.sku}
                                userFullName={currentUser.userInfo?.firstName + " " + currentUser.userInfo?.lastName}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}