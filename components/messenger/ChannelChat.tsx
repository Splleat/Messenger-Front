'use client';

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useEffect, useRef, useState } from 'react';
import { MessageRequest, MessageResponse } from '@/types/common';
import { ChannelChatInput } from '@/components/messenger/ChannelChatInput';
import { MessageList } from '@/components/messenger/MessageList';

export function ChannelChat({
    channelId,
    accessToken,
    messageHistory,
}: Readonly<{
    channelId: string;
    accessToken: string;
    messageHistory: MessageResponse[];
}>) {
    const clientRef = useRef<Client | null>(null);
    const [messages, setMessages] = useState<MessageResponse[]>(messageHistory);
    const [content, setContent] = useState('');

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
                        setMessages((prev) => [...prev, payload]);
                    },
                );
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [channelId, accessToken]);

    function sendMessage() {
        if (!content.trim()) return;

        const request: MessageRequest = {
            content: content,
            idempotencyKey: crypto.randomUUID(),
            type: 'DIRECT',
        };

        clientRef.current?.publish({
            destination: `/pub/channels/${channelId}/messages`,
            body: JSON.stringify(request),
        });

        setContent('');
    }

    return (
        <main className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
            <MessageList messages={messages} />

            <div className="shrink-0 px-4 pb-6 bg-background">
                <ChannelChatInput
                    placeHolder="메시지 전송"
                    value={content}
                    onChange={setContent}
                    onSubmit={sendMessage}
                />
            </div>
        </main>
    );
}
