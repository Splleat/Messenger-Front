import { MessageRequest, MessageResponse } from '@/types/common';
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

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () =>
                new SockJS('http://localhost:8080/ws-stomp'),
            connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
            onConnect: () => {
                client.subscribe(
                    `/sub/channels/${channelId}/messages`,
                    (message) => {
                        const payload = JSON.parse(
                            message.body,
                        ) as MessageResponse;

                        onMessage(payload);
                    },
                );
                if (hasConnectedRef.current) {
                    onReconnect();
                }
                hasConnectedRef.current = true;
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            clientRef.current?.deactivate();
        };
    }, [channelId, accessToken, onMessage, onReconnect]);

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