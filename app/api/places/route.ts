import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Place } from '@/app/models/places';

export async function GET() {
    try {
        const db = await getDatabase();
        const placesCollection = db.collection<Place>('places');

        // Fetch all places from MongoDB, sorted by id
        const places = await placesCollection
            .find({})
            .sort({ id: 1 })
            .toArray();

        // Convert MongoDB documents to Place interface (remove _id)
        const formattedPlaces = places.map(({ _id, ...place }) => place);

        return NextResponse.json(formattedPlaces);
    } catch (error) {
        console.error('Error fetching places:', error);
        return NextResponse.json(
            { error: 'Failed to fetch places' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const db = await getDatabase();
        const placesCollection = db.collection<Place>('places');

        // Check if body is an array (bulk insert) or single place
        if (Array.isArray(body)) {
            const result = await placesCollection.insertMany(body);
            return NextResponse.json({
                success: true,
                insertedCount: result.insertedCount
            });
        } else {
            const result = await placesCollection.insertOne(body);
            return NextResponse.json({
                success: true,
                insertedId: result.insertedId
            });
        }
    } catch (error) {
        console.error('Error inserting places:', error);
        return NextResponse.json(
            { error: 'Failed to insert places' },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    try {
        const db = await getDatabase();
        const placesCollection = db.collection<Place>('places');

        // Delete all places from the collection
        const result = await placesCollection.deleteMany({});

        return NextResponse.json({
            success: true,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error deleting places:', error);
        return NextResponse.json(
            { error: 'Failed to delete places' },
            { status: 500 }
        );
    }
}
