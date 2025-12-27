import { ObjectId } from 'mongodb';

export interface UserPlan {
    _id?: ObjectId;
    id: string; // Unique String ID (UUID)
    username: string; // Owner username
    nombre: string;
    description?: string;
    items: { placeId: string; duration: number }[]; // Replaces placeIds
    placeIds?: string[]; // Deprecated
    createdAt: Date;
    updatedAt: Date;
}
