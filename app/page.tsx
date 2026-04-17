'use client';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useSession } from 'next-auth/react';
import LogoutButton from '@/components/auth/LogoutButton';

export default function MainPage() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen">
                <LoadingSpinner />
            </main>
        );
    }

    if (status === 'authenticated' && session) {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold">
                    안녕하세요, {session.user?.username}님!
                </h1>
                <div>
                    <LogoutButton/>
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