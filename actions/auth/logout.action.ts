'use server';
import { API_BASE_URL } from '@/lib/config';

import { auth, signOut } from '@/auth';
import { LogoutRequest } from '@/types/auth';
import { ApiErrorResponse, FormState } from '@/types/common';
import { authenticatedFetch } from '@/lib/http';
import { getToken } from '@auth/core/jwt';
import { headers } from 'next/dist/server/request/headers';
import { cookies } from 'next/dist/server/request/cookies';

export async function logoutAction(): Promise<FormState> {
    const session = await auth();

    const reqHeaders = await headers();
    const reqCookies = await cookies();

    const req = {
        headers: reqHeaders,
        cookies: reqCookies,
    };

    const jwt = await getToken({
        req: req,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: process.env.NEXTAUTH_URL?.startsWith('https'),
    });

    if (!jwt?.accessToken || !jwt?.refreshToken) {
        return { error: '인증 정보가 존재하지 않습니다.' };
    }

    const request: LogoutRequest = {
        accessToken: jwt.accessToken as string,
        refreshToken: jwt.refreshToken as string,
    };

    const response = await authenticatedFetch(
        session,
        `${API_BASE_URL}/auth/logout`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        },
    );

    if (response.ok || response.status == 204) {
        await signOut({ redirectTo: '/auth/login' });
        return { error: null };
    }

    const errorResponse: ApiErrorResponse = await response.json();

    return { error: errorResponse.message };
}
