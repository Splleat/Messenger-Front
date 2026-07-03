import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SpaceCreateForm } from '@/components/messenger/space/SpaceCreateForm';
import { SpaceListResponse } from '@/types/messenger';
import { UserProfileButton } from '@/components/user/UserProfileButton';
import { Session } from 'next-auth';
import { MyProfileResponse } from '@/types/profile';
import { Sidebar } from '@/components/ui/sidebar';
import { SpaceNavItem } from '@/components/messenger/space/SpaceNavItem';
import { SpaceListErrorIndicator } from '@/components/messenger/space/SpaceListErrorIndicator';

export async function SpaceSidebar({
    session,
    profile,
    spaceList,
    spaceListError,
}: Readonly<{
    session: Session;
    profile: MyProfileResponse | null;
    spaceList: SpaceListResponse[];
    spaceListError?: boolean;
}>) {
    return (
        <Sidebar
            collapsible="none"
            className="relative z-20 w-18 h-full flex flex-col items-center py-3 bg-card border-r border-border shrink-0"
        >
            <TooltipProvider delayDuration={0}>
                <SpaceNavItem link={'/main'} name="개인 채널" />

                <Separator className="w-8 h-0.5 bg-border rounded-full mb-2" />

                <ScrollArea className="flex-1 w-full">
                    <div className="flex flex-col items-center gap-3 px-2">
                        {spaceListError ? (
                            <SpaceListErrorIndicator />
                        ) : (
                            spaceList.map((space) => (
                                <SpaceNavItem
                                    key={space.spaceId}
                                    link={`/main?spaceId=${space.spaceId}`}
                                    name={space.spaceName}
                                />
                            ))
                        )}
                        <SpaceCreateForm />
                    </div>
                </ScrollArea>
                <UserProfileButton session={session} profile={profile} />
            </TooltipProvider>
        </Sidebar>
    );
}
