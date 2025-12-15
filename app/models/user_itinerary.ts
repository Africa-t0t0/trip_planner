import { ObjectId } from 'mongodb';

export interface UserItinerary {
    _id?: ObjectId;
    username: string; // Owner
    // Map day number (string key) to content
    days: Record<string, {
        planIds: string[];  // IDs of plans assigned to this day
        placeIds: string[]; // IDs of individual places assigned to this day
    }>;
    updatedAt: Date;
}
