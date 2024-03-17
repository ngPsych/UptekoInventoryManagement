import React, { useState, useRef } from 'react';
import { createNewAssembly, testCreateNewAssembly } from '../../services/firebase/assemblyManagement';
import { getFileDownloadURL, uploadFile } from '../../services/firebase/storageManagement';
import AddMaterialsPopupCard from './AddMaterialsPopupCard';
import PopupCardProps from '../../interfaces/IPopupCardProps';
import styles from './CreateNewAssemblyPopupCard.module.css';

export const CreateNewAssemblyPopupCard: React.FC<PopupCardProps> = ({ onClose }) => {
    const [name, setName] = useState('');
    const [subAssemblyCount, setSubAssemblyCount] = useState(1); // Track the count of sub-assemblies
    const [subNames, setSubNames] = useState<string[]>(['1']);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [showAddMaterialsPopup, setShowAddMaterialsPopup] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [subAssemblyInputs, setSubAssemblyInputs] = useState<string[]>(['']);
    const [materialSKUInputs, setMaterialSKUInputs] = useState<string[]>([]);
    const [materialNameInputs, setMaterialNameInputs] = useState<string[]>([]);
    const [selectedMaterials, setSelectedMaterials] = useState<{ [key: string]: { sku: string; name: string }[] }>({});

    // Function to add a new sub-assembly field
    const handleAddSubName = () => {
        if (subNames.length < 10) {
            const newCount = subAssemblyCount + 1;
            setSubAssemblyCount(newCount);
            setSubNames([...subNames, newCount.toString()]);
        } else {
            setAlertText("Cannot exceed 10 subassemblies!");
        }
    };

    // Function to remove a sub-assembly field
    const handleRemoveSubName = (index: number) => {
        if (subNames.length > 1) {
            const newCount = subAssemblyCount - 1;
            setSubAssemblyCount(newCount);
            const newSubNames = [...subNames];
            newSubNames.splice(index, 1);
            setSubNames(newSubNames);
        }

        if (subNames.length === 10) {
            setAlertText('');
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setImageFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let imageURL = '';
            if (imageFile) {
                imageURL = await uploadFile(imageFile, `images/${name}`);
            } else {
                imageURL = await getFileDownloadURL("images/Default.png");
            }

            console.log("Image uploaded:", imageURL);
            // await createNewAssembly(imageURL, name, subAssemblyInputs);
            // await testCreateNewAssembly(imageURL, name, subAssemblyInputs, materialSKUInputs, [1, 2], materialNameInputs);
            onClose();
        } catch (error) {
            console.log("Error creating new assembly");
            throw error;
        }
    };

    const handleOpenAddMaterialsPopup = () => {
        setShowAddMaterialsPopup(true);
        console.log(subAssemblyInputs);
    };

    const handleSelectMaterial = (material: { sku: string; name: string }) => {
        // Handle the selected material
        const newMaterialSKUInputs = [...materialSKUInputs, material.sku];
        const newMaterialNameInputs = [...materialNameInputs, material.name];
        setMaterialSKUInputs(newMaterialSKUInputs);
        setMaterialNameInputs(newMaterialNameInputs);
    };

    const handleSubAssemblyInputChange = (index: number, value: string) => {
        const newSubAssemblyInputs = [...subAssemblyInputs];
        newSubAssemblyInputs[index] = value;
        setSubAssemblyInputs(newSubAssemblyInputs);
    };

    return (
        <div className={styles.popupContainer} onClick={onClose}>
            <div className={styles.popupCard} onClick={(e) => e.stopPropagation()}>
                <h2>Add Assembly</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.assemblyField}>
                        <label>Name:</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className={styles.uploadImage}>
                        <label>Upload Image:</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} />
                    </div>

                    <div>
                        <h3>Sub-assembly</h3>
                        {subNames.map((subInput, index) => (
                            <div key={index} className={styles.subAssemblyField}>
                                <span>{index + 1}. </span>
                                <input 
                                    type="text" 
                                    className={styles.inputField}
                                    onChange={(e) => handleSubAssemblyInputChange(index, e.target.value)} 
                                />
                                <button type="button" onClick={handleOpenAddMaterialsPopup}>
                                    Add Materials
                                </button>
                            </div>
                        ))}
                        <div className={styles.subassemblyButtonContainer}>
                            <button type="button" onClick={handleAddSubName}>+</button>
                            {subNames.length > 1 && (
                                <button type="button" onClick={() => handleRemoveSubName(subNames.length - 1)}>-</button>
                            )}
                        </div>
                    </div>

                    <div className={styles.alert}>{alertText}</div>

                    <div className={styles.formButtonContainer}>
                        <button type="submit">Submit</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>

                </form>
                {showAddMaterialsPopup && (
                    <AddMaterialsPopupCard
                        onClose={() => setShowAddMaterialsPopup(false)}
                        onSelectMaterial={handleSelectMaterial}
                    />
                )}
            </div>
        </div>
    );
};
