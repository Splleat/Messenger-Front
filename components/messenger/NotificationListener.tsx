'use client'

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useNotification } from '@/hooks/use-notification';
import { toast } from 'sonner';
import { NotificationToastContent } from '@/components/messenger/notification/NotificationToastContent';

export function NotificationListener() {
    const session = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    useNotification(session?.data?.user?.id ?? '', (event) => {
        const currentChannelId = searchParams.get('channelId');
        if (currentChannelId === event.channelId) return;

        const audio = new Audio('/notification.mp3');

        audio.play().catch(() => {});

        const toastId = toast.custom(
            () => (
                <NotificationToastContent
                    {...event}
                    onClick={() => {
                        const query = event.spaceId
                            ? `spaceId=${event.spaceId}&channelId=${event.channelId}`
                            : `channelId=${event.channelId}`;

                        router.push(`/main?${query}`);
                        toast.dismiss(toastId);
                    }}
                />
            ),
            { style: { width: '300px' } },
        );
    });

    return null;
}