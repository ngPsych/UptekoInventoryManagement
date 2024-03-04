import React, { useState, useEffect, useRef } from 'react';
import { subscribeToInventoryParts } from '../../services/firebase/inventoryManagement';
import styles from './AddMaterialsPopupCard.module.css';
import ExitConfirmationPopup from './ExitConfirmationPopup';

interface AddMaterialsPopupCardProps {
    onClose: () => void;
    onSelectMaterial: (material: { sku: string; name: string }) => void;
}

const AddMaterialsPopupCard: React.FC<AddMaterialsPopupCardProps> = ({ onClose, onSelectMaterial }) => {
    const [materials, setMaterials] = useState<{ sku: string; name: string }[]>([]);
    const [selectedMaterial, setSelectedMaterial] = useState<{ sku: string; name: string } | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

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
                if (selectedMaterial) {
                    setShowConfirmation(true);
                } else {
                    onClose();
                }
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [onClose, selectedMaterial]);

    const handleMaterialSelect = () => {
        if (selectedMaterial) {
            setShowConfirmation(true);
        }
    };

    return (
        <>
            <div className={styles.overlay}>
                <div className={styles.popup} ref={popupRef}>
                    <div className={styles.selectContainer}>
                        <select
                            value={selectedMaterial ? selectedMaterial.sku : ''}
                            onChange={(e) => {
                                const selectedSku = e.target.value;
                                const material = materials.find((m) => m.sku === selectedSku);
                                setSelectedMaterial(material || null);
                            }}
                        >
                            <option value="">Select a material</option>
                            {materials.map((material) => (
                                <option key={material.sku} value={material.sku}>
                                    [{material.sku}] {material.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button onClick={handleMaterialSelect}>Select</button>
                        <button onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </div>
            {showConfirmation && (
                <ExitConfirmationPopup
                    onConfirmExit={onClose}
                    onCancelExit={() => setShowConfirmation(false)}
                />
            )}
        </>
    );
};

export default AddMaterialsPopupCard;
