import React, { useState, useRef } from 'react';
import styles from './PopupCard.module.css';
import { formatFirestoreTimestamp } from '../../utils/timeFormat';
import { addNewPart } from '../../services/firebase/inventoryManagement';
import { createNewAssembly } from '../../services/firebase/assemblyManagement';
import { QRCodeGenerator } from '../QRCode/QRCodeGenerator';
import { useReactToPrint } from 'react-to-print';
import PopupCardProps from '../../interfaces/IPopupCardProps';

export const PartPopupCard: React.FC<PopupCardProps> = ({ item, onClose }) => {
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const downloadQRCode = () => {
        const canvas = document.querySelector('canvas'); // Get the canvas element
        const pngUrl = canvas?.toDataURL('image/png'); // Convert the canvas to a PNG image
        if (pngUrl && item?.sku) {
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = `${item.sku}.png`; // Set the download filename using the SKU
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    return (
        <div className={styles.popupContainer} onClick={onClose}>
            <div className={styles.popupCard} onClick={(e) => e.stopPropagation()}>
                <button onClick={handlePrint}>Print</button>
                <button onClick={downloadQRCode}>Download QR Code</button>
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