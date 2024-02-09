import React from 'react';
import { TableProps } from "../../interfaces/IColumnDefinition";
import { formatFirestoreTimestamp } from '../../utils/timeFormat';
import styles from "./Table.module.css"

export const Table: React.FC<TableProps> = ({ data, columns }) => {
  return (
    <div className={styles['table-container']}>
      <table className="item-table">
          <thead>
              <tr>
                  {columns.map((column, index) => (
                      <th key={index}>{column.header}</th>
                  ))}
              </tr>
          </thead>
          <tbody>
              {data.map((item, rowIndex) => (
                  <tr key={rowIndex}>
                      {columns.map((column, colIndex) => (
                        <td key={colIndex}>
                          {column.accessor === 'lastModified' ? formatFirestoreTimestamp(item.lastModified) : item[column.accessor]}
                        </td>
                      ))}
                  </tr>
              ))}
          </tbody>
      </table>
    </div>
  );
};
