import { useSocket } from '@/components/messenger/SocketProvider';
import { useEffect, useRef } from 'react';

export function useSubscribe(
    destination: string,
    onMessage: (payload: unknown) => void,
) {
    const { subscribe, isConnected } = useSocket();
    const onMessageRef = useRef(onMessage);

    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        if (!destination || !isConnected) return;

        const unsubscribe = subscribe(destination, (message) => {
            onMessageRef.current(JSON.parse(message.body));
        });

        return () => unsubscribe?.();
    }, [destination, isConnected, subscribe]);
}