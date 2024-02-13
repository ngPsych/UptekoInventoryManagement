import React, { useState } from 'react';
import { Item } from '../../interfaces/IItem';
import styles from './PopupCard.module.css';
import { formatFirestoreTimestamp } from '../../utils/timeFormat';
import { addNewMaterial } from '../../services/firebase/inventoryManagement';

interface PopupCardProps {
    item?: Item;
    onClose: () => void;
}

export const MaterialPopupCard: React.FC<PopupCardProps> = ({ item, onClose }) => {
    return (
        <div className={styles.popupContainer} onClick={onClose}>
            <div className={styles.popupCard} onClick={(e) => e.stopPropagation()}>
                <h2>{item?.name}</h2>
                <p>SKU: {item?.sku}</p>
                <p>Name: {item?.name}</p>
                <p>Quantity: {item?.quantity}</p>
                <p>Location: {item?.location}</p>
                <p>Description: {item?.description}</p>
                <p>Last Modified: {item ? formatFirestoreTimestamp(item.lastModified) : ''}</p>
                <p>Supplier: {item?.supplier}</p>
                <p>Supplier Item Number: {item?.supplierItemNumber}</p>
                <p>Reorder Point: {item?.minPoint}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export const AddNewMaterialPopupCard: React.FC<PopupCardProps> = ({ onClose }) => {
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
            await addNewMaterial(id, name, quantity, location, description, supplier, supplierItemNumber, minPoint);
            // Assuming addNewMaterial succeeds, you can do any additional logic here like showing a success message or closing the popup.
            onClose();
        } catch (error) {
            console.error('Error adding new material:', error);
            // Handle error appropriately, e.g., show an error message.
        }
    };

    return (
        <div className={styles.popupContainer} onClick={onClose}>
            <div className={styles.popupCard} onClick={(e) => e.stopPropagation()}>
                <h2>Add New Material</h2>

                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} />
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
                    <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                    <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <input type="text" placeholder="Supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
                    <input type="text" placeholder="Supplier Item Number" value={supplierItemNumber} onChange={(e) => setSupplierItemNumber(e.target.value)} />
                    <input type="number" placeholder="Reorder Point" value={minPoint} onChange={(e) => setMinPoint(parseInt(e.target.value))} />

                    <button type="submit">Add Material</button>
                </form>

                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};
