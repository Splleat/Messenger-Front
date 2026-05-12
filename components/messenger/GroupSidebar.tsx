import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { GroupIcon } from '@/components/messenger/GroupIcon';
import { GroupCreateForm } from '@/components/messenger/GroupCreateForm';
import { GroupListResponse } from '@/types/common';

export async function GroupSidebar({
    groupList,
}: Readonly<{ groupList: GroupListResponse[] }>) {
    return (
        <aside className="w-18 h-full flex flex-col items-center py-3 bg-card border-r border-border shrink-0">
            <TooltipProvider delayDuration={0}>
                <GroupIcon link={'/main'} name="개인 채널" />

                <Separator className="w-8 h-0.5 bg-border rounded-full mb-2" />

                <ScrollArea className="flex-1 w-full">
                    <div className="flex flex-col items-center gap-3 px-2">
                        {groupList.map((group) => (
                            <GroupIcon
                                key={group.groupId}
                                link={`/main?groupId=${group.groupId}`}
                                name={group.groupName}
                            />
                        ))}
                        <GroupCreateForm />
                    </div>
                </ScrollArea>
            </TooltipProvider>
        </aside>
    );
}
