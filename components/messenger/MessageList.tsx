import { MessageResponse } from '@/types/common';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageItem } from '@/components/messenger/MessageItem';

export function MessageList({ messages }: Readonly<{ messages: MessageResponse[] }>) {
    return (
        <ScrollArea className="min-h-0 flex-1">
            <div className="flex flex-col pb-4">
                {messages.map((msg) => (
                    <MessageItem
                        key={msg.id}
                        {...msg}
                        createdAt={msg.createdAt}
                    />
                ))}
            </div>
        </ScrollArea>
    );
}