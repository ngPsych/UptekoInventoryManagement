import React from 'react';
import styles from './ExitConfirmationPopup.module.css';

interface ExitConfirmationPopupProps {
    onConfirmExit: () => void;
    onCancelExit: () => void;
}

const ExitConfirmationPopup: React.FC<ExitConfirmationPopupProps> = ({ onConfirmExit, onCancelExit }) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <p>Are you sure you want to exit without submitting?</p>
                <div className={styles.buttonContainer}>
                    <button onClick={onConfirmExit}>Yes</button>
                    <button onClick={onCancelExit}>No</button>
                </div>
            </div>
        </div>
    );
};

export default ExitConfirmationPopup;
