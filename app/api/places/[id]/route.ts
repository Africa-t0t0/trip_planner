import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Place } from '@/app/models/places';

export async function DELETE(
    request: Request,
    context: any
) {
    try {
        // Handle params for both older and newer Next.js versions
        const resolvedParams = await Promise.resolve(context.params);
        const id = resolvedParams?.id;

        if (!id) {
            return NextResponse.json(
                { error: 'Place ID is required' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const placesCollection = db.collection<Place>('places');

        const result = await placesCollection.deleteOne({ id: id });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: 'Place not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error deleting place:', error);
        return NextResponse.json(
            { error: 'Failed to delete place' },
            { status: 500 }
        );
    }
}
