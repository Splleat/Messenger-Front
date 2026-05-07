import NextAuth from 'next-auth';
import { loginSchema } from '@/types/auth';
import Credentials from 'next-auth/providers/credentials';
import { fetchLogin, tokenReissue } from '@/lib/api-auth';

export const { auth, handlers, signIn, signOut } = NextAuth({
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60,
    },
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

                const result = await fetchLogin({ email, password });

                if (!result.success) {
                    return null;
                }

                return {
                    id: result.data.id,
                    username: result.data.username,
                    accessToken: result.data.accessToken,
                    refreshToken: result.data.refreshToken,
                    profileImage: result.data.profileImage,
                    statusMessage: result.data.statusMessage,
                    accessTokenExpiresIn: result.data.accessTokenExpiresIn,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            const accessTokenExpires =
                typeof token.accessTokenExpires === 'number'
                    ? token.accessTokenExpires
                    : 0;

            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.accessTokenExpires = user.accessTokenExpiresIn;

                return token;
            }

            if (
                accessTokenExpires &&
                Date.now() < accessTokenExpires
            ) {
                return token;
            }

            const refresh = await tokenReissue(token);

            if (!refresh.success) {
                return {
                    ...token,
                    error: 'RefreshTokenError',
                };
            }

            return {
                ...token,
                accessToken: refresh.data.accessToken,
                refreshToken: refresh.data.refreshToken,
                accessTokenExpires: refresh.data.accessTokenExpiresIn,
                error: undefined,
            };
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
                session.accessToken = token.accessToken as string;
                session.refreshToken = token.refreshToken as string;
                session.error = token.error as 'RefreshTokenError' | undefined;
            }

            return session;
        },
    },
});
