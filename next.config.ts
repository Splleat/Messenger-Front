import type { NextConfig } from 'next';

// 백엔드/스토리지 출처 설정
const API = 'https://api.splleat.com';
const WS = 'wss://api.splleat.com';
const S3 = 'https://splleat-messenger-attachments.s3.ap-northeast-2.amazonaws.com';

const isDev = process.env.NODE_ENV === 'development';
const LOCAL_API = 'http://localhost:8080';
const LOCAL_WS = 'ws://localhost:8080';
const LOCAL_MINIO = 'http://localhost:9000';

const csp = [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: ${S3}${isDev ? ` ${LOCAL_MINIO}` : ''}`,
    `font-src 'self' data:`,
    `connect-src 'self' ${API} ${WS} ${S3}${isDev ? ` ${LOCAL_API} ${LOCAL_WS} ${LOCAL_MINIO}` : ''}`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
].join('; ');

const securityHeaders = [
    { key: 'Content-Security-Policy', value: csp },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains',
    },
];

const nextConfig: NextConfig = {
    async headers() {
        return [{ source: '/:path*', headers: securityHeaders }];
    },
};

export default nextConfig;
