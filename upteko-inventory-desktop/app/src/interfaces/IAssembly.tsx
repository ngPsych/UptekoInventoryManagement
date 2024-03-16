import { FirestoreTimestamp } from "../utils/timeFormat";

export interface AssemblyItem {
    imageURL: string;
    id: string;
}

export interface SubAssemblyItem {
    sku: string;
    assembly: string;
    name: string;
    quantity: number;
    minPoint: number;
    location: string;
    imageURL: string;
    lastModified: FirestoreTimestamp;
    dateCreated: FirestoreTimestamp;
}

export interface Material {
    id: string;
    name: string;
    quantity: number;
}