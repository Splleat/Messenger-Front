import { API_BASE_URL } from '@/lib/config';
import {
    MessageCreatedData,
    MessageEvent,
    MessageRequest,
    MessageResponse,
    TypingEvent,
    TypingRequest,
} from '@/types/messenger';
import { useCallback, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function useChannelSocket({
    channelId,
    accessToken,
    receiveMessage,
    receiveTyping,
    onReconnect,
}: {
    channelId: string;
    accessToken: string;
    receiveMessage: (message: MessageResponse) => void;
    receiveTyping: (event: TypingEvent) => void;
    onReconnect: () => void;
}) {
    const clientRef = useRef<Client | null>(null);
    const hasConnectedRef = useRef<boolean>(false);
    const onMessageRef = useRef(receiveMessage);
    const onTypingRef = useRef(receiveTyping);
    const onReconnectRef = useRef(onReconnect);

    useEffect(() => { onMessageRef.current = receiveMessage; }, [receiveMessage]);
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
                client.subscribe(
                    `/sub/channels/${channelId}/typing`,
                    (event) => {
                        const payload = JSON.parse(
                            event.body
                        ) as TypingEvent;

                        onTypingRef.current(payload);
                    }
                )
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

    const sendTyping = useCallback((request: TypingRequest) => {
        const client = clientRef.current;

        if (!client?.connected) return;

        client.publish({
            destination: `/pub/channels/${channelId}/typing`,
            body: JSON.stringify(request),
        });
    }, [channelId]);

    return { sendMessage, sendTyping };
}