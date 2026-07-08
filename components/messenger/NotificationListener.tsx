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

        // 브라우저 탭이 백그라운드이거나 창 포커스를 잃은 경우
        const isTabHidden = typeof document !== 'undefined' && (document.hidden || !document.hasFocus());

        // 채널에 접속 중이면서 브라우저가 활성화된 상태에서만 알림 생략
        if (currentChannelId === event.channelId && !isTabHidden) return;

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