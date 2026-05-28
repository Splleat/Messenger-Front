import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageResponse } from '@/types/common';
import React from 'react';
import { useMounted } from '@/hooks/use-mounted';

export const MessageItem = React.memo(function MessageItem({
    username,
    content,
    createdAt,
}: Readonly<MessageResponse>) {
    const mounted = useMounted();

    return (
        <div className="group flex gap-4 px-4 py-3 hover:bg-accent/50 transition-colors">
            <Avatar className="w-10 h-10 rounded-full shrink-0 border border-border">
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
            </div>
        </div>
    );
});

function formatMessageDate(date: string) {
    return new Date(date).toLocaleTimeString('ko-KR');
}
