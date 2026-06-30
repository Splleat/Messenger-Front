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

export default async function MessengerMainPage({
    searchParams,
}: Readonly<{
    searchParams: Promise<{ channelId?: string, spaceId?: string }>;
}>) {
    const session = await auth();

    if (!session?.accessToken || session.error === 'RefreshTokenError') {
        redirect('/auth/login');
    }

    const params = await searchParams;
    const selectedSpaceId = params.spaceId;
    const selectedChannelId = params.channelId;

    const [spaceList, selectedSpace] = await Promise.all([
        fetchSpaceList(session),
        selectedSpaceId ? fetchSpace(session, selectedSpaceId) : Promise.resolve(undefined)
    ]);

    const channelList = selectedSpace
        ? selectedSpace.channelList
        : await fetchChannelList(session);

    const selectedChannel = channelList.find(
        (channel) => channel.channelId === selectedChannelId,
    );

    if (!selectedChannelId || !selectedChannel) {
        return (
            <SidebarProvider>
                <div className="flex h-screen w-full overflow-hidden bg-background">
                    <SpaceSidebar spaceList={spaceList} />
                    <ChannelSidebar
                        session={session}
                        channelList={channelList}
                        space={selectedSpace}
                    />
                    <main className="flex flex-col flex-1 min-w-0 bg-background items-center justify-center text-muted-foreground">
                        채널을 선택해주세요.
                    </main>
                </div>
            </SidebarProvider>
        );
    }

    const [participants, messages] = await Promise.all([
        fetchChannelParticipants(session, selectedChannelId),
        fetchChannelEnterMessages(session, selectedChannelId, selectedSpaceId),
    ])

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden bg-background">
                <SpaceSidebar spaceList={spaceList} />
                <ChannelSidebar
                    session={session}
                    channelList={channelList}
                    space={selectedSpace}
                />

                <main className="flex flex-col flex-1 min-w-0 bg-background">
                    <ChannelHeader
                        session={session}
                        channel={selectedChannel}
                        space={selectedSpace}
                        participants={participants}
                    />
                    <ChannelChat
                        session={session}
                        channelId={selectedChannelId}
                        accessToken={session.accessToken}
                        messageHistory={messages}
                    />
                </main>
            </div>
        </SidebarProvider>
    );
}
