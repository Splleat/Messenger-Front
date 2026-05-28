'use client';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

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
        redirect('/main');
    }

    if (session.status === 'unauthenticated') {
        redirect('/auth/login');
    }

    return null;
}