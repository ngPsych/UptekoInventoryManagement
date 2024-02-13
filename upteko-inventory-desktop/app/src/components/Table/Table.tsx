import React, { useState } from 'react';
import { TableProps } from '../../interfaces/IColumnDefinition';
import { formatFirestoreTimestamp } from '../../utils/timeFormat';
import styles from './Table.module.css';
import { MaterialPopupCard } from '../../components/PopupCard/PopupCard';

export const Table: React.FC<TableProps> = ({ data, columns }) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleRowClick = (item: any) => {
    setSelectedItem(item);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.itemTable}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex} onClick={() => handleRowClick(item)}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {column.accessor === 'lastModified' && item.lastModified ? formatFirestoreTimestamp(item.lastModified) : item[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {selectedItem && <MaterialPopupCard item={selectedItem} onClose={handleClosePopup} />}
    </div>
  );
};
