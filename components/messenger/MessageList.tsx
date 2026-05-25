'use client';

import { MessageResponse } from '@/types/common';
import { MessageItem } from '@/components/messenger/MessageItem';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { useEffect, useRef, useState } from 'react';

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
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const [initialTopIndex] = useState<number>(() => {
        return anchorMessageId ?
            messages.findIndex((m) => m.id === anchorMessageId) :
            Math.max(0, messages.length - 1);
    });

    return (
        <Virtuoso
            ref={virtuosoRef}
            data={messages}
            initialTopMostItemIndex={initialTopIndex}
            firstItemIndex={initialTopIndex}
            startReached={() => {
                if (hasPrevious && !isLoadingPrevious) onLoadPrevious();
            }}
            endReached={() => {
                if (hasNext && !isLoadingNext) onLoadNext();
            }}
            itemContent={(_, msg) => <MessageItem key={msg.id} {...msg} />}
            components={{
                Header: () =>
                    isLoadingPrevious ? (
                        <div className="py-2 text-center text-sm">
                            불러오는 중...
                        </div>
                    ) : null,
                Footer: () =>
                    isLoadingNext ? (
                        <div className="py-2 text-center text-sm">
                            불러오는 중...
                        </div>
                    ) : null,
            }}
        />
    );
}