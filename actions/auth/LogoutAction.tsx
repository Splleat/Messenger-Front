'use server'

import { auth, signOut } from '@/auth';
import { LogoutRequest } from '@/types/auth';
import { ApiErrorResponse } from '@/types/common';
import { authenticatedFetch } from '@/lib/api-client';

export async function LogoutAction() {
    const session = await auth();

    if (!session?.accessToken) {
        return {
            success: false,
            error: { message: '인증 정보가 없습니다.', status: 401 },
        };
    }

    const request: LogoutRequest = {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken as string
    };

    const response = await authenticatedFetch("http://localhost:8080/auth/logout", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });

    if (response.ok || response.status == 204) {
        await signOut({redirectTo: '/auth/login'});
        return { success: true };
    }

    const errorResponse: ApiErrorResponse = await response.json();

    return { success: false, error: errorResponse };
}