import React from 'react';

interface TableProps {
  data: any[]; // Define the type of your data array
}

// export const Table: React.FC<TableProps> = ({ data }) => {
//   // Function to generate table headers
//     const generateHeaders = () => {
//         if (data.length === 0) return null;

//         const firstItem = data[0];
//         return Object.keys(firstItem).map(key => <th key={key}>{key}</th>);
//     };

//     // Function to generate table rows
//     const generateRows = () => {
//         return data.map((item, index) => (
//         <tr key={index}>
//             {Object.values(item).map((value, index) => (
//             <td key={index}>{value}</td>
//             ))}
//         </tr>
//         ));
//     };

//     return (
//         <table className="table">
//         <thead>
//             <tr>{generateHeaders()}</tr>
//         </thead>
//         <tbody>{generateRows()}</tbody>
//         </table>
//     );
// };

export {}
