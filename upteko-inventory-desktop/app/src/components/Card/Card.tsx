import React, { useRef, useState, useEffect } from "react";
import styles from "./Card.module.css";
import { currentUserOngoingSubAssemblyExist } from "../../services/firebase/assemblyManagement";

interface CardProps {
    imgSrc: string;
    title: string;
    onContextMenu: (e: React.MouseEvent<HTMLDivElement>, cardId: string) => void;
    cardId: string;
    isContextMenuVisible: boolean;
    contextMenuPosition: { top: number; left: number };
    handleModify: () => void;
    handleDelete: () => void;
    // progressExist: boolean;
    selectedAssemblyId?: string | null;
    subAssemblyId?: string;
    userFullName?: string;
}

export const Card: React.FC<CardProps> = ({
    imgSrc,
    title,
    onContextMenu,
    cardId,
    isContextMenuVisible,
    contextMenuPosition,
    handleModify,
    handleDelete,
    // progressExist,
    selectedAssemblyId,
    subAssemblyId,
    userFullName,
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [progressExist, setProgressExist] = useState<boolean>(false);

    useEffect(() => {
        const fetchProgressExistence = async () => {
            if (selectedAssemblyId && subAssemblyId && userFullName) {
                const exists = await currentUserOngoingSubAssemblyExist(selectedAssemblyId, subAssemblyId, userFullName);
                setProgressExist(exists);
            }
        };

        fetchProgressExistence();
    }, [selectedAssemblyId, subAssemblyId, userFullName]);

    return (
        <div 
            className={styles.cardContainer} 
            ref={cardRef} 
            onContextMenu={(e) => onContextMenu(e, cardId)}
        >
            {progressExist && (
                <div className={styles.progressIndicator}>!</div>
            )}
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
