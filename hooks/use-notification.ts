import { NotificationEvent } from '@/types/messenger';
import { useSubscribe } from '@/hooks/use-subscribe';
import { useEffect, useRef } from 'react';

export function useNotification(userId: string, onNotification: (event: NotificationEvent) => void) {
    const onNotificationRef = useRef(onNotification);

    useEffect(() => {
        onNotificationRef.current = onNotification;
    }, [onNotification]);


    useSubscribe(`/sub/users/${userId}/notifications`, (message) => {
        const payload = message as NotificationEvent;
        onNotificationRef.current(payload);
    });
}