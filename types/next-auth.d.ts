import { DefaultSession } from "next-auth"

declare module 'next-auth' {
    interface User {
        id: string;
        username: string;
        accessToken: string;
        refreshToken: string;
        profileImage?: string | null;
        statusMessage?: string | null;
        accessTokenExpiresIn: number;
    }

    interface Session {
        accessToken?: string;
        refreshToken?: string;
        user: {
            id: string;
            username: string;
            profileImage: string;
            statusMessage: string;
        } & DefaultSession["user"];
        error?: 'RefreshTokenError';
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpires?: number;
        error?: 'RefreshTokenError';
    }
}
