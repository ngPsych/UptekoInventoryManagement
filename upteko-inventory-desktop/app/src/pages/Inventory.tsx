import React, { useState, useEffect } from 'react';
import { NavigationBar } from '../components/NavBar/NavBar';
import { useRequireAuth } from "../hooks/useRequireAuth";
import { getAllItems } from "../services/firebase/inventoryManagement";
import { Table } from "../components/Table/Table";
import { ColumnDefinition } from "../interfaces/IColumnDefinition";
import { Item } from "../interfaces/IItem";

export default function InventoryPage() {
    useRequireAuth();

    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const fetchedMaterials = await getAllItems();
                setItems(fetchedMaterials);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMaterials();
    }, []);

    const materialColumns: ColumnDefinition[] = [
        { header: 'SKU', accessor: 'sku' },
        { header: 'Name', accessor: 'name' },
        { header: 'Quantity', accessor: 'quantity' },
        { header: 'Location', accessor: 'location' },
        { header: 'Description', accessor: 'description' },
        { header: 'Last Modified', accessor: 'lastModified' },
        { header: 'Supplier', accessor: 'supplier' },
        { header: 'Supplier Item Number', accessor: 'supplierItemNumber' },
        { header: 'Min. Reorder Point', accessor: 'minPoint' }
    ]

    return (
        <div>
            <NavigationBar />

            <Table data={items} columns={materialColumns} />
        </div>
    );
}