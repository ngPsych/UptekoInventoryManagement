import React, { useState, useEffect } from 'react';
import styles from './MaterialListPopupCard.module.css';
import { Material } from '../../../interfaces/IAssembly';
import { updateItemQuantity } from '../../../services/firebase/inventoryManagement';
import QRCodeGenerator from '../../QRCode/QRCodeGenerator';
import { saveSubAssemblyProgress } from '../../../services/firebase/assemblyManagement';

interface MaterialListPopupCardProps {
    onClose: () => void;
    assemblyId: string | null;
    subAssemblyId: string | null;
    materials: Material[];
    defaultCheckedIds?: string[];
    currentUserFullName: string;
    progressId: Promise<string | null>;
}

// custom hook
const useCheckboxChangeEffect = (checkedMaterials: { [id: string]: boolean }, handleSaveProgress: () => void) => {
    useEffect(() => {
        const handleCheckboxChange = () => {
            handleSaveProgress();
        };

        document.addEventListener('change', handleCheckboxChange);

        return () => {
            document.removeEventListener('change', handleCheckboxChange);
        };
    }, [checkedMaterials, handleSaveProgress]);
}

const MaterialListPopupCard: React.FC<MaterialListPopupCardProps> = ({ onClose, assemblyId, subAssemblyId, materials, defaultCheckedIds = [], currentUserFullName, progressId }) => {
    const [checkedMaterials, setCheckedMaterials] = useState<{ [id: string]: boolean }>({});
    const [resolvedProgressId, setResolvedProgressId] = useState<string | null>(null);

    useEffect(() => {
        const initialCheckedState = materials.reduce((acc, material) => {
            acc[material.id] = defaultCheckedIds.includes(material.id);
            return acc;
        }, {} as { [id: string]: boolean });
        setCheckedMaterials(initialCheckedState);
    }, [defaultCheckedIds, materials]);

    useEffect(() => {
        progressId.then((resolvedId) => {
            setResolvedProgressId(resolvedId);
        });
    }, [progressId]);

    const handleExitButton = () => {
        onClose();
        handleSaveProgress();
    };

    const handleSaveProgress = () => {
        if (assemblyId && subAssemblyId) {
            const checkedMaterialIds = Object.keys(checkedMaterials).filter(id => checkedMaterials[id]);
            const materialIds = materials.map(material => material.id);
            saveSubAssemblyProgress(assemblyId, subAssemblyId, checkedMaterialIds, materialIds, currentUserFullName);
        }
    };

    useCheckboxChangeEffect(checkedMaterials, handleSaveProgress);

    const handleCheckboxChange = (material: Material) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;

        setCheckedMaterials(prevState => ({
            ...prevState,
            [material.id]: isChecked
        }));

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
                
                <ul>
                    {materials.map((material) => (
                        <li key={material.id}>
                            <div className={styles.checkboxContainer}>
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
                            </div>
                        </li>
                    ))}
                </ul>

                <div className={styles.qrCodeContainer}>
                    <QRCodeGenerator itemNumber={`CONFIRM:${assemblyId}:${subAssemblyId}:${resolvedProgressId}` ?? 'undefined'} size={150}/>
                    <p className={styles.qrCodeMessage}>To confirm the sub-assembly is finished, please scan the QR code in the App.</p>
                </div>
            </div>
        </div>
    );
};

export default MaterialListPopupCard;
