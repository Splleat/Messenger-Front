import { GroupSidebar } from '@/components/messenger/GroupSidebar';
import { ChannelSidebar } from '@/components/messenger/ChannelSidebar';
import { ChannelHeader } from '@/components/messenger/ChannelHeader';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ChannelChat } from '@/components/messenger/ChannelChat';
import { fetchMessageList } from '@/lib/api-messenger';

export default async function MessengerMainPage({
    searchParams,
}: Readonly<{
    searchParams: Promise<{ channelId?: string }>;
}>) {
    const session = await auth();

    if (!session?.accessToken) {
        redirect('/auth/login');
    }

    const params = await searchParams;
    const selectedChannelId = params.channelId;

    if (!selectedChannelId) {
        return (
            <div className="flex h-screen w-full overflow-hidden bg-background">
                <GroupSidebar session={session} />
                <ChannelSidebar session={session} />
                <main className="flex flex-col flex-1 min-w-0 bg-background items-center justify-center text-muted-foreground">
                    채널을 선택해주세요.
                </main>
            </div>
        );
    }

    const messages = await fetchMessageList(session, selectedChannelId);

    console.log("[ChannelPage] ", messages);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background">
            <GroupSidebar session={session} />
            <ChannelSidebar session={session} />

            <main className="flex flex-col flex-1 min-w-0 bg-background">
                <ChannelHeader name="일반 채팅방" />
                <ChannelChat
                    channelId={selectedChannelId}
                    accessToken={session.accessToken}
                    messageHistory={messages}
                />
            </main>
        </div>
    );
}
