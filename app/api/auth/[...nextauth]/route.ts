import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { LoginResponse, loginSchema } from '@/types/auth';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const parsed = loginSchema.safeParse(credentials);

                if (!parsed.success) {
                    throw new Error(parsed.error.message);
                }

                const response = await fetch(
                    'http://localhost:8080/auth/login',
                    {
                        method: 'POST',
                        body: JSON.stringify(credentials),
                        headers: { 'Content-Type': 'application/json' },
                    },
                );

                const data = await response.json();

                if (response.ok && data) {
                    return data;
                }

                throw new Error(data.message || "이메일 또는 비밀번호가 올바르지 않습니다.");
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 60 * 60,
    },
    pages: {
        signIn: '/auth/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const loginData = user as unknown as LoginResponse;

                token.accessToken = loginData.accessToken;
                token.refreshToken = loginData.refreshToken;

                token.id = loginData.id;
                token.username = loginData.username;
                token.profileImage = loginData.profileImage;
                token.statusMessage = loginData.statusMessage;
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    ...session.user,
                    id: token.id as string,
                    username: token.username as string,
                    profileImage: token.profileImage as string,
                    statusMessage: token.statusMessage as string,
                };
            }
            return session;
        },
    },
    events: {
        async signOut({ token }) {
            await fetch(`http://localhost:8080/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token.accessToken}`,
                },
                body: JSON.stringify({
                    accessToken: token.accessToken,
                    refreshToken: token.refreshToken,
                }),
            });
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };