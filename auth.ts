import NextAuth from 'next-auth';
import { loginSchema } from '@/types/auth';
import Credentials from 'next-auth/providers/credentials';
import { LoginAction } from './actions/auth/LoginAction';

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                },
            },
            async authorize(credentials) {
                const parsed = loginSchema.safeParse(credentials);

                if (!parsed.success) return null;

                const { email, password } = parsed.data;

                return await LoginAction({ email, password });
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.name = token.name;
                session.accessToken = token.accessToken as string;
                session.refreshToken = token.refreshToken as string;
            }

            return session;
        }
    }
});