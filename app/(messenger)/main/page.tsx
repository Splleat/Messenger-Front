import { SpaceSidebar } from '@/components/messenger/space/SpaceSidebar';
import { ChannelSidebar } from '@/components/messenger/channel/ChannelSidebar';
import { ChannelHeader } from '@/components/messenger/channel/ChannelHeader';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ChannelChat } from '@/components/messenger/channel/ChannelChat';
import { SidebarProvider } from '@/components/ui/sidebar';
import {
    fetchChannelEnterMessages,
    fetchChannelList,
    fetchChannelParticipants,
    fetchSpace,
    fetchSpaceList,
} from '@/lib/api-messenger';
import { fetchMyProfile } from '@/lib/api-user';
import { unwrap } from '@/lib/http';
import { Session } from 'next-auth';
import type { ReactNode } from 'react';

// 선택된 스페이스가 있으면 해당 스페이스의 채널 목록, 없으면 개인 채널 목록 조회
async function resolveSpaceAndChannels(
    session: Session,
    selectedSpaceId?: string,
) {
    if (!selectedSpaceId) {
        const { data: channelList, error: channelListError } = unwrap(
            await fetchChannelList(session),
            [],
        );

        return {
            space: undefined,
            spaceError: false,
            channelList,
            channelListError,
        };
    }

    const { data: space, error: spaceError } = unwrap(
        await fetchSpace(session, selectedSpaceId),
        undefined,
    );

    return {
        space,
        spaceError,
        channelList: space?.channelList ?? [],
        channelListError: spaceError,
    };
}

export default async function MessengerMainPage({
    searchParams,
}: Readonly<{
    searchParams: Promise<{ channelId?: string; spaceId?: string }>;
}>) {
    const session = await auth();

    if (!session?.accessToken || session.error === 'RefreshTokenError') {
        redirect('/auth/login');
    }

    const params = await searchParams;
    const selectedSpaceId = params.spaceId;
    const selectedChannelId = params.channelId;

    const [spaceListResult, spaceAndChannels, myProfile] = await Promise.all([
        fetchSpaceList(session),
        resolveSpaceAndChannels(session, selectedSpaceId),
        fetchMyProfile(session),
    ]);

    const { data: spaceList, error: spaceListError } = unwrap(
        spaceListResult,
        [],
    );
    const { space: selectedSpace, channelList, channelListError } =
        spaceAndChannels;

    const selectedChannel = channelList.find(
        (channel) => channel.channelId === selectedChannelId,
    );

    let mainContent: ReactNode;

    if (!selectedChannelId || !selectedChannel) {
        mainContent = (
            <main className="flex flex-col flex-1 min-w-0 bg-background items-center justify-center text-muted-foreground">
                채널을 선택해주세요.
            </main>
        );
    } else {
        const [participants, messages] = await Promise.all([
            fetchChannelParticipants(session, selectedChannelId),
            fetchChannelEnterMessages(
                session,
                selectedChannelId,
                selectedSpaceId,
            ),
        ]);

        const { data: participantList } = unwrap(participants, []);

        mainContent = (
            <main className="flex flex-col flex-1 min-w-0 bg-background">
                <ChannelHeader
                    session={session}
                    channel={selectedChannel}
                    space={selectedSpace}
                    participants={participantList}
                />
                <ChannelChat
                    session={session}
                    channelId={selectedChannelId}
                    messageHistory={messages}
                />
            </main>
        );
    }

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden bg-background">
                <SpaceSidebar
                    session={session}
                    profile={myProfile}
                    spaceList={spaceList}
                    spaceListError={spaceListError}
                />
                <ChannelSidebar
                    session={session}
                    channelList={channelList}
                    channelListError={channelListError}
                    space={selectedSpace}
                />
                {mainContent}
            </div>
        </SidebarProvider>
    );
}
