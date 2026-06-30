import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageResponse } from '@/types/messenger';
import React from 'react';
import { useMounted } from '@/hooks/use-mounted';
import { AttachmentRenderer } from '@/components/messenger/message/AttachmentRenderer';

export const MessageItem = React.memo(function MessageItem({
    username,
    profileUrl,
    content,
    createdAt,
    attachments
}: Readonly<MessageResponse>) {
    const hasAttachment = attachments && attachments.length > 0;
    const mounted = useMounted();

    return (
        <div className="space flex gap-4 px-4 py-3 hover:bg-accent/50 transition-colors">
            <Avatar className="w-10 h-10 rounded-full shrink-0 border border-border">
                <AvatarImage src={profileUrl} />
                <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">
                    {username?.[0].toUpperCase() || 'ME'}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold tracking-tight">
                        {username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {mounted ? formatMessageDate(createdAt) : '...'}
                    </span>
                </div>
                <p className="text-sm leading-7 text-foreground/90">
                    {content}
                </p>
                {hasAttachment && (
                    <div className="flex items-center gap-2">
                        {attachments.map((attachment) => (
                            <AttachmentRenderer
                                key={attachment.id}
                                attachment={attachment}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});

function formatMessageDate(date: string) {
    return new Date(date).toLocaleTimeString('ko-KR');
}
