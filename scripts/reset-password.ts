import { User } from '../app/models/user';
import bcrypt from 'bcryptjs';
import path from 'path';
import dotenv from 'dotenv';
import { getDatabase } from '../lib/mongodb';


// Explicitly load .env from root
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

async function resetPassword(username: string, password: string) {
    try {
        if (!username || !password) {
            console.error('Please provide username and new password arguments.');
            console.log('Usage: npx tsx scripts/reset-password.ts <username> <new_password>');
            process.exit(1);
        }

        // Dynamically import database to ensure env vars are loaded
        const { getDatabase } = await import('../lib/mongodb');

        const db = await getDatabase();
        const usersCollection = db.collection<User>('users');

        // Check if user exists
        const existingUser = await usersCollection.findOne({ username });
        if (!existingUser) {
            console.error(`User '${username}' does not exist.`);
            process.exit(1);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user
        await usersCollection.updateOne(
            { username },
            { $set: { password: hashedPassword } }
        );

        console.log(`Password for user '${username}' updated successfully.`);
        process.exit(0);

    } catch (error) {
        console.error('Error updating password:', error);
        process.exit(1);
    }
}

// Get args
const args = process.argv.slice(2);
resetPassword(args[0], args[1]);
