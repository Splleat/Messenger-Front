import { NextRequest } from 'next/dist/server/web/spec-extension/request';
import { jwtVerify } from 'jose';
import { NextResponse } from 'next/dist/server/web/spec-extension/response';

const publicRoutes = ['/login', '/api/auth/login', '/api/auth/register'];

export async function middleware(request: NextRequest) {
    // const { pathname } = request.nextUrl;
    //
    // const accessToken = request.cookies.get('accessToken')?.value;
    // const refreshToken = request.cookies.get('refreshToken')?.value;
    //
    // if (publicRoutes.some((route) => pathname.startsWith(route))) {
    //     if (accessToken) {
    //         return NextResponse.redirect(new URL('/', request.url));
    //     }
    //
    //     return NextResponse.next();
    // }
    //
    //
    //
    // if (!accessToken) {
    //     // TODO: 리프레시 토큰으로 액세스 토큰 갱신 로직 추가
    //     return NextResponse.redirect(new URL('/api/auth/login', request.url));
    // }
    //
    // try {
    //     const publicKey = new TextEncoder().encode(process.env.JWT_PUBLIC_KEY);
    //     const { payload } = await jwtVerify(accessToken, publicKey);
    //
    //     const requestHeaders = new Headers(request.headers);
    //     requestHeaders.set('X-USER-ID', payload.sub as string);
    //     requestHeaders.set('X-USER-ROLE', payload.role as string);
    //
    //     return NextResponse.next({
    //         request: {
    //             headers: requestHeaders,
    //         },
    //     });
    // } catch {
    //     const response = NextResponse.redirect(
    //         new URL('/api/auth/login', request.url),
    //     );
    //
    //     response.cookies.delete('accessToken');
    //     response.cookies.delete('refreshToken');
    //
    //     return response;
    // }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};