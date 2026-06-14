'use client';

import { useState } from 'react';
import { ChannelEnterResponse, MessageRequest } from '@/types/common';
import { ChannelChatInput } from '@/components/messenger/ChannelChatInput';
import { MessageList } from '@/components/messenger/MessageList';
import { Session } from 'next-auth';
import { Card, CardContent } from '@/components/ui/card';
import { uuidv7 } from 'uuidv7';
import { useChannelMessages } from '@/hooks/use-channel-messages';
import { useChannelSocket } from '@/hooks/use-channel-socket';

export function ChannelChat({
    session,
    channelId,
    accessToken,
    messageHistory,
}: Readonly<{
    session: Session;
    channelId: string;
    spaceId?: string;
    accessToken: string;
    messageHistory: ChannelEnterResponse;
}>) {
    const [content, setContent] = useState('');

    const {
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
        syncFrom,
    } = useChannelMessages(session, channelId, messageHistory);

    const { sendMessage } = useChannelSocket({
        channelId,
        accessToken,
        onMessage: addMessage,
        onReconnect: syncFrom,
    });

    function handleSubmit() {
        if (!content.trim()) return;

        const request: MessageRequest = {
            content: content,
            idempotencyKey: uuidv7(),
            type: 'DIRECT',
        };

        sendMessage(request);

        setContent('');
    }

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
                    onSubmit={handleSubmit}
                />
            </CardContent>
        </Card>
    );
}
