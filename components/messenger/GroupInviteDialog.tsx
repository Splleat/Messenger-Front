'use client';

import { GroupInviteAction } from '@/actions/messenger/GroupInviteAction';
import * as React from 'react';
import { useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormState } from '@/types/common';
import { validateFormData } from '@/lib/form-validator';
import { inviteSchema } from '@/schema/messenger';

export function GroupInviteDialog({
    groupId,
    trigger,
}: Readonly<{ groupId: string; trigger: React.ReactNode }>) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [state, action, isPending] = useActionState(
        async (_prev: FormState, data: FormData) => {
            const parsed = validateFormData(inviteSchema, data);

            if (!parsed.success) {
                return parsed.state;
            }

            const response = await GroupInviteAction(data, groupId);

            if (!response.error) {
                setOpen(false);
                router.refresh();
            }

            return response;
        },
        { error: null },
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>그룹 초대</DialogTitle>
                </DialogHeader>
                <form action={action}>
                    <FieldGroup>
                        {state.error ? (
                            <FieldError errors={[{ message: state.error }]} />
                        ) : null}
                        <Field>
                            <Label htmlFor="groupName">사용자 아이디</Label>
                            <Input id="targetId" name="targetId" required />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">취소</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? '초대 중...' : '초대하기'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}