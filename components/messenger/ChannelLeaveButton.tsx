'use client'

import { ChannelLeaveAction } from '@/actions/messenger/ChannelLeaveAction';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function ChannelLeaveButton({ session, channelId }: Readonly<{ session: Session; channelId: string }>) {
    const router = useRouter();

    const onClick = async () => {
        const result = await ChannelLeaveAction(session, channelId);

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