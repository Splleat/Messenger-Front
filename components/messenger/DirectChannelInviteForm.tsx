'use client';

import { DirectChannelInviteAction } from '@/actions/messenger/direct-channel-invite.action';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import { useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormState, UserSearchResult } from '@/types/common';
import { UserSearchInput } from '@/components/user/UserSearchInput';
import { FieldError } from '@/components/ui/field';

export function DirectChannelInviteForm({
    channelId,
}: Readonly<{ channelId: string }>) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<UserSearchResult | null>(null);
    const router = useRouter();

    const [state, action, isPending] = useActionState(
        async (_prev: FormState, data: FormData) => {
            if (!selected) return { error: '초대할 사용자를 선택해주세요.' };

            data.set('targetId', selected.userId);
            const response = await DirectChannelInviteAction(data, channelId);

            if (!response.error) {
                setOpen(false);
                setSelected(null);
                router.refresh();
            }

            return response;
        },
        { error: null },
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Plus className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>채널 초대</DialogTitle>
                </DialogHeader>
                <form action={action}>
                    {state.error && <FieldError errors={[{ message: state.error }]} />}
                    <UserSearchInput onSelect={setSelected} selected={selected} />
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline">취소</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isPending || !selected}>
                            {isPending ? '초대 중...' : '초대하기'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
