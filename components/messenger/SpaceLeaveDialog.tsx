'use client';

import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SpaceLeaveAction } from '@/actions/messenger/SpaceLeaveAction';
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader, DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useActionState, useState } from 'react';
import { FieldError, FieldGroup } from '@/components/ui/field';
import * as React from 'react';

export function SpaceLeaveDialog({
    session,
    spaceId,
    trigger,
}: Readonly<{ session: Session; spaceId: string; trigger: React.ReactNode }>) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [state, action, isPending] = useActionState(async () => {
        const response = await SpaceLeaveAction(session, spaceId);

        if (!response.error) {
            setOpen(false);
            router.refresh();
        }

        return response;
    }, null);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>그룹 탈퇴</DialogTitle>
                </DialogHeader>
                <DialogDescription>그룹을 탈퇴하시겠습니까?</DialogDescription>
                <form action={action}>
                    <FieldGroup>
                        {state?.error ? (
                            <FieldError
                                errors={[{ message: state.error }]}
                            ></FieldError>
                        ) : null}
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">취소</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={isPending}
                        >
                            {isPending ? '그룹 탈퇴 중...' : '그룹 탈퇴'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}