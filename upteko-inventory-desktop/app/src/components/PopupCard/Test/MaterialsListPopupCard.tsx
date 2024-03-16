import React, { useState } from 'react';
import styles from './MaterialsListPopupCard.module.css';
import { Material } from '../../../interfaces/IAssembly';
import { updateItemQuantity } from '../../../services/firebase/inventoryManagement';
import ExitConfirmationPopup from '../ExitConfirmationPopup';
import QRCodeGenerator from '../../QRCode/QRCodeGenerator';

interface MaterialListPopupCardProps {
    onClose: () => void;
    assemblyId: string | null;
    subAssemblyId: string | null;
    materials: Material[];
}

const MaterialListPopupCard: React.FC<MaterialListPopupCardProps> = ({ onClose, assemblyId, subAssemblyId, materials }) => {
    const [checkedMaterials, setCheckedMaterials] = useState<{ [id: string]: boolean }>({});
    const [showExitConfirmation, setShowExitConfirmation] = useState(false);

    const handleExitButton = () => {
        setShowExitConfirmation(true);
    }

    // Clicking on "Yes" in the exit confirmation
    const handleSaveProgress = () => {

    }

    // Clicking on "No" in the exit confirmation
    const handleNoSaveProgress = () => {
        materials.forEach(material => {
            if (checkedMaterials[material.id]) {
                try {
                    updateItemQuantity("parts", material.id, material.quantity, "add");
                } catch (error) {
                    console.error("[MaterialListPopupCard] Error reverting item quantity:", error);
                }
            }
        });
        onClose();
    }

    const handleCheckboxChange = (material: Material) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            try {
                console.log(`Checked for ${material.id}`);
                setCheckedMaterials(prev => ({ ...prev, [material.id]: true }));

                updateItemQuantity("parts", material.id, material.quantity, "remove");
            } catch (error) {
                console.error("[MaterialListPopupCard] Error updating item quantity when checked:", error);
                throw error;
            }
        }
    };

    return (
        <div className={styles.popupContainer}>
            <div className={styles.popupCard}>
                <h1>{subAssemblyId} ASSEMBLY MATERIALS LIST</h1>
                <button className={styles.exitButton} onClick={handleExitButton}>EXIT</button>
                
                {/* LIST OF MATERIALS*/}
                <ul>
                    {materials.map((material) => (
                        <li key={material.id}>
                            <input
                                type="checkbox"
                                id={material.id}
                                onChange={handleCheckboxChange(material)}
                                disabled={checkedMaterials[material.id]}
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
                    <QRCodeGenerator itemNumber={`CONFIRM:${subAssemblyId}` ?? 'undefined'} size={150}/>
                    <p>To confirm the sub-assembly is finished, please scan the QR code in the App.</p>
                </div>
            </div>

            {showExitConfirmation && (
                <ExitConfirmationPopup 
                    confirmationText="Do you want to save the progress?"
                    onConfirmExit={onClose}
                    onCancelExit={() => handleNoSaveProgress()}
                />
            )}

        </div>
    );
}

export default MaterialListPopupCard