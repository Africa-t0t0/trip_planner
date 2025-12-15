import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnLogin = nextUrl.pathname.startsWith('/login');

            // Allow access to static assets and API routes needed for login
            if (nextUrl.pathname.startsWith('/_next') ||
                nextUrl.pathname.startsWith('/domi-cat.svg') ||
                nextUrl.pathname.startsWith('/api/auth')) {
                return true;
            }

            if (isOnLogin) {
                if (isLoggedIn) return Response.redirect(new URL('/', nextUrl));
                return true;
            }

            if (!isLoggedIn) {
                return false; // Redirect unauthenticated users to login page
            }

            return true;
        },
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
