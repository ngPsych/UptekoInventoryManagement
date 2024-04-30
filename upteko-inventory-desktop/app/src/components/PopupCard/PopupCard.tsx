import React, { useState, useRef } from 'react';
import styles from './PopupCard.module.css';
import { formatFirestoreTimestamp } from '../../utils/timeFormat';
import { addNewPart } from '../../services/firebase/inventoryManagement';
import QRCodeGenerator from '../QRCode/QRCodeGenerator';
import { useReactToPrint } from 'react-to-print';
import PopupCardProps from '../../interfaces/IPopupCardProps';
import { generateUniquePartID } from '../../services/firebase/IDGenerationService';
import { Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    // Checks if the item.supplier is a url link first
    const handleReorderButton = () => {
        if (item?.supplier) {
            // Regular expression to check if the supplier is a URL
            const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
            if (urlRegex.test(item.supplier)) {
                // Open the supplier link in a new tab
                window.open(item.supplier, '_blank');
            } else {
                console.log("No link to supplier");
            }
        } else {
            console.log("No supplier information available");
        }
    };

    return (
        <div className={styles.popupContainer} onClick={onClose}>
            <div className={styles.popupCard} onClick={(e) => e.stopPropagation()}>
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
                <button onClick={handlePrint}>Print</button>
                <button onClick={downloadQRCode}>Download QR Code</button>
                <button onClick={handleReorderButton}>Reorder</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};


export const AddNewPartPopupCard: React.FC<PopupCardProps> = ({ onClose }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [supplier, setSupplier] = useState('');
    const [supplierItemNumber, setSupplierItemNumber] = useState('');
    const [minPoint, setMinPoint] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Check if any required field is empty
        if (!name || quantity === 0 || !location || !supplier || !supplierItemNumber || minPoint === 0) {
            toast.error("Please fill in all required fields", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Zoom
            });
            return;
        }
        try {
            const newUniqueID = await generateUniquePartID();
    
            await addNewPart(newUniqueID, name, quantity, location, description, supplier, supplierItemNumber, minPoint);
    
            // Notify
            toast.success("Successfully added a new part to the inventory", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Zoom
            });
    
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
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10))} />
                    <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                    <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <input type="text" placeholder="Supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
                    <input type="text" placeholder="Supplier Item Number" value={supplierItemNumber} onChange={(e) => setSupplierItemNumber(e.target.value)} />
                    <input type="number" placeholder="Reorder Point" value={minPoint} onChange={(e) => setMinPoint(parseInt(e.target.value, 10))} />
        
                    <button type="submit">Add Part</button>
                    <button type="button" onClick={onClose}>Close</button>
                </form>
            </div>
        </div>
    
    );
};