import React, { useState, useEffect, useRef } from 'react';
import styles from './AddMatPopup.module.css'
import CustomSelect from '../../DropDown/CustomSelect';
import ExitConfirmationPopup from '../ExitConfirmationPopup';
import { subscribeToInventoryParts } from '../../../services/firebase/inventoryManagement';

interface AddMaterialsPopupCardProps {
    onClose: () => void;
    onSelectMaterial: (index: number, materials: { sku: string; name: string, quantity: number }[]) => void;
    index: number;
}

const AddMatPopup: React.FC<AddMaterialsPopupCardProps> = ({ onClose, onSelectMaterial, index }) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const [selectedMaterials, setSelectedMaterials] = useState<{ sku: string; name: string, quantity: number }[]>([]);
    const [materials, setMaterials] = useState<{ sku: string; name: string }[]>([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectMaterialNames, setSelectMaterialNames] = useState<string[]>(['', '', '', '', '']);
    const [materialCount, setMaterialCount] = useState(selectMaterialNames.length);
    const [selectMaterialQuantities, setSelectMaterialQuantities] = useState<number[]>(Array.from({ length: selectMaterialNames.length }, () => 1));
    const [inputsEnabled, setInputsEnabled] = useState<boolean[]>(Array.from({ length: selectMaterialNames.length }, () => false));
    const [selectInputsEnabled, setSelectInputsEnabled] = useState<boolean[]>(Array.from({ length: selectMaterialNames.length }, (_, i) => i === 0));

    const handleSelectMaterialChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newCustomSelect = [...selectMaterialNames];
        newCustomSelect[index] = event.target.value;
        setSelectMaterialNames(newCustomSelect);
    }

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
                // setShowConfirmation(true);
                if (selectedMaterials.length > 0) {
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
    }, [onClose, selectedMaterials]);

// This is the handler for the CustomSelect when selecting a material
    const handleSelectMaterial = (material: { sku: string; name: string }, quantity: number, index: number) => {
        const existingMaterialIndex = selectedMaterials.findIndex(item => item && item.sku === material.sku);

        if (existingMaterialIndex !== -1) {
            // If material already exists at index, update it with new sku and name
            const updatedMaterials = [...selectedMaterials];
            updatedMaterials[existingMaterialIndex] = { ...updatedMaterials[existingMaterialIndex], sku: material.sku, name: material.name };
            setSelectedMaterials(updatedMaterials);
        } else {
            // Otherwise, add new material at index with provided quantity
            setSelectedMaterials(prevMaterials => [
                ...prevMaterials.slice(0, index),
                { ...material, quantity },
                ...prevMaterials.slice(index + 1)
            ]);
        }

        // Handles quantity input fields
        const newInputsEnabled = [...inputsEnabled];
        newInputsEnabled[index] = true;
        setInputsEnabled(newInputsEnabled);

        // Handles selection fields
        const newSelectInputsEnabled = [...selectInputsEnabled];
        if (index < selectMaterialNames.length - 1) {
            newSelectInputsEnabled[index + 1] = true;
        }
        setSelectInputsEnabled(newSelectInputsEnabled);
    };

    // To add more selects
    const handleAddSelectMaterial = () => {
        setSelectMaterialNames([...selectMaterialNames, '']);
        setSelectMaterialQuantities([...selectMaterialQuantities, 1]); // Set initial quantity as 1 for new select
        const newCount = materialCount + 1;
        setMaterialCount(newCount);
    }

    // To remove selects
    const handleRemoveSelectMaterial = (index: number) => {
        if (selectMaterialNames.length > 1) {
            const newCount = materialCount - 1;
            setMaterialCount(newCount);
            const newSelectMaterialNames = [...selectMaterialNames];
            const newSelectMaterialQuantities = [...selectMaterialQuantities];
            newSelectMaterialNames.splice(index, 1)
            newSelectMaterialQuantities.splice(index, 1)
            setSelectMaterialNames(newSelectMaterialNames)
            setSelectMaterialQuantities(newSelectMaterialQuantities)
            if (selectedMaterials.length >= materialCount) {
                const newSelectedMaterials = selectedMaterials.slice(0, -1);
                setSelectedMaterials(newSelectedMaterials);
            }
        }
    }

    // This is the handle for when clicking on the Select button
    const handleMaterialSelect = () => {
        const selectedMaterialsCount = selectedMaterials.filter(material => material.sku !== "").length;
        console.log(selectedMaterials.filter(material => material.sku !== ""));
        if (selectedMaterialsCount === selectMaterialNames.length && selectedMaterialsCount > 0) {
            // All selected CustomSelects have been used and selected
            onSelectMaterial(index, selectedMaterials);
            onClose();
        } else {
            // Show a message indicating that not all materials are selected
            const alertText = document.querySelector(`.${styles.alertText}`);
            if (alertText) {
                alertText.textContent = "Please select a material for each option or remove the non-selected.";
                alertText.classList.add(styles.showAlert);
                setTimeout(() => {
                    alertText.classList.remove(styles.showAlert);
                }, 3000); // Remove alert after 3 seconds
            }
        }
    }
    
    const handleQuantityInputChange = (index: number, value: string) => {
        const parsedValue = parseInt(value);
        if (!isNaN(parsedValue)) {
            const newQuantities = [...selectMaterialQuantities];
            newQuantities[index] = parsedValue;
            setSelectMaterialQuantities(newQuantities);
            const newSelectedMaterials = [...selectedMaterials];
            newSelectedMaterials[index].quantity = parsedValue;
            setSelectedMaterials(newSelectedMaterials);
        }
    }

    const handleTest = () => {
        console.log(selectedMaterials);
        console.log(materialCount)
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.popup} ref={popupRef}>
                <h2>Choose material(s)</h2>
                <div className={styles.materialTitleContainer}>
                    <h3>Index</h3>
                    <h3>Material</h3>
                    <h3>Quantity</h3>
                </div>
                {selectMaterialNames.map((value, index) => (
                    <div key={index} className={styles.selectContainer}>
                        <span>{index + 1}.</span>
                        <CustomSelect
                            options={materials.map(material => ({
                                value: material.sku,
                                label: `[${material.sku}] ${material.name}`
                            }))}
                            onSelect={(material) => handleSelectMaterial(material, parseInt((document.getElementsByClassName(styles.quantityInput)[index] as HTMLInputElement).value), index)}
                            onChange={(event) => handleSelectMaterialChange(index, event)}
                            disabled={!selectInputsEnabled[index]} // Disable CustomSelect if selectInputsEnabled for the index is false
                        />
                        
                        <input 
                            type="number" 
                            className={styles.quantityInput} 
                            min="1" 
                            value={selectMaterialQuantities[index]} 
                            onChange={(e) => handleQuantityInputChange(index, e.target.value)}
                            disabled={!inputsEnabled[index]} // Disable input if inputsEnabled for the index is false
                            title={!inputsEnabled[index] ? "Please select material first" : ""} // Tooltip message for hover
                        />
                    </div>
                ))}

                <div className={styles.materialButtonContainer}>
                    <button onClick={handleAddSelectMaterial}>+</button>
                    {selectMaterialNames.length > 1 && (
                        <button onClick={() => handleRemoveSelectMaterial(selectMaterialNames.length - 1)}>-</button>
                    )}
                </div>

                <div className={styles.alertText}></div>

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