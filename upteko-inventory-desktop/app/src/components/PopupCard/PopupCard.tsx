import React from 'react';
import { Item } from '../../interfaces/IItem';
import styles from './PopupCard.module.css';
import { formatFirestoreTimestamp } from '../../utils/timeFormat';

interface PopupCardProps {
    item: Item;
    onClose: () => void;
}

const PopupCard: React.FC<PopupCardProps> = ({ item, onClose }) => {
    return (
        <div className={styles.popupContainer} onClick={onClose}>
            <div className={styles.popupCard} onClick={(e) => e.stopPropagation()}>
                <h2>{item.name}</h2>
                <p>SKU: {item.sku}</p>
                <p>Name: {item.name}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Location: {item.location}</p>
                <p>Description: {item.description}</p>
                <p>Last Modified: {formatFirestoreTimestamp(item.lastModified)}</p>
                <p>Supplier: {item.supplier}</p>
                <p>Supplier Item Number: {item.supplierItemNumber}</p>
                <p>Reorder Point: {item.minPoint}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default PopupCard;
