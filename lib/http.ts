import { signOut } from '@/auth';
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
    const headers = new Headers(options.headers);

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
        await signOut({ redirectTo: '/auth/login' });
        throw new AuthenticationError('인증이 만료되었습니다.');
    }

    return response;
}
