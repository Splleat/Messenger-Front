'use client'

import { useForm } from 'react-hook-form';
import { DirectChannelInviteAction } from '@/actions/messenger/DirectChannelInviteAction';
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
import { Field, FieldGroup } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FormValues {
    targetId: string;
}

export function DirectChannelInviteForm({
    channelId,
}: Readonly<{ channelId: string }>) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const form = useForm<FormValues>({
        defaultValues: {
            targetId: '',
        },
    });

    const onSubmit = async (data: FormValues) => {
        const targetIds = [data.targetId];
        const request = {
            targetIds: targetIds,
        };

        const result = await DirectChannelInviteAction(channelId, request);

        if (result.success) {
            router.refresh();
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Plus className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>채널 초대</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="groupName">사용자 아이디</Label>
                            <Input
                                id="target-id"
                                {...form.register('targetId')}
                            />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">취소</Button>
                        </DialogClose>
                        <Button type="submit">초대하기</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}