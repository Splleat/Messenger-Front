import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SpaceIcon } from '@/components/messenger/space/SpaceIcon';
import { SpaceCreateForm } from '@/components/messenger/space/SpaceCreateForm';
import { SpaceListResponse } from '@/types/messenger';

export async function SpaceSidebar({
    spaceList,
}: Readonly<{ spaceList: SpaceListResponse[] }>) {
    return (
        <aside className="w-18 h-full flex flex-col items-center py-3 bg-card border-r border-border shrink-0">
            <TooltipProvider delayDuration={0}>
                <SpaceIcon link={'/main'} name="개인 채널" />

                <Separator className="w-8 h-0.5 bg-border rounded-full mb-2" />

                <ScrollArea className="flex-1 w-full">
                    <div className="flex flex-col items-center gap-3 px-2">
                        {spaceList.map((space) => (
                            <SpaceIcon
                                key={space.spaceId}
                                link={`/main?spaceId=${space.spaceId}`}
                                name={space.spaceName}
                            />
                        ))}
                        <SpaceCreateForm />
                    </div>
                </ScrollArea>
            </TooltipProvider>
        </aside>
    );
}
