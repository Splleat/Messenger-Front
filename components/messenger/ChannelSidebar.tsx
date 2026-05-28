'use client';

import * as React from 'react';
import { ChevronDown, Hash, Plus, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Session } from 'next-auth';
import { ChannelCreateDialog } from '@/components/messenger/ChannelCreateDialog';
import Link from 'next/link';
import { ChannelListResponse, GroupResponse } from '@/types/common';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { GroupInviteDialog } from '@/components/messenger/GroupInviteDialog';
import { GroupLeaveDialog } from '@/components/messenger/GroupLeaveDialog';
import LogoutButton from '@/components/auth/LogoutButton';

export function ChannelSidebar({
    session,
    group,
    channelList,
}: Readonly<{ session: Session; group?: GroupResponse; channelList: ChannelListResponse[] }>) {
    const title = group ? group.groupName : '개인 채널';

    return (
        <Sidebar
            collapsible="none"
            className="bg-secondary/30 border-r border-border"
        >
            <SidebarHeader className="p-0 border-b border-border">
                {group ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="h-12 w-full flex items-center px-4 justify-between hover:bg-accent/50 cursor-pointer transition-colors shadow-sm outline-none">
                                <span className="font-bold text-sm text-foreground truncate">
                                    {title}
                                </span>
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-52" align="start">
                            <GroupInviteDialog
                                groupId={group.groupId}
                                trigger={
                                    <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                        className="cursor-pointer gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>그룹 초대하기</span>
                                    </DropdownMenuItem>
                                }
                            />
                            <DropdownMenuSeparator />
                            <GroupLeaveDialog
                                session={session}
                                groupId={group.groupId}
                                trigger={
                                    <DropdownMenuItem
                                        variant="destructive"
                                        className="cursor-pointer gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>그룹 탈퇴하기</span>
                                    </DropdownMenuItem>
                                }
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="h-12 flex items-center px-4 shadow-sm">
                        <span className="font-bold text-sm text-foreground truncate">
                            {title}
                        </span>
                    </div>
                )}
            </SidebarHeader>

            <SidebarContent className="p-3">
                <SidebarGroup className="p-0">
                    <div className="flex items-center justify-between mb-1 group pr-1">
                        <SidebarGroupLabel className="font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider p-0 h-auto">
                            텍스트 채널
                        </SidebarGroupLabel>
                        <ChannelCreateDialog
                            groupId={group?.groupId}
                            trigger={
                                <Plus className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                            }
                        />
                    </div>

                    <SidebarGroupContent>
                        <SidebarMenu className="gap-0.5">
                            {channelList.map((channel) => (
                                <SidebarMenuItem
                                    key={channel.channelId}
                                    className="flex items-center"
                                >
                                    <SidebarMenuButton asChild className="h-8">
                                        <Link
                                            href={
                                                group
                                                    ? `/main?groupId=${group.groupId}&channelId=${channel.channelId}`
                                                    : `/main?channelId=${channel.channelId}`
                                            }
                                            className="flex items-center gap-2"
                                        >
                                            <Hash className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-medium truncate">
                                                {channel.channelName}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                    {channel.hasUnread && (
                                        <SidebarMenuBadge className="right-2">
                                            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                                        </SidebarMenuBadge>
                                    )}
                                </SidebarMenuItem>
                            ))}

                            {channelList.length === 0 && (
                                <div className="text-xs text-muted-foreground/60 py-4 text-center italic">
                                    채널이 없습니다.
                                </div>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-2 bg-secondary/50 border-t border-border">
                <div className="flex items-center gap-2 w-full">
                    <Avatar className="w-8 h-8 rounded-full border border-border">
                        <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-bold">
                            {session?.user?.username?.[0]?.toUpperCase() ||
                                'ME'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-bold text-foreground truncate">
                            {session?.user?.username}
                        </div>
                    </div>
                    <LogoutButton />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
