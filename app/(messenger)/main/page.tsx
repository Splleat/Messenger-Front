import { GroupSidebar } from "@/components/messenger/GroupSidebar";
import { ChannelSidebar } from "@/components/messenger/ChannelSidebar";
import { ChannelHeader } from "@/components/messenger/ChannelHeader";
import { MessageItem } from "@/components/messenger/MessageItem";
import { ChannelChatInput } from "@/components/messenger/ChannelChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function MessengerMainPage() {
    const session = await auth();

    if (!session) {
        redirect('/auth/login');
    }

    // 샘플 데이터
    const dummyMessages = [
    { id: 1, username: "User1", content: "안녕하세요.", createdAt: new Date() },
    { id: 2, username: "User2", content: "네 안녕하세요.", createdAt: new Date() },
    { id: 3, username: "User3", content: "반갑습니다.", createdAt: new Date() },
    { id: 4, username: "User4", content: "네 반갑습니다.", createdAt: new Date() },
    ];

    return (
      <div className="flex h-screen w-full overflow-hidden bg-background">
          <GroupSidebar session={session} />
          <ChannelSidebar session={session} />

          <main className="flex flex-col flex-1 min-w-0 bg-background">
              <ChannelHeader name="일반 채팅방" />

              <ScrollArea className="flex-1">
                  <div className="flex flex-col pb-4">
                      {dummyMessages.map((msg) => (
                          <MessageItem
                              key={msg.id}
                              username={msg.username}
                              content={msg.content}
                              createdAt={msg.createdAt}
                              userId={0}
                              channelId={0}
                              profileUrl={''}
                              type={''}
                              parentMessageId={0}
                          />
                      ))}
                  </div>
              </ScrollArea>

              <ChannelChatInput placeholder="#일반 에 메시지 보내기" />
          </main>
      </div>
    );
}
