import React, { useState } from 'react';
import styles from './CreatePopup.module.css'
import PopupCardProps from '../../../interfaces/IPopupCardProps';
import { getFileDownloadURL, uploadFile } from '../../../services/firebase/storageManagement';
import AddMatPopup from './AddMatPopup';

export const CreatePopup: React.FC<PopupCardProps> = ({ onClose }) => {
    const [name, setName] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [subNames, setSubNames] = useState<string[]>(['']);
    const [subAssemblyCount, setSubAssemblyCount] = useState(0); // Used to track added subassembly
    const [showAddMatPopup, setShowAddMatPopup] = useState(false);
    const [seletedSubAssemblyIndex, setSelectedSubAssemblyIndex] = useState(0);
    const [selectedMaterials, setSelectedMaterials] = useState<{ [key: number]: { sku: string; name: string }[] }>({});

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
            // await createNewAssembly(imageURL, name, subAssemblyInputs);
            //await testCreateNewAssembly(imageURL, name, subAssemblyInputs, materialSKUInputs, [1, 2], materialNameInputs);
            onClose();
        } catch (error) {
            console.log("Error creating new assembly");
            throw error;
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setImageFile(file);
        }
    };

    const handleAddSubassembly = () => {
        if (subNames.length < 10) {
            setSubNames([...subNames, '']);
            const newCount = subAssemblyCount + 1;
            setSubAssemblyCount(newCount);
        }
    }

    const handleRemoveSubassembly = (index: number) => {
        if (subNames.length > 1) {
            const newCount = subAssemblyCount - 1;
            setSubAssemblyCount(newCount);
            const newSubNames = [...subNames];
            newSubNames.splice(index, 1);
            setSubNames(newSubNames);
        }
    }

    const handleSubassemblyChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newInputs = [...subNames];
        newInputs[index] = event.target.value;
        setSubNames(newInputs);
    };

    // ADD MATERIALS
    const handleOpenAddMatPopup = (index: number) => {
        setShowAddMatPopup(true);
        setSelectedSubAssemblyIndex(index);
    }

    const handleSelectedMaterial = (index: number, material: { sku: string, name: string }) => {
        // Create a copy of selectedMaterials to avoid mutating state directly
        const newSelectedMaterials = { ...selectedMaterials };

        // Check if the array for the given index exists
        if (!newSelectedMaterials[index]) {
            // If it doesn't exist, create a new array with the material object
            newSelectedMaterials[index] = [{ sku: material.sku, name: material.name }];
        } else {
            // If it exists, push the material object into the existing array
            newSelectedMaterials[index].push({ sku: material.sku, name: material.name });
        }

        // Update the state with the new selected materials
        setSelectedMaterials(newSelectedMaterials);
    };

    const materialTest = () => {
        console.log(selectedMaterials)
    }

    return (
        <div className={styles.popupContainer} onClick={onClose}>
            <div className={styles.popupCard} onClick={(e) => e.stopPropagation()}>
                <h2>Create new assembly</h2>

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

                        {subNames.map((value, index) => (
                            <div key={index} className={styles.subAssemblyField}>
                                <span>{index + 1}. </span>
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(event) => handleSubassemblyChange(index, event)}
                                />

                                <button type="button" onClick={() => handleOpenAddMatPopup(index)}>Add Materials</button>
                            </div>
                        ))}

                        <div className={styles.subassemblyButtonContainer}>
                            <button type="button" onClick={handleAddSubassembly}>+</button>
                            {subNames.length > 1 && (
                                <button type="button" onClick={() => handleRemoveSubassembly(subNames.length -1)}>-</button>
                            )}
                        </div>
                    </div>

                    <div className={styles.formButtonContainer}>
                        <button type="submit">Submit</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="button" onClick={materialTest}>Testing</button>
                    </div>

                </form>

                {showAddMatPopup && (
                    <AddMatPopup
                        onClose={() => setShowAddMatPopup(false)}
                        onSelectMaterial={handleSelectedMaterial}
                        index={seletedSubAssemblyIndex}
                    />
                )}

            </div>
        </div>
    );
}