import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const client = await connectToDatabase();

        // Test connection by pinging the database
        await client.db('admin').command({ ping: 1 });

        return NextResponse.json({
            success: true,
            message: 'MongoDB Atlas connected successfully',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to connect to MongoDB',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
