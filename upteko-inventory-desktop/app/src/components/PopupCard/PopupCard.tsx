import React, { useState, useRef } from 'react';
import { Item } from '../../interfaces/IItem';
import styles from './PopupCard.module.css';
import { formatFirestoreTimestamp } from '../../utils/timeFormat';
import { addNewPart, CreateNewAssembly } from '../../services/firebase/inventoryManagement';
import { QRCodeGenerator } from '../QRCode/QRCodeGenerator';
import { useReactToPrint } from 'react-to-print';
import { getFileDownloadURL, uploadFile } from '../../services/firebase/storageManagement';

interface PopupCardProps {
    item?: Item;
    onClose: () => void;
}

export const PartPopupCard: React.FC<PopupCardProps> = ({ item, onClose }) => {
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <div className={styles.popupContainer} onClick={onClose}>
            <div className={styles.popupCard} onClick={(e) => e.stopPropagation()}>
                <button onClick={handlePrint}>Print</button>
                    <div className={styles.printable} ref={componentRef}>
                        <QRCodeGenerator itemNumber={item?.sku ?? 'undefined'} size={150} />
                        <h2>{item?.sku}</h2>
                        <div>
                            <p>Name: {item?.name}</p>
                            <p>Quantity: {item?.quantity}</p>
                            <p>Location: {item?.location}</p>
                            <p>Description: {item?.description}</p>
                            <p>Last Modified: {item ? formatFirestoreTimestamp(item.lastModified) : ''}</p>
                            <p>Supplier: {item?.supplier}</p>
                            <p>Supplier Item Number: {item?.supplierItemNumber}</p>
                            <p>Reorder Point: {item?.minPoint}</p>
                        </div>
                    </div>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};


export const AddNewPartPopupCard: React.FC<PopupCardProps> = ({ onClose }) => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [supplier, setSupplier] = useState('');
    const [supplierItemNumber, setSupplierItemNumber] = useState('');
    const [minPoint, setMinPoint] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addNewPart(id, name, quantity, location, description, supplier, supplierItemNumber, minPoint);
            // Add on success, popup changes to "Added new part" then slowly fade away
            onClose();
        } catch (error) {
            console.error('Error adding new part:', error);
            throw error;
        }
    };

    return (
        <div className={styles.popupContainer} onClick={onClose}>
            <div className={styles.popupCard} onClick={(e) => e.stopPropagation()}>
                <h2>Add New Part</h2>

                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} />
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
                    <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                    <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <input type="text" placeholder="Supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
                    <input type="text" placeholder="Supplier Item Number" value={supplierItemNumber} onChange={(e) => setSupplierItemNumber(e.target.value)} />
                    <input type="number" placeholder="Reorder Point" value={minPoint} onChange={(e) => setMinPoint(parseInt(e.target.value))} />

                    <button type="submit">Add Part</button>
                    <button onClick={onClose}>Close</button>
                </form>
            </div>
        </div>
    );
};

export const CreateNewAssemblyPopupCard: React.FC <PopupCardProps> = ({ onClose }) => {
    const [name, setName] = useState('');
    const [subNames, setSubNames] = useState<string[]>(['']);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleAddSubName = () => {
        setSubNames([...subNames, '']);
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
            await CreateNewAssembly(imageURL, name, subNames);
            onClose();
        } catch (error) {
            console.log("Error creating new assembly");
            throw error;
        }

    };

    return (
        <div className={styles.popupContainer} onClick={onClose}>
            <div className={styles.popupCard} onClick={(e) => e.stopPropagation()}>
                <h2>Add Assembly</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name:</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label>Sub-assembly:</label>
                        {subNames.map((subName, index) => (
                            <div key={index}>
                                <input
                                    type="text"
                                    value={subName}
                                    onChange={(e) => handleSubNameChange(index, e.target.value)}
                                />
                            </div>
                        ))}
                        <button type="button" onClick={handleAddSubName}>+</button>
                    </div>
                    <div>
                        <label>Upload Image:</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} />
                    </div>
                    <button type="submit">Submit</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};
