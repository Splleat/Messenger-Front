'use client';

import { MessageResponse } from '@/types/messenger';
import { MessageItem } from '@/components/messenger/message/MessageItem';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { useRef, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

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
    updateMessage: (messageId: string, content: string) => void;
    deleteMessage: (messageId: string) => void;
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
    updateMessage,
    deleteMessage,
}: Readonly<MessageListProps>) {
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const userScrolledRef = useRef(false);
    const [topVisibleDate, setTopVisibleDate] = useState<string | null>(null);
    const [showDate, setShowDate] = useState(false);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [initialTopIndex] = useState(() => {
        if (anchorMessageId) {
            const idx = messages.findIndex((m) => m.id === anchorMessageId);
            return idx === -1 ? Math.max(messages.length - 1, 0) : idx;
        }

        return Math.max(messages.length - 1, 0);
    });

    return (
        <div className="relative h-full">
            {showDate && topVisibleDate && (
                <div className="absolute top-2 left-1/2 z-10 -translate-x-1/2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground shadow-md transition-opacity">
                    {new Date(topVisibleDate).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </div>
            )}
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
                    setShowDate(true);
                    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
                } else {
                    hideTimeoutRef.current = setTimeout(() => setShowDate(false), 3000);
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
            rangeChanged={({ startIndex }) => {
                const msg = messages[startIndex - firstItemIndex];
                if (msg) setTopVisibleDate(msg.createdAt);
            }}
            itemContent={(_, msg) => {
                return (
                    <MessageItem
                        {...msg}
                        onUpdateMessage={updateMessage}
                        onDeleteMessage={deleteMessage}
                    />
                );
            }}
            components={{
                Header: () => (
                    <div className="flex h-10 items-center justify-center">
                        {isLoadingPrevious && (
                            <Spinner className="text-muted-foreground" />
                        )}
                    </div>
                ),
                Footer: () => (
                    <div className="flex h-10 items-center justify-center">
                        {isLoadingNext && (
                            <Spinner className="text-muted-foreground" />
                        )}
                    </div>
                ),
            }}
            />
        </div>
    );
}
