import { FirestoreTimestamp } from "../utils/timeFormat";

export interface Item {
    sku: string;
    name: string;
    quantity: number;
    location: string;
    description: string;
    lastModified: FirestoreTimestamp;
    supplier: string;
    supplierItemNumber: string;
    minPoint: number;
}