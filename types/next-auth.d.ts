import { DefaultSession } from "next-auth"

declare module 'next-auth' {
    interface User {
        id: string;
        username: string;
        accessToken: string;
        refreshToken: string;
        profileImage?: string | null;
        statusMessage?: string | null;
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
    }
}