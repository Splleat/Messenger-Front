import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageResponse } from '@/types/common';

export function MessageItem({
    username,
    content,
    createdAt,
}: Readonly<MessageResponse>) {
    return (
        <div className="group flex gap-4 px-4 py-1 hover:bg-accent/50 transition-colors mt-4">
            <Avatar className="w-10 h-10 rounded-full shrink-0 border border-border">
                <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">
                    {username}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground hover:underline cursor-pointer">
                        {username}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                        {createdAt.toLocaleString()}
                    </span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed wrap-break-word whitespace-pre-wrap">
                    {content}
                </p>
            </div>
        </div>
    );
}
