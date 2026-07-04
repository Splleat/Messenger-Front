import { useSubscribe } from '@/hooks/use-subscribe';
import {
    MessageCreatedData,
    MessageEvent,
    MessageRequest,
    MessageResponse,
    MessageUpdatedData,
    TypingEvent,
    TypingRequest,
} from '@/types/messenger';
import { useCallback, useEffect, useRef } from 'react';
import { useSocket } from '@/components/messenger/SocketProvider';

export function useChannelSubscribe({
    channelId,
    receiveMessage,
    updateMessage,
    deleteMessage,
    receiveTyping,
}: {
    channelId: string;
    receiveMessage: (message: MessageResponse) => void;
    updateMessage: (messageId: string, content: string) => void;
    deleteMessage: (messageId: string) => void;
    receiveTyping: (message: TypingEvent) => void;
}) {
    const onMessageRef = useRef(receiveMessage);
    const updateMessageRef = useRef(updateMessage);
    const deleteMessageRef = useRef(deleteMessage);
    const onTypingRef = useRef(receiveTyping);
    const { publish, isConnected, hasEverConnected } = useSocket();

    useEffect(() => {
        onMessageRef.current = receiveMessage;
    }, [receiveMessage]);

    useEffect(() => {
        updateMessageRef.current = updateMessage;
    }, [updateMessage]);

    useEffect(() => {
        deleteMessageRef.current = deleteMessage;
    }, [deleteMessage]);

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
                updateMessageRef.current(
                    payload.messageId,
                    (payload.data as MessageUpdatedData).content,
                );
                break;
            case 'DELETED':
                deleteMessageRef.current(payload.messageId);
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

    const sendUpdateMessage = useCallback(
        (messageId: string, content: string) =>
            publish(
                `/pub/channels/${channelId}/messages/${messageId}/update`,
                JSON.stringify({ content }),
            ),
        [channelId, publish],
    );

    const sendDeleteMessage = useCallback(
        (messageId: string) =>
            publish(
                `/pub/channels/${channelId}/messages/${messageId}/delete`,
                '',
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

    return {
        sendMessage,
        sendUpdateMessage,
        sendDeleteMessage,
        sendTyping,
        showDisconnectBanner,
    };
}