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
    `default-src 'self'`,// 명시되지 않은 리소스는 동일 출처만 허용
    `script-src 'self' 'unsafe-inline' 'unsafe-eval'`, // JS 실행 허용 (Next.js 인라인 스크립트 필요)
    `style-src 'self' 'unsafe-inline'`, // CSS 허용 (Tailwind 인라인 스타일 필요)
    `img-src 'self' data: blob: ${S3}${isDev ? ` ${LOCAL_MINIO}` : ''}`, // 이미지: S3(프로필/첨부), dev에선 MinIO
    `font-src 'self' data:`, // 폰트: 동일 출처 + base64
    `connect-src 'self' ${API} ${WS} ${S3}${isDev ? ` ${LOCAL_API} ${LOCAL_WS} ${LOCAL_MINIO}` : ''}`, // fetch/WebSocket: API, S3, dev에선 localhost
    `frame-ancestors 'none'`, // iframe 삽입 차단 (클릭재킹 방지)
    `base-uri 'self'`, // <base> 태그 출처 제한
    `form-action 'self'`, // 폼 제출 대상 제한
].join('; ');

const securityHeaders = [
    { key: 'Content-Security-Policy', value: csp },
    { key: 'X-Content-Type-Options', value: 'nosniff' }, // MIME 타입 스니핑 차단
    { key: 'X-Frame-Options', value: 'DENY' }, // iframe 삽입 차단 (구형 브라우저 대응)
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }, // 외부 링크 시 Referer 헤더 최소화
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }, // 카메라/마이크/위치 API 비활성화
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains', // 1년간 HTTPS 강제 (서브도메인 포함)
    },
];

const nextConfig: NextConfig = {
    async headers() {
        return [{ source: '/:path*', headers: securityHeaders }];
    },
};

export default nextConfig;
