import React, { Suspense } from 'react';
import { SocketProvider } from '@/components/messenger/SocketProvider';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { NotificationListener } from '@/components/messenger/NotificationListener';

export default async function MessengerLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const session = await auth();

    if (!session?.accessToken || session.error === 'RefreshTokenError') {
        redirect('/auth/login');
    }

    return (
        <SocketProvider accessToken={session.accessToken}>
            <Suspense fallback={null}>
                <NotificationListener />
            </Suspense>
            {children}
        </SocketProvider>
    );
}