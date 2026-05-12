import * as React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, Hash, Settings } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Session } from 'next-auth';
import { ChannelCreateForm } from '@/components/messenger/ChannelCreateForm';
import Link from 'next/link';
import { ChannelListResponse, GroupResponse } from '@/types/common';

export async function ChannelSidebar({
    session,
    group,
    channelList,
}: Readonly<{ session: Session; group?: GroupResponse; channelList: ChannelListResponse[] }>) {
    const title = group ? group.groupName : '개인 채널';

    return (
        <aside className="w-60 h-full flex flex-col bg-secondary/30 border-r border-border shrink-0">
            <header className="h-12 border-b border-border flex items-center px-4 justify-between hover:bg-accent/50 cursor-pointer transition-colors shadow-sm">
                <span className="font-bold text-sm text-foreground truncate">
                    {title}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </header>

            <ScrollArea className="flex-1">
                <div className="p-3 space-y-4">
                    <div>
                        <div className="flex items-center justify-between px-1 mb-1 group">
                            <span className="text-[11px] font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                                텍스트 채널
                            </span>
                            <ChannelCreateForm groupId={group?.groupId} />
                        </div>

                        <div className="space-y-0.5">
                            {channelList.map((channel) => (
                                <div
                                    key={channel.channelId}
                                    className="group flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:bg-accent hover:text-accent-foreground px-2 py-1.5 rounded-md transition-all"
                                >
                                    <Hash className="w-4 h-4 text-muted-foreground group-hover:text-accent-foreground" />
                                    <span className="truncate font-medium">
                                        <Link
                                            href={group ? `/main?groupId=${group.groupId}&channelId=${channel.channelId}` : `/main?channelId=${channel.channelId}`}
                                        >
                                            {channel.channelName}
                                        </Link>
                                    </span>
                                </div>
                            ))}

                            {channelList.length === 0 && (
                                <div className="text-xs text-muted-foreground/60 px-2 py-4 text-center italic">
                                    채널이 없습니다.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </ScrollArea>

            <footer className="p-2 bg-secondary/50 flex items-center gap-2 border-t border-border mt-auto">
                <Avatar className="w-8 h-8 rounded-full border border-border">
                    <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-bold">
                        ME
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-bold text-foreground truncate">
                        {session?.user?.username}
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate leading-none">
                        Online
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <div className="p-1.5 hover:bg-accent rounded-md transition-colors cursor-pointer">
                        <Settings className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </div>
                </div>
            </footer>
        </aside>
    );
}
