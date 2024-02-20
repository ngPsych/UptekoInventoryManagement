import React from 'react';
import QRCode from 'qrcode.react';

interface QRCodeGeneratorProps {
    itemNumber: string;
    size: number;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ itemNumber, size }) => {
    return (
        <div>
            <QRCode value={itemNumber} size={size} fgColor="#000000" bgColor="#ffffff" />
        </div>
    );
};