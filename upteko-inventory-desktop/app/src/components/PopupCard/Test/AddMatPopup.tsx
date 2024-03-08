import React, { useState, useEffect, useRef } from 'react';
import styles from './AddMatPopup.module.css'
import CustomSelect from '../../DropDown/CustomSelect';
import ExitConfirmationPopup from '../ExitConfirmationPopup';
import { subscribeToInventoryParts } from '../../../services/firebase/inventoryManagement';

interface AddMaterialsPopupCardProps {
    onClose: () => void;
    onSelectMaterial: (index: number, material: { sku: string; name: string }) => void;
    index: number;
}

const AddMatPopup: React.FC<AddMaterialsPopupCardProps> = ({ onClose, onSelectMaterial, index }) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const [selectedMaterial, setSelectedMaterial] = useState<{ sku: string; name: string } | null>(null);
    const [materials, setMaterials] = useState<{ sku: string; name: string }[]>([]);
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToInventoryParts((items) => {
            setMaterials(items);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                setShowConfirmation(true);
                // if (selectedMaterial) {
                //     setShowConfirmation(true);
                // } else {
                //     onClose();
                // }
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [onClose, selectedMaterial]);

    // This is the handler for the CustomSelect when selecting a material
    const handleSelectMaterial = (material: { sku: string; name: string }) => {
        setSelectedMaterial(material);
    };

    // This is the handle for when clicking on the Select button
    const handleMaterialSelect = () => {
        if (selectedMaterial) {
            onSelectMaterial(index, selectedMaterial);
            setShowConfirmation(true);
        }
    }

    const handleTest = () => {
        console.log(index);
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.popup} ref={popupRef}>
                <div className={styles.selectContainer}>
                    <CustomSelect
                        options={materials.map(material => ({
                        value: material.sku,
                        label: `[${material.sku}] ${material.name}`
                        }))}
                        onSelect={handleSelectMaterial} // Pass onSelect callback
                    />
                </div>

                <div className={styles.buttonContainer}>
                        <button onClick={handleMaterialSelect}>Select</button>
                        <button onClick={onClose}>Cancel</button>
                        <button onClick={handleTest}>Test</button>
                </div>
            </div>

            {showConfirmation && (
                <ExitConfirmationPopup 
                    onConfirmExit={onClose}
                    onCancelExit={() => setShowConfirmation(false)}
                />
            )}

        </div>
    );
}

export default AddMatPopup;