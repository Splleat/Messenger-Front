# Messenger Front

실시간 메신저 서비스의 프론트엔드. [Messenger-Project](https://github.com/Splleat/Messenger-Project)와 연동되며, STOMP 기반 실시간 메시지 송수신과 커서 기반 무한 스크롤을 제공한다.

---

## 기술 스택

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![NextAuth](https://img.shields.io/badge/NextAuth.js-5-000000?style=flat-square&logo=auth0&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-5-FF4154?style=flat-square&logo=reactquery&logoColor=white)
![STOMP](https://img.shields.io/badge/STOMP_/_SockJS-010101?style=flat-square&logo=socket.io&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

---

## 주요 기능

- **인증** — NextAuth(Credentials) 기반 로그인/로그아웃, JWT 액세스/리프레시 토큰 관리
- **실시간 메시지** — STOMP 구독으로 메시지 수신, id(TSID) 기준 정렬 및 중복 제거
- **재연결 복구** — 소켓 재연결 시 누락 메시지 자동 동기화
- **무한 스크롤** — `react-virtuoso` + 커서 기반 양방향 페이징 (이전/다음/읽던 위치)

---

## 페이지 라우트

| 경로 | 설명 |
| --- | --- |
| `/` | 진입점 (세션 상태에 따라 `/main` 또는 `/auth/login`으로 리다이렉트) |
| `/auth/login` | 로그인 |
| `/auth/register` | 회원가입 |
| `/main` | 메신저 메인 (쿼리: `?spaceId=`, `?channelId=`) |

---

## 실행 방법

### 사전 요구사항

- Node.js 20 이상
- [메신저 백엔드](https://github.com/Splleat/Messenger-Project)가 `localhost:8080`에서 실행 중

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 복사해 `.env`를 만들고 값을 채운다.

```bash
cp .env.example .env
```

| 변수 | 설명 | 예시 |
| --- | --- | --- |
| `NEXTAUTH_URL` | 애플리케이션 URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | NextAuth 세션 암호화 키 | `openssl rand -base64 32` 결과값 |

### 3. 실행

```bash
npm run dev
```

`http://localhost:3000` 에서 접속할 수 있다.

---

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드 결과 실행 |
| `npm run lint` | ESLint 검사 |
