import { GroupSidebar } from '@/components/messenger/GroupSidebar';
import { ChannelSidebar } from '@/components/messenger/ChannelSidebar';
import { ChannelHeader } from '@/components/messenger/ChannelHeader';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ChannelChat } from '@/components/messenger/ChannelChat';
import { SidebarProvider } from '@/components/ui/sidebar';
import {
    fetchChannelEnterMessages,
    fetchChannelList,
    fetchChannelParticipants,
    fetchGroup,
    fetchGroupList,
} from '@/lib/api-messenger';

export default async function MessengerMainPage({
    searchParams,
}: Readonly<{
    searchParams: Promise<{ channelId?: string, groupId?: string }>;
}>) {
    const session = await auth();

    if (!session?.accessToken) {
        redirect('/auth/login');
    }

    const params = await searchParams;
    const selectedGroupId = params.groupId;
    const selectedChannelId = params.channelId;
    const groupList = await fetchGroupList(session);
    const selectedGroup = (selectedGroupId) ?
        await fetchGroup(session, selectedGroupId) : undefined;
    const channelList = (selectedGroup) ?
        selectedGroup.channelList : await fetchChannelList(session);
    const selectedChannel = channelList.find(
        (channel) => channel.channelId === selectedChannelId,
    );


    if (!selectedChannelId || !selectedChannel) {
        return (
            <SidebarProvider>
                <div className="flex h-screen w-full overflow-hidden bg-background">
                    <GroupSidebar groupList={groupList} />
                    <ChannelSidebar
                        session={session}
                        channelList={channelList}
                        group={selectedGroup}
                    />
                    <main className="flex flex-col flex-1 min-w-0 bg-background items-center justify-center text-muted-foreground">
                        채널을 선택해주세요.
                    </main>
                </div>
            </SidebarProvider>
        );
    }

    const participants = await fetchChannelParticipants(session, selectedChannelId);

    const messages = await fetchChannelEnterMessages(session, selectedChannelId, selectedGroupId);

    console.log(messages);

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden bg-background">
                <GroupSidebar groupList={groupList} />
                <ChannelSidebar
                    session={session}
                    channelList={channelList}
                    group={selectedGroup}
                />

                <main className="flex flex-col flex-1 min-w-0 bg-background">
                    <ChannelHeader
                        session={session}
                        channel={selectedChannel}
                        group={selectedGroup}
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
