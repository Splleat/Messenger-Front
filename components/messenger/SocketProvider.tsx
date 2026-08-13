'use client';

import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_BASE_URL } from '@/lib/config';
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useRouter } from 'next/navigation';

interface SocketContextValue {
    subscribe: (
        destination: string,
        callback: (message: IMessage) => void,
    ) => (() => void) | null;
    publish: (destination: string, body: string) => void;
    isConnected: boolean;
    hasEverConnected: boolean;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({
    accessToken,
    children,
}: Readonly<{ accessToken: string; children: React.ReactNode }>) {
    const clientRef = useRef<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [hasEverConnected, setHasEverConnected] = useState(false);
    const hasConnectedBeforeRef = useRef(false);
    const router = useRouter();

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws-stomp`),
            connectHeaders: { Authorization: `Bearer ${accessToken}` },
            onConnect: () => {
                if (hasConnectedBeforeRef.current) {
                    router.refresh(); // 재연결 시 새로고침
                }
                hasConnectedBeforeRef.current = true;
                setIsConnected(true);
                setHasEverConnected(true);
            },
            onDisconnect: () => setIsConnected(false),
        });

        client.activate();
        clientRef.current = client;

        return () => {
            clientRef.current?.deactivate();
        };
    }, [accessToken, router]);

    const subscribe = useCallback(
        (destination: string, callback: (message: IMessage) => void) => {
            const client = clientRef.current;
            if (!client?.connected) return null;

            const sub = client.subscribe(destination, callback);
            return () => {
                if (client.connected) sub.unsubscribe();
            };
        },
        [],
    );

    const publish = useCallback((destination: string, body: string) => {
        if (!clientRef.current?.connected) return;
        clientRef.current.publish({ destination, body });
    }, []);

    // React Context는 참조가 달라지면 무조건 모든 구독 컴포넌트를 리렌더링 -> SocketProvider가 리렌더링 될 때마다 해당 컨텍스트를 구독하는 모든 컴포넌트가 리렌더링
    // useMemo를 사용해 의존성 배열이 바뀔 때만 구독 컴포넌트들이 리렌더링하게 함
    const value = useMemo(
        () => ({ subscribe, publish, isConnected, hasEverConnected }),
        [subscribe, publish, isConnected, hasEverConnected],
    );

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (!context)
        throw new Error('useSocket은 SocketProvider 안에서 사용해야 합니다.');

    return context;
}