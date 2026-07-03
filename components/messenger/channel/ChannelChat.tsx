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
import React, { useState } from 'react';

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
    const { uploadFile, isUploading } = useStorageUpload(session);
    const [typingUser, setTypingUser] = useState<TypingEvent | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
                        name: file.name,
                        type: isImage ? 'image' : 'file',
                        url: objectKey,
                        size: file.size,
                    },
                ],
                ...request,
            });
        } else {
            sendMessage(request);
        }
    }

    function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setIsDragging(true);
    }

    function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();

        const file = e.dataTransfer.files?.[0];

        if (file) {
            setSelectedFile(file);
        }

        setIsDragging(false);
    }

    function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setIsDragging(false);
    }

    return (
        <Card
            className="relative flex h-full min-h-0 flex-col overflow-hidden border-none shadow-none bg-background"
            onDragEnter={handleDragEnter}
        >
            {isDragging && (
                <div
                    className="absolute inset-2 z-20 rounded-lg border-2 border-dashed border-primary bg-primary/5"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragLeave={handleDragLeave}
                />
            )}
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
                    isUploading={isUploading}
                    selectedFile={selectedFile}
                    onFileChange={setSelectedFile}
                />
            </CardContent>
        </Card>
    );
}
