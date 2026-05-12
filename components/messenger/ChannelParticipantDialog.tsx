import { ChannelParticipantResponse } from '@/types/common';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import * as React from 'react';

export function ChannelParticipantDialog({
    participants,
}: Readonly<{ participants: ChannelParticipantResponse[] }>) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Users className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>참여자</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-80">
                    <div className="space-y-2">
                        {participants.map((participant) => (
                            <div
                                key={participant.userId}
                                className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-accent"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                        {
                                            (participant.username ??
                                                participant.username)[0]
                                        }
                                    </AvatarFallback>
                                </Avatar>

                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-medium">
                                        {participant.username ??
                                            participant.username}
                                    </div>
                                    <div className="truncate text-xs text-muted-foreground">
                                        {participant.userId}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}