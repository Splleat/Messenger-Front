'use client';

import { MessageResponse } from '@/types/common';
import { MessageItem } from '@/components/messenger/MessageItem';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

interface MessageListProps {
    messages: MessageResponse[];
    onLoadPrevious: () => void;
    onLoadNext: () => void;
    hasPrevious: boolean;
    hasNext: boolean;
    isLoadingPrevious: boolean;
    isLoadingNext: boolean;
    anchorMessageId?: string;
}

export function MessageList({
    messages,
    onLoadPrevious,
    onLoadNext,
    hasPrevious,
    hasNext,
    isLoadingPrevious,
    isLoadingNext,
    anchorMessageId,
}: Readonly<MessageListProps>) {
    const START_INDEX = 10000;
    const [firstItemIndex, setFirstItemIndex] = useState(START_INDEX);
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const initialTopIndex = useMemo(() => {
        if (anchorMessageId) {
            const lastReadMessageIdx = messages.findIndex(
                (m) => m.id === anchorMessageId,
            );

            return lastReadMessageIdx === -1
                ? firstItemIndex + messages.length - 1
                : firstItemIndex + lastReadMessageIdx;
        }

        return firstItemIndex + messages.length - 1;
    }, [anchorMessageId, firstItemIndex, messages]);

    const prevFirstIdRef = useRef<string | undefined>(messages[0]?.id);
    const prevLengthRef = useRef<number>(messages.length);

    useLayoutEffect(() => {
        const prevFirstId = prevFirstIdRef.current;
        const currentFirstId = messages[0]?.id;
        const prevLength = prevLengthRef.current;

        if (prevLength > 0 && messages.length > prevLength && prevFirstId !== currentFirstId) {
            const addedCount = messages.length - prevLength;

            if (addedCount > 0) {
                setFirstItemIndex((prev) => prev - addedCount);
            }
        }

        prevFirstIdRef.current = messages[0]?.id;
        prevLengthRef.current = messages.length;
    }, [messages]);

    return (
        <Virtuoso
            ref={virtuosoRef}
            style={{ height: '100%', width: '100%' }}
            data={messages}
            firstItemIndex={firstItemIndex}
            followOutput={(isAtBottom) => {
                if (hasNext) return false;

                return isAtBottom ? 'auto' : false;
            }}
            initialTopMostItemIndex={{ index: initialTopIndex, align: 'end' }}
            startReached={() => {
                if (hasPrevious && !isLoadingPrevious) onLoadPrevious();
            }}
            endReached={() => {
                if (hasNext && !isLoadingNext) onLoadNext();
            }}
            itemContent={(_, msg) => <MessageItem key={msg.id} {...msg} />}
        />
    );
}