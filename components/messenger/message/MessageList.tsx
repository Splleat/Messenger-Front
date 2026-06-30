'use client';

import { MessageResponse } from '@/types/messenger';
import { MessageItem } from '@/components/messenger/message/MessageItem';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { useRef, useState } from 'react';

interface MessageListProps {
    messages: MessageResponse[];
    onLoadPrevious: () => void;
    onLoadNext: () => void;
    hasPrevious: boolean;
    hasNext: boolean;
    isLoadingPrevious: boolean;
    isLoadingNext: boolean;
    anchorMessageId?: string;
    firstItemIndex: number;
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
    firstItemIndex,
}: Readonly<MessageListProps>) {
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const userScrolledRef = useRef(false);
    const [initialTopIndex] = useState(() => {
        if (anchorMessageId) {
            const idx = messages.findIndex((m) => m.id === anchorMessageId);
            return idx === -1 ? Math.max(messages.length - 1, 0) : idx;
        }

        return Math.max(messages.length - 1, 0);
    });

    return (
        <Virtuoso
            ref={virtuosoRef}
            data={messages}
            firstItemIndex={firstItemIndex}
            style={{ height: '100%' }}
            computeItemKey={(_, msg) => msg.id}
            followOutput={(isAtBottom) => {
                if (hasNext) return false;

                return isAtBottom ? 'auto' : false;
            }}
            initialTopMostItemIndex={{
                index: initialTopIndex,
                align: anchorMessageId ? 'center' : 'end',
            }}
            isScrolling={(isScrolling) => {
                if (isScrolling) {
                    userScrolledRef.current = true;
                }
            }}
            startReached={() => {
                if (
                    userScrolledRef.current &&
                    hasPrevious &&
                    !isLoadingPrevious
                ) {
                    onLoadPrevious();
                }
            }}
            endReached={() => {
                if (hasNext && !isLoadingNext) onLoadNext();
            }}
            itemContent={(_, msg) => {
                return <MessageItem {...msg} />;
            }}
        />
    );
}
