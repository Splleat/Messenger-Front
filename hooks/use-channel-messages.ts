import { Session } from 'next-auth';
import {
    ChannelEnterResponse,
    ChannelMessagePage,
    MessagePageParam,
    MessageResponse,
} from '@/types/messenger';
import {
    InfiniteData,
    useInfiniteQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { fetchCursorNextMessage, fetchMessages } from '@/lib/api-messenger';
import { useCallback, useEffect, useMemo, useRef } from 'react';

const MESSAGE_INDEX_START = 10_000;

function mergeMessageById(
    messages: MessageResponse[],
    incoming: MessageResponse,
): MessageResponse[] {
    if (messages.some((m) => m.id === incoming.id)) {
        return messages; // 이미 존재 → 중복 무시
    }

    return [...messages, incoming].sort((a, b) => {
        const left = BigInt(a.id);
        const right = BigInt(b.id);

        if (left < right) return -1;
        if (left > right) return 1;
        return 0;
    });
}

export function useChannelMessages(
    session: Session,
    channelId: string,
    messageHistory: ChannelEnterResponse,
) {
    const queryKey = useMemo(() => ['messages', channelId], [channelId]);
    const lastReadMessageId = messageHistory.lastReadMessageId;
    const queryClient = useQueryClient();

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

    const hasNextPageRef = useRef<boolean>(hasNextPage);

    useEffect(() => {
        hasNextPageRef.current = hasNextPage;
    }, [hasNextPage]);

    const addMessage = useCallback(
        (message: MessageResponse) => {
            if (hasNextPageRef.current) return;
            queryClient.setQueryData<InfiniteData<ChannelMessagePage>>(
                queryKey,
                (oldData) => {
                    if (!oldData) return oldData;

                    const updatedPages = [...oldData.pages];
                    const lastPageIndex = updatedPages.length - 1;
                    const lastPage = updatedPages[lastPageIndex];

                    updatedPages[lastPageIndex] = {
                        ...lastPage,
                        messages: mergeMessageById(lastPage.messages, message),
                    };

                    return {
                        ...oldData,
                        pages: updatedPages,
                    };
                },
            );
        },
        [queryClient, queryKey],
    );

    const syncFrom = useCallback(async() => {
        const cached = queryClient.getQueryData<InfiniteData<ChannelMessagePage>>(queryKey);
        let cursor = cached?.pages.at(-1)?.messages.at(-1)?.id ?? lastReadMessageId;

        if (!cursor) return;

        while (true) {
            const page = await fetchCursorNextMessage(session, channelId, cursor);
            page.messages.forEach(addMessage);

            if (!page.hasMore || page.messages.length === 0) break;

            cursor = page.messages.at(-1)!.id;
        }
    }, [queryClient, queryKey, session, channelId, addMessage, lastReadMessageId])

    useEffect(() => {
        return () => {
            queryClient.removeQueries({ queryKey: ['messages', channelId] });
        };
    }, [channelId, queryClient]);

    return {
        messages,
        firstItemIndex,
        addMessage,
        lastReadMessageId,
        fetchPreviousPage,
        fetchNextPage,
        hasPreviousPage,
        hasNextPage,
        isFetchingPreviousPage,
        isFetchingNextPage,
        syncFrom
    };
}
