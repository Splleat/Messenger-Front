import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';
import { Session } from 'next-auth';
import { fetchGroupList } from '@/lib/api-messenger';

export async function GroupSidebar({ session }: Readonly<{ session: Session }>) {
    const groups = await fetchGroupList(session);

    return (
        <aside className="w-18 h-full flex flex-col items-center py-3 bg-card border-r border-border shrink-0">
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href="/" className="mb-2">
                            <div className="w-12 h-12 bg-muted rounded-[24px] hover:rounded-[16px] transition-all flex items-center justify-center text-foreground font-bold hover:bg-primary hover:text-primary-foreground group">
                                <span className="group-hover:scale-110 transition-transform">
                                    DM
                                </span>
                            </div>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>개인 채널</p>
                    </TooltipContent>
                </Tooltip>

                <Separator className="w-8 h-0.5 bg-border rounded-full mb-2" />

                <ScrollArea className="flex-1 w-full">
                    <div className="flex flex-col items-center gap-3 px-2">
                        {groups.map((group) => (
                            <Tooltip key={group.groupId}>
                                <TooltipTrigger asChild>
                                    <Link href={`/chat/${group.groupId}`}>
                                        <Avatar className="w-12 h-12 cursor-pointer hover:rounded-[16px] transition-all border-border border group">
                                            <AvatarFallback className="bg-muted text-muted-foreground font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                {group.groupName[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>{group.groupName}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </ScrollArea>
            </TooltipProvider>
        </aside>
    );
}
