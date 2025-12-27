import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/mongodb';
import { UserPlan } from '@/app/models/user_plan';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const db = await getDatabase();
        const user = await db.collection('users').findOne({ email: session.user.email });

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const body = await request.json();
        const { nombre, description, items } = body; // Can update any of these

        const updateData: Partial<UserPlan> = { updatedAt: new Date() };
        if (nombre !== undefined) updateData.nombre = nombre;
        if (description !== undefined) updateData.description = description;
        if (items !== undefined) updateData.items = items;

        const result = await db.collection<UserPlan>('plans').updateOne(
            { id: id, username: user.username }, // Ensure ownership
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Plan not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error updating plan:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const db = await getDatabase();
        const user = await db.collection('users').findOne({ email: session.user.email });

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const result = await db.collection<UserPlan>('plans').deleteOne(
            { id: id, username: user.username }
        );

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Plan not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error deleting plan:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
