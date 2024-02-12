import { FirestoreTimestamp } from "../utils/timeFormat";

export interface SubassemblyItem {
    sku: string;
    name: string;
    quantity: number;
    location: string;
    description: string;
    lastModified: FirestoreTimestamp;
    minPoint: number;
}