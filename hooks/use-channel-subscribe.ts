import { useSubscribe } from '@/hooks/use-subscribe';
import {
    MessageCreatedData,
    MessageEvent,
    MessageRequest,
    MessageResponse,
    TypingEvent,
    TypingRequest,
} from '@/types/messenger';
import { useCallback, useEffect, useRef } from 'react';
import { useSocket } from '@/components/messenger/SocketProvider';

export function useChannelSubscribe({
    channelId,
    receiveMessage,
    receiveTyping,
}: {
    channelId: string;
    receiveMessage: (message: MessageResponse) => void;
    receiveTyping: (message: TypingEvent) => void;
}) {
    const onMessageRef = useRef(receiveMessage);
    const onTypingRef = useRef(receiveTyping);
    const { publish, isConnected, hasEverConnected } = useSocket();

    useEffect(() => {
        onMessageRef.current = receiveMessage;
    }, [receiveMessage]);

    useEffect(() => {
        onTypingRef.current = receiveTyping;
    }, [receiveTyping]);

    useSubscribe(`/sub/channels/${channelId}/messages`, (message) => {
        const payload = message as MessageEvent<unknown>;

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
    });

    useSubscribe(`/sub/channels/${channelId}/typing`, (message) => {
        const payload = message as TypingEvent;

        onTypingRef.current(payload);
    });

    const sendMessage = useCallback(
        (request: MessageRequest) =>
            publish(
                `/pub/channels/${channelId}/messages`,
                JSON.stringify(request),
            ),
        [channelId, publish],
    );

    const sendTyping = useCallback(
        (request: TypingRequest) =>
            publish(
                `/pub/channels/${channelId}/typing`,
                JSON.stringify(request),
            ),
        [channelId, publish],
    );

    const showDisconnectBanner = !isConnected && hasEverConnected;

    return { sendMessage, sendTyping, showDisconnectBanner };
}