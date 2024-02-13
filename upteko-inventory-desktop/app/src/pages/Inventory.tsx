import React, { useState, useEffect } from 'react';
import { getAllParts, getAllSubassemblyItems } from "../services/firebase/inventoryManagement";
import { NavigationBar } from '../components/NavBar/NavBar';
import { Table } from "../components/Table/Table";
import { AddNewPartPopupCard } from '../components/PopupCard/PopupCard';
import { useRequireAuth } from "../hooks/useRequireAuth";
import { ColumnDefinition } from "../interfaces/IColumnDefinition";
import { Item } from "../interfaces/IItem";
import { SubassemblyItem } from "../interfaces/ISubassemblyItem";
import styles from "./Inventory.module.css"

export default function InventoryPage() {
    useRequireAuth();

    const [items, setItems] = useState<Item[] | SubassemblyItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [searchInput, setSearchInput] = useState('');
    const [filteredItems, setFilteredItems] = useState<Item[] | SubassemblyItem[]>([]);
    var [tableMode, setTableMode] = useState('Parts');
    const [showAddPartPopup, setShowAddPartPopup] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                var fetchedItems = null;
                if (tableMode === "Parts") {
                    fetchedItems = await getAllParts();
                    setItems(fetchedItems);
                } else if (tableMode === "Sub-Assemblies") {
                    fetchedItems = await getAllSubassemblyItems();
                    setItems(fetchedItems);
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };        
    
        fetchItems();
    
        // Add interval for auto-updating data every second
        const intervalId = setInterval(() => {
            fetchItems();
        }, 1000);
    
        // Cleanup function to clear interval when component unmounts
        return () => clearInterval(intervalId);
    }, [tableMode]); // Include tableMode in the dependency array
    

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

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    return (
        <div>
            <NavigationBar />

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

            <div>
                <div>
                    <button onClick={() => setShowAddPartPopup(true)}>Add new part</button>
                </div>

                <input
                    type="text"
                    placeholder="Search by SKU or Name"
                    value={searchInput}
                    onChange={handleSearchInputChange}
                />
            </div>

            <Table data={filteredItems} columns={itemColumns} />

            {showAddPartPopup && (
                <AddNewPartPopupCard
                    onClose={() => setShowAddPartPopup(false)}
                />
            )}
        </div>
    );
}