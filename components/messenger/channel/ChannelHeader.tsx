import { Hash } from 'lucide-react';
import {
    ChannelListResponse,
    ChannelParticipantResponse,
    SpaceResponse,
} from '@/types/common';
import * as React from 'react';
import { DirectChannelInviteForm } from '@/components/messenger/direct/DirectChannelInviteForm';
import { ChannelParticipantDialog } from '@/components/messenger/channel/ChannelParticipantDialog';
import { ChannelLeaveButton } from '@/components/messenger/channel/ChannelLeaveButton';
import { Session } from 'next-auth';

export function ChannelHeader({
    session,
    channel,
    participants,
    space,
}: Readonly<{
    session: Session;
    channel: ChannelListResponse;
    participants: ChannelParticipantResponse[];
    space?: SpaceResponse;
}>) {
    const inviteComponent = space ? null : (
        <DirectChannelInviteForm channelId={channel.channelId} />
    );

    const leaveComponent = space ? null : (
        <ChannelLeaveButton session={session} channelId={channel.channelId} />
    );

    return (
        <header className="h-12 border-b border-border flex items-center px-4 justify-between bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-10">
            <div className="flex items-center gap-2 overflow-hidden">
                <Hash className="w-5 h-5 text-muted-foreground shrink-0" />
                <span className="font-bold text-sm text-foreground truncate">
                    {channel.channelName}
                </span>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground">
                <div className="hidden md:flex items-center gap-4">
                    {inviteComponent}
                    <ChannelParticipantDialog participants={participants} />
                </div>

                <div className="flex items-center gap-3">{leaveComponent}</div>
            </div>
        </header>
    );
}
