import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageResponse } from '@/types/messenger';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useMounted } from '@/hooks/use-mounted';
import { AttachmentRenderer } from '@/components/messenger/message/AttachmentRenderer';
import { ProfileCardModal } from '@/components/user/ProfileCardModal';

export const MessageItem = React.memo(function MessageItem({
    userId,
    username,
    profileUrl,
    content,
    createdAt,
    attachments
}: Readonly<MessageResponse>) {
    const hasAttachment = attachments && attachments.length > 0;
    const mounted = useMounted();
    const { data: session } = useSession();
    const [profileOpen, setProfileOpen] = useState(false);

    return (
        <div className="space flex gap-4 px-4 py-3 hover:bg-accent/50 transition-colors">
            <Avatar
                className="w-10 h-10 rounded-full shrink-0 border border-border cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setProfileOpen(true)}
            >
                <AvatarImage src={profileUrl} />
                <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">
                    {username?.[0].toUpperCase() || 'ME'}
                </AvatarFallback>
            </Avatar>
            {session && (
                <ProfileCardModal
                    session={session}
                    userId={userId}
                    open={profileOpen}
                    onOpenChange={setProfileOpen}
                />
            )}
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
