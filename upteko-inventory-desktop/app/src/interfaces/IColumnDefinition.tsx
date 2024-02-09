export interface ColumnDefinition {
    header: string;
    accessor: string;
}

export interface TableProps {
    data: any[]; // Array of data, could be Item or SubassemblyItems
    columns: ColumnDefinition[];
}
