import { Hash } from 'lucide-react';
import {
    ChannelListResponse,
    ChannelParticipantResponse,
    GroupResponse,
} from '@/types/common';
import * as React from 'react';
import { DirectChannelInviteForm } from '@/components/messenger/DirectChannelInviteForm';
import { GroupInviteForm } from '@/components/messenger/GroupInviteForm';
import { ChannelParticipantDialog } from '@/components/messenger/ChannelParticipantDialog';
import { GroupLeaveButton } from '@/components/messenger/GroupLeaveButton';
import { ChannelLeaveButton } from '@/components/messenger/ChannelLeaveButton';
import { Session } from 'next-auth';

export function ChannelHeader({
    session,
    channel,
    participants,
    group,
}: Readonly<{
    session: Session;
    channel: ChannelListResponse;
    participants: ChannelParticipantResponse[];
    group?: GroupResponse;
}>) {
    const inviteComponent = group ? (
        <GroupInviteForm groupId={group.groupId} />
    ) : (
        <DirectChannelInviteForm channelId={channel.channelId} />
    );

    const leaveComponent = group ? (
        <GroupLeaveButton session={session} groupId={group.groupId} />
    ) : (
        <ChannelLeaveButton session={session} channelId={channel.channelId} />
    );

    return (
        <header className="h-12 border-b border-border flex items-center px-4 justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
            <div className="flex items-center gap-2 overflow-hidden">
                <Hash className="w-5 h-5 text-muted-foreground flex-shrink-0" />
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
