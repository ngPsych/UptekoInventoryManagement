import React, { useState, useEffect } from 'react';
import { subscribeToInventoryParts, subscribeToAllSubAssemblies } from "../../services/firebase/inventoryManagement";
import { NavigationBar } from '../../components/NavBar/NavBar';
import { Table } from "../../components/Table/Table";
import { AddNewPartPopupCard } from '../../components/PopupCard/PopupCard';
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { ColumnDefinition } from "../../interfaces/IColumnDefinition";
import { Item } from "../../interfaces/IItem";
import styles from "./Inventory.module.css"
import { SubAssemblyItem } from '../../interfaces/IAssembly';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function InventoryPage() {
    useRequireAuth();

    const [items, setItems] = useState<(Item | SubAssemblyItem)[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const [filteredItems, setFilteredItems] = useState<(Item | SubAssemblyItem)[]>([]);
    const [tableMode, setTableMode] = useState('Parts');
    const [showAddPartPopup, setShowAddPartPopup] = useState(false);
    const [columns, setColumns] = useState<ColumnDefinition[]>([]);
    
    useEffect(() => {
        let unsubscribe = () => {}; // initialize with a no-op function

        if (tableMode === "Parts") {
            unsubscribe = subscribeToInventoryParts((partItems) => {
                setItems(partItems);
                setColumns(itemColumns);
            });
        } else if (tableMode === "Sub-Assemblies") {
            unsubscribe = subscribeToAllSubAssemblies((subAssemblyItems) => {
                setItems(subAssemblyItems);
                setColumns(subAssemblyColumns);
            });
        }

        // Cleanup function to unsubscribe when the component unmounts or tableMode changes
        return () => {
            unsubscribe();
        };
    }, [tableMode]);

    useEffect(() => {
        // Filter items based on search input
        const filtered = items.filter(item =>
            item.sku.toLowerCase().includes(searchInput.toLowerCase()) ||
            item.name.toLowerCase().includes(searchInput.toLowerCase())
        );
        setFilteredItems(filtered);
    }, [searchInput, items]);

    const itemColumns: ColumnDefinition[] = [
        { header: 'SKU', accessor: 'sku' },
        { header: 'Name', accessor: 'name' },
        { header: 'Quantity', accessor: 'quantity' },
        { header: 'Location', accessor: 'location' },
        { header: 'Description', accessor: 'description' },
        { header: 'Last Modified', accessor: 'lastModified' },
        { header: 'Supplier', accessor: 'supplier' },
        { header: 'Supplier Item Number', accessor: 'supplierItemNumber' },
        { header: 'Reorder Point', accessor: 'minPoint' }
    ];

    const subAssemblyColumns: ColumnDefinition[] = [
        { header: 'Assembly', accessor: 'assembly'},
        { header: 'Sub-Assembly', accessor: 'name' },
        { header: 'Quantity', accessor: 'quantity' },
        { header: 'Min. Point', accessor: 'minPoint' },
        { header: 'Location', accessor: 'location' },
        { header: 'Last Modified', accessor: 'lastModified' },
        { header: 'Date Created', accessor: 'dateCreated' },
    ]

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    return (
        <div>
            <NavigationBar />
            <ToastContainer />

            <div className={styles.tableMode}>
                <button
                    onClick={() => {setTableMode('Parts');}}
                    className={tableMode === 'Parts' ? styles.activeButton : styles.inactiveButton}
                >
                    Parts
                </button>
                <button
                    onClick={() => {setTableMode('Sub-Assemblies');}}
                    className={tableMode === 'Sub-Assemblies' ? styles.activeButton : styles.inactiveButton}
                >
                    Sub-Assemblies
                </button>
            </div>

            {/* <div>
                <div>
                    <button onClick={() => setShowAddPartPopup(true)}>Add new part</button>
                </div>

                <input
                    type="text"
                    placeholder="Search by SKU or Name"
                    value={searchInput}
                    onChange={handleSearchInputChange}
                />
            </div> */}

            <div className={styles.addButtonSearchContainer}>
                <button
                    onClick={() => setShowAddPartPopup(true)}
                    className={styles.addButton}
                >
                    Add New Part
                </button>

                <input
                    type="text"
                    placeholder="Search by SKU or Name"
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    className={styles.searchInput}
                />
            </div>

            <Table data={filteredItems} columns={columns} />

            {showAddPartPopup && (
                <AddNewPartPopupCard
                    onClose={() => setShowAddPartPopup(false)}
                />
            )}
        </div>
    );
}