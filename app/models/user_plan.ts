import { ObjectId } from 'mongodb';

export interface UserPlan {
    _id?: ObjectId;
    id: string; // Unique String ID (UUID)
    username: string; // Owner username
    nombre: string;
    description?: string;
    placeIds: string[]; // Array of Place IDs
    createdAt: Date;
    updatedAt: Date;
}
