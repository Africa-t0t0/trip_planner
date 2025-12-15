import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/mongodb';
import { UserItinerary } from '@/app/models/user_itinerary';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const db = await getDatabase();
        const user = await db.collection('users').findOne({ email: session.user.email });

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const itinerary = await db.collection<UserItinerary>('itineraries').findOne({ username: user.username });

        return NextResponse.json(itinerary || { days: {} });

    } catch (error) {
        console.error('Error fetching itinerary:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const db = await getDatabase();
        const user = await db.collection('users').findOne({ email: session.user.email });

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const body = await request.json();
        const { days } = body;

        if (!days) {
            return NextResponse.json({ error: 'Days data is required' }, { status: 400 });
        }

        // Upsert
        await db.collection<UserItinerary>('itineraries').updateOne(
            { username: user.username },
            {
                $set: {
                    days,
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error saving itinerary:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
