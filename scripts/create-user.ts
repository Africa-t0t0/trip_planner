import { User } from '../app/models/user';
import bcrypt from 'bcryptjs';
import path from 'path';
import dotenv from 'dotenv';

// Explicitly load .env from root
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

async function createUser(username: string, password: string, name: string) {
    try {
        // Dynamically import database to ensure env vars are loaded
        const { getDatabase } = await import('../lib/mongodb');

        if (!username || !password || !name) {
            console.error('Please provide username, password and name as arguments.');
            console.log('Usage: npx tsx scripts/create-user.ts <username> <password> <name>');
            process.exit(1);
        }

        const db = await getDatabase();
        const usersCollection = db.collection<User>('users');

        // Check if user exists
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            console.error(`User '${username}' already exists.`);
            process.exit(1);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser: User = {
            id: crypto.randomUUID(),
            username,
            name,
            email: `${username}@example.com`,
            password: hashedPassword,
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await usersCollection.insertOne(newUser as any);
        console.log(`User '${username}' created successfully.`);
        process.exit(0);

    } catch (error) {
        console.error('Error creating user:', error);
        process.exit(1);
    }
}

// Get args
const args = process.argv.slice(2);
createUser(args[0], args[1], args[2]);
