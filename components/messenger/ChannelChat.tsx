'use client';

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    ChannelEnterResponse,
    ChannelMessagePage,
    MessagePageParam,
    MessageRequest,
    MessageResponse,
} from '@/types/common';
import { ChannelChatInput } from '@/components/messenger/ChannelChatInput';
import { MessageList } from '@/components/messenger/MessageList';
import {
    InfiniteData,
    useInfiniteQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { fetchMessages, updateChannelLastRead } from '@/lib/api-messenger';
import { Session } from 'next-auth';
import { Card, CardContent } from '@/components/ui/card';

const MESSAGE_INDEX_START = 10_000;

export function ChannelChat({
    session,
    channelId,
    accessToken,
    messageHistory,
}: Readonly<{
    session: Session;
    channelId: string;
    groupId?: string;
    accessToken: string;
    messageHistory: ChannelEnterResponse;
}>) {
    const clientRef = useRef<Client | null>(null);
    const [content, setContent] = useState('');
    const queryClient = useQueryClient();

    const lastReadMessageId = messageHistory.lastReadMessageId;
    const queryKey = useMemo(() => ['messages', channelId], [channelId]);

    const {
        data,
        fetchPreviousPage,
        hasPreviousPage,
        isFetchingPreviousPage,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<
        ChannelMessagePage,
        Error,
        InfiniteData<ChannelMessagePage>,
        string[],
        MessagePageParam
    >({
        queryKey: queryKey,
        queryFn: async ({ pageParam }) => {
            return await fetchMessages(session, pageParam, channelId);
        },
        initialPageParam: {
            cursor: lastReadMessageId,
            direction: 'initial',
        } as MessagePageParam,
        initialData: {
            pages: [
                {
                    messages: messageHistory.messages,
                    hasPrev: messageHistory.hasPrev,
                    prevCursorId: messageHistory.prevCursorId,
                    hasNext: messageHistory.hasNext,
                    nextCursorId: messageHistory.nextCursorId,
                },
            ],
            pageParams: [
                {
                    cursor: null,
                    direction: 'initial',
                },
            ],
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage.hasNext || lastPage.messages.length === 0)
                return undefined;

            const nextCursorId = lastPage.messages.at(-1)?.id;

            return nextCursorId
                ? { cursor: nextCursorId, direction: 'down' }
                : undefined;
        },
        getPreviousPageParam: (firstPage) => {
            if (!firstPage.hasPrev || firstPage.messages.length === 0)
                return undefined;

            const prevCursorId = firstPage.messages[0]?.id;

            return prevCursorId
                ? { cursor: prevCursorId, direction: 'up' }
                : undefined;
        },
    });

    const hasNextPageRef = useRef<boolean>(hasNextPage);

    const previousMessageCount = useMemo(() => {
        if (!data) return 0;

        return data.pages.reduce((count, page, pageIndex) => {
            const pageParam = data.pageParams[pageIndex] as MessagePageParam;

            return pageParam.direction === 'up'
                ? count + page.messages.length
                : count;
        }, 0);
    }, [data]);

    const firstItemIndex = MESSAGE_INDEX_START - previousMessageCount;

    const messages =
        data?.pages?.flatMap((page) => page.messages).filter(Boolean) ?? [];

    useEffect(() => {
        hasNextPageRef.current = hasNextPage;
    }, [hasNextPage]);

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

                        const currentUserId = session.user.id;

                        if (currentUserId && payload.userId !== currentUserId) {
                            updateChannelLastRead(
                                session,
                                channelId,
                                payload.id,
                            );
                        }

                        if (!hasNextPageRef.current) {
                            queryClient.setQueryData<
                                InfiniteData<ChannelMessagePage>
                            >(queryKey, (oldData) => {
                                if (!oldData) return oldData;

                                const updatedPages = [...oldData.pages];
                                const lastPageIndex = updatedPages.length - 1;
                                const lastPage = updatedPages[lastPageIndex];

                                updatedPages[lastPageIndex] = {
                                    ...lastPage,
                                    messages: [...lastPage.messages, payload],
                                };

                                return {
                                    ...oldData,
                                    pages: updatedPages,
                                };
                            });
                        }
                    },
                );
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [channelId, accessToken, queryClient, queryKey]);

    function sendMessage() {
        if (!content.trim()) return;

        const client = clientRef.current;

        if (!client?.connected) {
            return;
        }

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

    useEffect(() => {
        return () => {
            queryClient.removeQueries({ queryKey: ['messages', channelId] });
        };
    }, [channelId, queryClient]);

    return (
        <Card className="flex h-full min-h-0 flex-col overflow-hidden border-none shadow-none bg-background">
            <CardContent className="flex-1 min-h-0 p-0">
                <MessageList
                    key={channelId}
                    messages={messages}
                    firstItemIndex={firstItemIndex}
                    onLoadPrevious={() => fetchPreviousPage()}
                    onLoadNext={() => fetchNextPage()}
                    hasPrevious={hasPreviousPage}
                    hasNext={hasNextPage}
                    isLoadingPrevious={isFetchingPreviousPage}
                    isLoadingNext={isFetchingNextPage}
                    anchorMessageId={lastReadMessageId}
                />
            </CardContent>

            <CardContent className="p-4 bg-background">
                <ChannelChatInput
                    placeHolder="메시지 전송"
                    value={content}
                    onChange={setContent}
                    onSubmit={sendMessage}
                />
            </CardContent>
        </Card>
    );
}
