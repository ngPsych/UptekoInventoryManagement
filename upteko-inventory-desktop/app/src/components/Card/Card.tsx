import React, { useRef } from "react";
import styles from "./Card.module.css";

interface CardProps {
    imgSrc: string;
    title: string;
    onContextMenu: (e: React.MouseEvent<HTMLDivElement>, cardId: string) => void;
    cardId: string;
    isContextMenuVisible: boolean;
    contextMenuPosition: { top: number; left: number };
    handleModify: () => void;
    handleDelete: () => void;
}

export const Card: React.FC<CardProps> = ({
    imgSrc,
    title,
    onContextMenu,
    cardId,
    isContextMenuVisible,
    contextMenuPosition,
    handleModify,
    handleDelete
}) => {
    const cardRef = useRef<HTMLDivElement>(null);

    return (
        <div 
            className={styles.cardContainer} 
            ref={cardRef} 
            onContextMenu={(e) => onContextMenu(e, cardId)}
        >
            <img className={styles.cardImg} src={imgSrc} alt={title} />
            <h1>{title}</h1>
            {isContextMenuVisible && (
                <div 
                    className={styles.contextMenu} 
                    style={{ top: contextMenuPosition.top, left: contextMenuPosition.left }}
                >
                    <div onClick={(e) => { e.stopPropagation(); handleModify(); }}>Modify</div>
                    <div onClick={(e) => { e.stopPropagation(); handleDelete(); }}>Delete</div>
                </div>
            )}
        </div>
    );
};
