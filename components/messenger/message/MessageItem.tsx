import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageResponse } from '@/types/messenger';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useMounted } from '@/hooks/use-mounted';
import { AttachmentRenderer } from '@/components/messenger/message/AttachmentRenderer';
import { ProfileCardModal } from '@/components/user/ProfileCardModal';
import { MessageContent } from '@/components/messenger/message/MessageContent';
import { MessageActions } from '@/components/messenger/message/MessageActions';

export const MessageItem = React.memo(function MessageItem({
    id,
    userId,
    username,
    profileUrl,
    content,
    createdAt,
    attachments,
    isUpdated,
    isDeleted,
    onUpdateMessage,
    onDeleteMessage,
}: Readonly<
    MessageResponse & {
        onUpdateMessage: (messageId: string, content: string) => void;
        onDeleteMessage: (messageId: string) => void;
    }
>) {
    const hasAttachment = attachments && attachments.length > 0;
    const mounted = useMounted();
    const { data: session } = useSession();
    const [profileOpen, setProfileOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(content);

    const isOwner = session?.user?.id === userId;

    function handleSave() {
        if (draft.trim() && draft !== content) {
            onUpdateMessage(id, draft);
        }
        setIsEditing(false);
    }

    function handleCancel() {
        setDraft(content);
        setIsEditing(false);
    }

    return (
        <div className="group flex gap-4 px-4 py-3 transition-colors hover:bg-accent/50">
            <Avatar
                className="h-10 w-10 shrink-0 cursor-pointer rounded-full border border-border transition-opacity hover:opacity-80"
                onClick={() => setProfileOpen(true)}
            >
                <AvatarImage src={profileUrl} />
                <AvatarFallback className="bg-muted text-xs font-bold text-muted-foreground">
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
            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold tracking-tight">
                        {username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {mounted ? formatMessageDate(createdAt) : '...'}
                    </span>
                </div>

                <MessageContent
                    content={content}
                    isUpdated={isUpdated}
                    isDeleted={isDeleted}
                    isEditing={isEditing}
                    draft={draft}
                    onDraftChange={setDraft}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />

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

            {isOwner && !isDeleted && !isEditing && (
                <MessageActions
                    onEdit={() => setIsEditing(true)}
                    onDelete={() => onDeleteMessage(id)}
                />
            )}
        </div>
    );
});

function formatMessageDate(date: string) {
    return new Date(date).toLocaleTimeString('ko-KR');
}
