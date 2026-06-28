# Messenger Front

실시간 메신저 서비스의 프론트엔드. [Messenger-Project](https://github.com/Splleat/Messenger-Project)와 연동되며, STOMP 기반 실시간 메시지 송수신과 커서 기반 무한 스크롤을 제공합니다.

🔗 **데모: [www.splleat.com](https://www.splleat.com)**

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

## 프로젝트 구조

```text
.
├── app/                       # Next.js App Router (페이지 · 레이아웃 · 라우트 핸들러)
│   ├── (messenger)/main/      # 메신저 메인 페이지
│   ├── auth/                  # 로그인 · 회원가입 페이지
│   └── api/auth/              # NextAuth 라우트 핸들러
│
├── actions/                   # 서버 액션
│   ├── auth/                  # 로그인 · 로그아웃 · 회원가입
│   └── messenger/             # 스페이스 · 채널 생성/초대/탈퇴
│
├── components/                # UI 컴포넌트
│   ├── auth/                  # 인증 관련 컴포넌트
│   ├── messenger/             # 채널 채팅 · 사이드바 · 메시지 리스트
│   ├── common/                # 공통 컴포넌트
│   └── ui/                    # shadcn
│
├── hooks/                     # 커스텀 훅
├── lib/                       # API 통신 함수 · 유틸 · 클라이언트 상태
├── schema/                    # Zod 검증 스키마
├── types/                     # 타입 정의
│
├── auth.ts                    # NextAuth 설정
└── proxy.ts                   # 미들웨어
```

---
