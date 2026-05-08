import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Session } from 'next-auth';
import { fetchGroupList } from '@/lib/api-messenger';
import { GroupIcon } from '@/components/messenger/GroupIcon';
import { GroupCreateForm } from '@/components/messenger/GroupCreateForm';

export async function GroupSidebar({
    session,
}: Readonly<{ session: Session }>) {
    const groups = await fetchGroupList(session);

    return (
        <aside className="w-18 h-full flex flex-col items-center py-3 bg-card border-r border-border shrink-0">
            <TooltipProvider delayDuration={0}>
                <GroupIcon link={'/'} name="개인 채널" />

                <Separator className="w-8 h-0.5 bg-border rounded-full mb-2" />

                <div className="flex flex-col items-center gap-3 px-2">
                    <GroupCreateForm />
                </div>

                <ScrollArea className="flex-1 w-full">
                    <div className="flex flex-col items-center gap-3 px-2">
                        {groups.map((group) => (
                            <GroupIcon
                                key={group.groupId}
                                link={`/groups/${group.groupId}`}
                                name={group.groupName}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </TooltipProvider>
        </aside>
    );
}
