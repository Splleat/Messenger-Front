import {
    LoginRequest,
    LoginResponse,
    loginSchema,
    TokenReissueResponse,
} from '@/types/auth';
import {
    ActionResponse,
    ApiErrorResponse,
    createAuthError,
    createValidationError,
} from '@/types/common';
import { JWT } from '@auth/core/jwt';
import { Session } from 'next-auth';

export class AuthenticationError extends Error {
    constructor(message = '인증이 만료되었습니다. 다시 로그인해주세요.') {
        super(message);
        this.name = 'AuthenticationError';
    }
}

export async function authenticatedFetch(
    session: Session | null,
    url: string,
    options: RequestInit = {},
) {
    console.log('[Request URL]: ', url);

    const headers = new Headers(options.headers);

    // if (session?.error) {
    //     throw new AuthenticationError();
    // }

    if (!session?.accessToken) {
        throw new AuthenticationError('인증 정보가 존재하지 않습니다.');
    }

    if (!headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${session.accessToken}`);
    }

    if (!headers.has('Content-Type') && options.body) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        throw new AuthenticationError('인증이 만료되었습니다.');
    }

    return response;
}

export async function fetchLogin(
    credentials: LoginRequest,
): Promise<ActionResponse<LoginResponse>> {
    const parsed = loginSchema.safeParse(credentials);

    if (!parsed.success) {
        return createValidationError('입력값이 올바르지 않습니다.');
    }

    const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
        return { success: true, data: data as LoginResponse };
    }

    return { success: false, error: data as ApiErrorResponse };
}

export async function tokenReissue(
    token: JWT,
): Promise<ActionResponse<TokenReissueResponse>> {
    const { accessToken, refreshToken } = token;

    if (!accessToken || !refreshToken) {
        return createAuthError('인증 정보가 존재하지 않습니다.');
    }

    const response = await fetch('http://localhost:8080/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            accessToken: accessToken,
            refreshToken: refreshToken,
        }),
    });

    console.log('[Token Reissue] Called');

    if (response.ok) {
        const data: TokenReissueResponse = await response.json();

        console.log('[Token Reissue]: ', data.accessTokenExpiresIn);

        return { success: true, data: data };
    }

    const error: ApiErrorResponse = await response.json();

    return { success: false, error: error };
}
