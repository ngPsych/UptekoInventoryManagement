import React, { useState, useRef } from 'react';
import { createNewAssembly } from '../../services/firebase/assemblyManagement';
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

    // Function to add a new sub-assembly field
    const handleAddSubName = () => {
        const newCount = subAssemblyCount + 1; // Increment the count
        setSubAssemblyCount(newCount);
        setSubNames([...subNames, newCount.toString()]); // Add the new count as a string
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
    };

    const handleSubNameChange = (index: number, value: string) => {
        const newSubNames = [...subNames];
        newSubNames[index] = value;
        setSubNames(newSubNames);
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
                imageURL = await uploadFile(imageFile, `images/${name}`)
            } else {
                imageURL = await getFileDownloadURL("images/Default.png");
            }

            console.log("Image uploaded:", imageURL);
            await createNewAssembly(imageURL, name, subNames);
            onClose();
        } catch (error) {
            console.log("Error creating new assembly");
            throw error;
        }
    };

    const handleOpenAddMaterialsPopup = () => {
        setShowAddMaterialsPopup(true);
    };

    const handleSelectMaterial = (material: { sku: string; name: string }) => {
        // Handle the selected material
        console.log('Selected Material:', material);
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
                        {subNames.map((subName, index) => (
                            <div key={index} className={styles.subAssemblyField}>
                                <span>{subName}. </span>
                                <input type="text" className={styles.inputField} />
                                <button type="button" onClick={handleOpenAddMaterialsPopup}>
                                    Add Materials
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddSubName}>+</button>
                        {subNames.length > 1 && (
                            <button type="button" onClick={() => handleRemoveSubName(subNames.length - 1)}>-</button>
                        )}
                    </div>



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
