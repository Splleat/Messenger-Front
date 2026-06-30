'use client';

import { ChannelCreateAction } from '@/actions/messenger/channel-create.action';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import * as React from 'react';
import { useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormState } from '@/types/common';
import { validateFormData } from '@/lib/form-validator';
import { channelCreateSchema } from '@/schema/messenger';

export function ChannelCreateDialog({
    spaceId,
    trigger,
}: Readonly<{ spaceId?: string; trigger: React.ReactNode }>) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [state, action, isPending] = useActionState(
        async (_prev: FormState, data: FormData) => {
            const parsed = validateFormData(channelCreateSchema, data);

            if (!parsed.success) {
                return parsed.state;
            }

            const response = await ChannelCreateAction(data, spaceId);

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
                    <DialogTitle>채널 생성</DialogTitle>
                </DialogHeader>
                <DialogDescription>채널 이름을 입력해주세요.</DialogDescription>
                <form action={action}>
                    <FieldGroup>
                        {state.error ? (
                            <FieldError errors={[{ message: state.error }]} />
                        ) : null}
                        <Field>
                            <Label htmlFor="channelName">채널명</Label>
                            <Input
                                id="channelName"
                                name="channelName"
                                required
                            />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">취소</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? '생성 중...' : '생성하기'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}