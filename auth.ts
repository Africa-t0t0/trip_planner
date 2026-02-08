import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { getDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { User } from '@/app/models/user';

async function getUser(username: string): Promise<User | null> {
    try {
        const db = await getDatabase();
        const user = await db.collection<User>('users').findOne({ username });
        return user || null;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: 'jwt' },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = (user as any).username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                // session.user.username = token.username as string;
            }
            return session;
        },
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null;

                const { username, password } = credentials as { username: string; password: string };
                const user = await getUser(username);

                if (!user) return null;

                const passwordsMatch = await bcrypt.compare(password, user.password);
                if (passwordsMatch) return user;

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});
