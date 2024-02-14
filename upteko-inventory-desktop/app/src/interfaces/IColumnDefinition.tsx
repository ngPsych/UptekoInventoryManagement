export interface ColumnDefinition {
    header: string;
    accessor: string;
}

export interface TableProps {
    data: any[]; // Array of data, Item or SubassemblyItems
    columns: ColumnDefinition[];
}
