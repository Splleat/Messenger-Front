'use client';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import LogoutButton from '@/components/auth/LogoutButton';
import { useSession } from 'next-auth/react';

export default function MainPage() {
    const session = useSession();

    if (session.status === 'loading') {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen">
                <LoadingSpinner />
            </main>
        );
    }

    if (session.status === 'authenticated') {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold">
                    안녕하세요, {session.data?.user.username}님!
                </h1>
                <div>
                    <LogoutButton />
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold text-gray-500">
                로그인이 필요합니다.
            </h1>
        </main>
    );
}