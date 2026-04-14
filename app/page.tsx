'use client'

import { userStore } from '@/lib/store/userStore';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function MainPage() {
    const user = userStore((state) => state.user);
    const isHydrated = userStore((state) => state._isHydrated);

    if (!isHydrated) {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen">
                <LoadingSpinner/>
            </main>
        );
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen">
            {user ? (
                <h1 className="text-2xl font-bold">
                    안녕하세요, {user.username}님!
                </h1>
            ) : (
                <h1 className="text-2xl font-bold text-gray-500">
                    로그인이 필요합니다.
                </h1>
            )}
        </main>
    );
}