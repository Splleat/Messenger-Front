'use client';

import {
    ChannelEnterResponse,
    MessageRequest,
    TypingEvent,
} from '@/types/messenger';
import { ChannelChatInput } from '@/components/messenger/channel/ChannelChatInput';
import { MessageList } from '@/components/messenger/message/MessageList';
import { Session } from 'next-auth';
import { Card, CardContent } from '@/components/ui/card';
import { uuidv7 } from 'uuidv7';
import { useChannelMessages } from '@/hooks/use-channel-messages';
import { useChannelSocket } from '@/hooks/use-channel-socket';
import { useStorageUpload } from '@/hooks/use-storage-upload';
import { useState } from 'react';

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

    const { sendMessage, sendTyping } = useChannelSocket({
        channelId,
        accessToken,
        receiveMessage: addMessage,
        receiveTyping: onTypingEvent,
        onReconnect: syncFrom,
    });

    const { uploadFile } = useStorageUpload(session);

    const [typingUser, setTypingUser] = useState<TypingEvent | null>(null);

    function onTypingEvent(event: TypingEvent) {
        if (event.isTyping && event.userId !== session.user?.id) {
            setTypingUser(event);
        } else {
            setTypingUser(null);
        }
    }

    async function handleSubmit(text: string, file?: File) {
        if (!file && !text.trim()) {
            return;
        }

        const request: MessageRequest = {
            content: text,
            idempotencyKey: uuidv7(),
            type: 'DIRECT',
        };

        if (file) {
            const objectKey = await uploadFile(file);
            const isImage = file.type.startsWith('image/');

            sendMessage({
                attachments: [
                    {
                        type: isImage ? 'image' : 'file',
                        url: objectKey,
                    },
                ],
                ...request,
            });
        } else {
            sendMessage(request);
        }
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

            <CardContent className="relative p-4 bg-background">
                {typingUser && (
                    <p className="absolute -top-2 left-5 text-xs text-muted-foreground">
                        {typingUser.username}님이 입력 중...
                    </p>
                )}
                <ChannelChatInput
                    placeHolder="메시지 전송"
                    onSubmit={handleSubmit}
                    onTyping={(isTyping) => sendTyping({ isTyping })}
                />
            </CardContent>
        </Card>
    );
}
