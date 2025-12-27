import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDatabase } from '@/lib/mongodb';
import { UserPlan } from '@/app/models/user_plan';
// import { User } from '@/app/models/user'; 

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.name) { // Assuming name stores username based on create-user script mapping or we use email/username logic
            // Actually create-user stores 'name' as "Admin User". 'username' is what we want. 
            // By default next-auth credentials provider puts the returned object into the JWT/Session user usually filtering fields.
            // We need to check what 'auth.ts' returns.
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Wait, default session.user might not have 'username'. 
        // In my auth.ts, authorize returns 'user' object. 
        // By default, only name, email, image are passed to session.
        // I might need to rely on email if it was unique, or fetching user by email.
        // User map: username -> email (username@example.com).
        // So I can look up by email or name?
        // Let's rely on session.user.email which is unique per my seed script.

        const db = await getDatabase();

        // Find user by email to get username if needed, or just use email as owner?
        // Let's use username.
        const user = await db.collection('users').findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const plans = await db.collection<UserPlan>('plans')
            .find({ username: user.username })
            .sort({ createdAt: -1 })
            .toArray();

        // Map legacy plans to new structure if needed
        // Map legacy plans to new structure if needed
        const mappedPlans = plans.map(plan => {
            const p = plan as any;
            if (!p.items && p.placeIds) {
                return {
                    ...plan,
                    items: p.placeIds.map((id: string) => ({ placeId: id, duration: 60 })) // Default 60 mins
                };
            }
            return plan;
        });

        return NextResponse.json(mappedPlans);

    } catch (error) {
        console.error('Error fetching plans:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const db = await getDatabase();
        // Resolve username
        const user = await db.collection('users').findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await request.json();
        const { nombre, description, items } = body;

        if (!nombre) {
            return NextResponse.json({ error: 'Nombre is required' }, { status: 400 });
        }

        const newPlan: UserPlan = {
            id: crypto.randomUUID(),
            username: user.username,
            nombre,
            description: description || '',
            items: items || [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await db.collection<UserPlan>('plans').insertOne(newPlan);

        return NextResponse.json(newPlan, { status: 201 });

    } catch (error) {
        console.error('Error creating plan:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
