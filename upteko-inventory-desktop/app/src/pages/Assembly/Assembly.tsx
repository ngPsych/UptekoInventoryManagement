import React, { useState, useEffect } from 'react';
import styles from './Assembly.module.css';
import { NavigationBar } from '../../components/NavBar/NavBar';
import { useRequireAuth } from "../../hooks/useRequireAuth"
import { Card } from '../../components/Card/Card';
import { subscribeToAssemblyItems, subscribeToSubassemblyItems, getMaterialsNeeded, deleteAssembly, subscribeToProgressCheckedMaterials, deleteProgress, currentUserProgressSubAssemblyExist, createSubAssemblyProgress, getProgressDocumentId, subscribeToProgressConfirmation, confirmSubAssembly } from '../../services/firebase/assemblyManagement';
import { AssemblyItem, Material, SubAssemblyItem } from '../../interfaces/IAssembly';
import { CreatePopup } from '../../components/PopupCard/CreatePopup';
import MaterialListPopupCard from '../../components/PopupCard/MaterialListPopupCard';
import ExitConfirmationPopup from '../../components/PopupCard/ExitConfirmationPopup';
import { deleteImage } from '../../services/firebase/storageManagement';
import { useUserInfo } from '../../hooks/useUserInfo';
import { generateUniqueMaterialListID } from '../../services/firebase/IDGenerationService';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AssemblyPage() {
    useRequireAuth();
    const MemoizedAssemblyCard = React.memo(Card);

    // ----- SHOW COMPONENTS ----- //
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showMaterialListPopup, setShowMaterialListPopup] = useState(false);
    const [showContinueProgressPopup, setShowContinueProgressPopup] = useState(false);
    const [showTest, setShowTest] = useState(false);
    
    const currentUser = useUserInfo();
    const currentUserFullName = currentUser.userInfo?.firstName + " " + currentUser.userInfo?.lastName;
    const [assemblyItems, setAssemblyItems] = useState<AssemblyItem[]>([]);
    const [subassemblyItems, setSubassemblyItems] = useState<SubAssemblyItem[]>([]);
    const [selectedAssemblyId, setSelectedAssemblyId] = useState<string | null>(null);
    const [selectedSubAssemblyId, setSelectedSubAssemblyId] = useState<string | null>(null);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [checkedProgressMaterials, setCheckedProgressMaterials] = useState<string[]>([]);
    const [contextMenuState, setContextMenuState] = useState<{
        visible: boolean;
        position: { top: number; left: number };
        cardId: string | null;
    }>({
        visible: false,
        position: { top: 0, left: 0 },
        cardId: null
    });

    useEffect(() => {
        const fetchCheckedMaterials = async () => {
            try {
                if (selectedAssemblyId  && selectedSubAssemblyId) {
                    subscribeToProgressCheckedMaterials(selectedAssemblyId, selectedSubAssemblyId, currentUserFullName, (checkedMaterials) => {
                        setCheckedProgressMaterials(checkedMaterials);
                    })
                }
            } catch (error) {
                console.error("Error fetching checked materials:", error);
            }
        };

        fetchCheckedMaterials();
    }, [selectedAssemblyId, selectedSubAssemblyId, currentUserFullName]);

    // Hook to check when it is confirmed.
    useEffect(() => {
        const fetchProgress = async () => {
            if (selectedAssemblyId && selectedSubAssemblyId && showMaterialListPopup) {
                try {
                        const progressId = await getProgressDocumentId(selectedAssemblyId, selectedSubAssemblyId)
                        subscribeToProgressConfirmation(selectedAssemblyId, selectedSubAssemblyId, progressId, (isConfirmed) => {
                            if (isConfirmed) {
                                setShowMaterialListPopup(false);
                                confirmSubAssembly(selectedAssemblyId, selectedSubAssemblyId, currentUserFullName);
                            }
                        });
                } catch (error) {
                    console.error("Error fetching progress", error);
                }
            }
        };

        fetchProgress();
    }, [showMaterialListPopup]);
    
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
            toast.success(`Successfully deleted Assembly: ${contextMenuState.cardId}`, {
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
        } else {
            console.log("[Assembly] Missing ID to delete Assembly");
            toast.error("Error deleting Assembly", {
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
    const handleSubAssemblyCardClick = async (subAssemblyId: string) => {
        setSelectedSubAssemblyId(subAssemblyId);
        if (selectedAssemblyId) {
            const progressExists = await currentUserProgressSubAssemblyExist(selectedAssemblyId, subAssemblyId, currentUserFullName)
            if (progressExists) {
                setShowContinueProgressPopup(true);
            } else {
                createSubAssemblyProgress(selectedAssemblyId, subAssemblyId, await generateUniqueMaterialListID(selectedAssemblyId, subAssemblyId), currentUserFullName, materials)
                setShowMaterialListPopup(true);
            }
        }
    }

    const handleDeleteProgress = async () => {
        if (selectedAssemblyId && selectedSubAssemblyId) {
            deleteProgress(selectedAssemblyId, selectedSubAssemblyId, currentUserFullName)
            setShowContinueProgressPopup(false);
            const progressId = await getProgressDocumentId(selectedAssemblyId, selectedSubAssemblyId)
            createSubAssemblyProgress(selectedAssemblyId, selectedSubAssemblyId, progressId, currentUserFullName, materials)
            setShowMaterialListPopup(true)
        }
    }

    async function getProgressId() {
        if (selectedAssemblyId && selectedSubAssemblyId) {
            return await getProgressDocumentId(selectedAssemblyId, selectedSubAssemblyId);
        }
        return null;
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
            <ToastContainer />

            {!selectedAssemblyId && (
                <div>
                    <button className={styles.createButton} onClick={() => setShowTest(true)}>Create new Assembly</button>
                </div>
            )}
            {selectedAssemblyId && (
                <div>
                    <button className={styles.createButton} onClick={handleBackButtonClick}>Back</button>
                    <button className={styles.createButton} onClick={handleAddSubassemblyButtonClick}>Add subassembly</button>
                </div>
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
                    currentUserFullName={currentUserFullName}
                    progressId={getProgressId()}
                />
            )}

            {showContinueProgressPopup && (
                <ExitConfirmationPopup
                    confirmationText="Do you want to continue your progress?"
                    onConfirmExit={() => {setShowMaterialListPopup(true); setShowContinueProgressPopup(false)}}
                    onCancelExit={handleDeleteProgress}
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
                                userFullName={currentUserFullName}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}