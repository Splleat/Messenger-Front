'use server';

import { auth, signOut } from '@/auth';
import { LogoutRequest } from '@/types/auth';
import {
    ActionResponse,
    ApiErrorResponse,
    createAuthError,
} from '@/types/common';
import { authenticatedFetch } from '@/lib/api-auth';

export async function LogoutAction(): Promise<ActionResponse> {
    const session = await auth();

    if (!session?.accessToken) {
        return createAuthError('인증 정보가 존재하지 않습니다.');
    }

    const request: LogoutRequest = {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken as string,
    };

    const response = await authenticatedFetch(session, 'http://localhost:8080/auth/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        },
    );

    if (response.ok || response.status == 204) {
        await signOut({ redirectTo: '/auth/login' });
        return { success: true };
    }

    const errorResponse: ApiErrorResponse = await response.json();

    return { success: false, error: errorResponse };
}