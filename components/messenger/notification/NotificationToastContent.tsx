import { NotificationEvent } from '@/types/messenger';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageIcon } from 'lucide-react';

export function NotificationToastContent({
    senderName,
    senderProfileUrl,
    content,
    hasAttachment,
    onClick,
}: Readonly<NotificationEvent & { onClick?: () => void }>) {
    return (
        <div
            onClick={onClick}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-md transition-colors hover:bg-accent/50"
        >
            <Avatar className="h-9 w-9 shrink-0 rounded-full border border-border">
                <AvatarImage src={senderProfileUrl} />
                <AvatarFallback className="bg-muted text-xs font-bold text-muted-foreground">
                    {senderName?.[0]?.toUpperCase() ?? '?'}
                </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-semibold tracking-tight">
                    {senderName}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    {hasAttachment && (
                        <ImageIcon className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span className="truncate">
                        {hasAttachment ? '사진을 보냈습니다' : content}
                    </span>
                </span>
            </div>
        </div>
    );
}
