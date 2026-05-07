import { auth } from '@/auth';
import { NextResponse } from 'next/dist/server/web/spec-extension/response';

export default auth((request) => {
    const { nextUrl } = request;
    const isLoggedIn = !!request.auth;

    const isPublicRoute =
        nextUrl.pathname.startsWith('/auth/login') ||
        nextUrl.pathname.startsWith('/auth/register');

    if (isLoggedIn && isPublicRoute) {
        return NextResponse.redirect(new URL('/main', nextUrl));
    }

    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL('/auth/login', nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};