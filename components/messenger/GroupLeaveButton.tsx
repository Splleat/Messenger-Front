'use client'

import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { GroupLeaveAction } from '@/actions/messenger/GroupLeaveAction';

export function GroupLeaveButton({
    session,
    groupId,
}: Readonly<{ session: Session; groupId: string }>) {
    const router = useRouter();

    const onClick = async () => {
        const result = await GroupLeaveAction(session, groupId);

        if (result.success) {
            router.push('/main');
        }
    };

    return (
        <Button onClick={onClick} variant="ghost" size="icon">
            <LogOut className="h-5 w-5" />
        </Button>
    );
}