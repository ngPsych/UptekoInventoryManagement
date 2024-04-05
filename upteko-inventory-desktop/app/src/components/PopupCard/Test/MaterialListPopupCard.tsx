import React, { useState, useEffect } from 'react';
import styles from './MaterialListPopupCard.module.css';
import { Material } from '../../../interfaces/IAssembly';
import { updateItemQuantity } from '../../../services/firebase/inventoryManagement';
import ExitConfirmationPopup from '../ExitConfirmationPopup';
import QRCodeGenerator from '../../QRCode/QRCodeGenerator';
import { saveSubAssemblyProgress } from '../../../services/firebase/assemblyManagement';

interface MaterialListPopupCardProps {
    onClose: () => void;
    assemblyId: string | null;
    subAssemblyId: string | null;
    materials: Material[];
    defaultCheckedIds?: string[]; // Now an optional prop
    currentUserFullName: string;
    progressId: Promise<string | null>;
}

const MaterialListPopupCard: React.FC<MaterialListPopupCardProps> = ({ onClose, assemblyId, subAssemblyId, materials, defaultCheckedIds = [], currentUserFullName, progressId}) => {
    const initialCheckedState = materials.reduce((acc, material) => {
        acc[material.id] = defaultCheckedIds.includes(material.id);
        return acc;
    }, {} as {[id: string]: boolean});

    const [checkedMaterials, setCheckedMaterials] = useState<{ [id: string]: boolean }>(initialCheckedState);

    useEffect(() => {
        // Update checked state when defaultCheckedIds change
        const updatedCheckedState = materials.reduce((acc, material) => {
            acc[material.id] = defaultCheckedIds.includes(material.id);
            return acc;
        }, {} as {[id: string]: boolean});
        
        setCheckedMaterials(updatedCheckedState);
    }, [defaultCheckedIds, materials]); // Listen for changes in defaultCheckedIds and materials


    const handleExitButton = () => {
        handleSaveProgress();
        onClose();
    }

    // Clicking on "Yes" in the exit confirmation
    const handleSaveProgress = () => {
        if (assemblyId && subAssemblyId) {
            const checkedMaterialIds = Object.keys(checkedMaterials).filter(id => checkedMaterials[id]);
            const materialIds = materials.map(material => material.id); // Extracting only the ids
            console.log(materialIds);
            saveSubAssemblyProgress(assemblyId, subAssemblyId, checkedMaterialIds, materialIds, currentUserFullName); // Pass materialIds instead of materials
            onClose();
        }
    }

    const test = () => {
        const existingMaterials = materials.filter(material => checkedMaterials[material.id]);
        console.log(existingMaterials);
    }

    const handleCheckboxChange = (material: Material) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
    
        // Update checked state
        setCheckedMaterials(prevState => ({
            ...prevState,
            [material.id]: isChecked
        }));
    
        // Handle quantity update based on checkbox state, skip if initially checked
        if (!defaultCheckedIds.includes(material.id)) {
            try {
                if (isChecked) {
                    updateItemQuantity("parts", material.id, material.quantity, "remove");
                } else {
                    updateItemQuantity("parts", material.id, material.quantity, "add");
                }
            } catch (error) {
                console.error("[MaterialListPopupCard] Error updating item quantity:", error);
            }
        }
    };
    

    return (
        <div className={styles.popupContainer}>
            <div className={styles.popupCard}>
                <h1>{subAssemblyId} ASSEMBLY MATERIALS LIST</h1>
                <button className={styles.exitButton} onClick={handleExitButton}>EXIT</button>
                <button onClick={test}>Test</button>
                
                {/* LIST OF MATERIALS*/}
                <ul>
                    {materials.map((material) => (
                        <li key={material.id}>
                            <input
                                type="checkbox"
                                id={material.id}
                                onChange={handleCheckboxChange(material)}
                                disabled={checkedMaterials[material.id]}
                                checked={checkedMaterials[material.id]}
                            />
                            <label htmlFor={material.id}>
                                {material.quantity}x [{material.id}] - {material.name}
                            </label>
                        </li>
                    ))}
                </ul>

                {/* SUBASSEMBLY IMAGE*/}

                {/* QR CODE CONTAINER*/}
                <div>
                    <QRCodeGenerator itemNumber={`CONFIRM:${progressId}` ?? 'undefined'} size={150}/>
                    <p>To confirm the sub-assembly is finished, please scan the QR code in the App.</p>
                </div>
            </div>
        </div>
    );
}

export default MaterialListPopupCard