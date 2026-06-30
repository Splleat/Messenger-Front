import { API_BASE_URL } from '@/lib/config';
import {
    MessageCreatedData,
    MessageEvent,
    MessageRequest,
    MessageResponse,
} from '@/types/messenger';
import { useCallback, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function useChannelSocket({
    channelId,
    accessToken,
    onMessage,
    onReconnect,
}: {
    channelId: string;
    accessToken: string;
    onMessage: (message: MessageResponse) => void;
    onReconnect: () => void;
}) {
    const clientRef = useRef<Client | null>(null);
    const hasConnectedRef = useRef<boolean>(false);
    const onMessageRef = useRef(onMessage);
    const onReconnectRef = useRef(onReconnect);

    useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);
    useEffect(() => { onReconnectRef.current = onReconnect; }, [onReconnect]);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () =>
                new SockJS(`${API_BASE_URL}/ws-stomp`),
            connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
            onConnect: () => {
                client.subscribe(
                    `/sub/channels/${channelId}/messages`,
                    (message) => {
                        const payload = JSON.parse(
                            message.body,
                        ) as MessageEvent<unknown>;

                        switch (payload.type) {
                            case 'CREATED':
                                onMessageRef.current(
                                    (payload.data as MessageCreatedData).message,
                                );
                                break;
                            case 'UPDATED':
                                // TODO: 메시지 업데이트
                                break;
                            case 'DELETED':
                                // TODO: 메시지 삭제 처리
                                break;
                            default:
                                break;
                        }
                    },
                );
                if (hasConnectedRef.current) {
                    onReconnectRef.current();
                }
                hasConnectedRef.current = true;
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            clientRef.current?.deactivate();
        };
    }, [channelId, accessToken]);

    const sendMessage = useCallback((request: MessageRequest) => {
        const client = clientRef.current;

        if(!client?.connected) return;

        client.publish({
            destination: `/pub/channels/${channelId}/messages`,
            body: JSON.stringify(request),
            });
    }, [channelId]);

    return { sendMessage };
}