import { auth } from '@/auth';

export async function authenticatedFetch(url: string, options: RequestInit = {}) {
    const session = await auth();
    const headers = new Headers(options.headers);

    if (session?.accessToken) {
        headers.set('Authorization', `Bearer ${session.accessToken}`);
    }

    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    return fetch(url, {
        ...options,
        headers,
    });
}