'use client';

import { useForm } from 'react-hook-form';
import { ChannelCreateAction } from '@/actions/messenger/ChannelCreateAction';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FormValues {
    channelName: string;
    type: 'TEXT' | never;
}

export function ChannelCreateForm({ groupId }: Readonly<{ groupId?: string }>) {
    const [open, setOpen] = useState(false);

    const router = useRouter();

    const form = useForm<FormValues>({
        defaultValues: {
            channelName: '',
            type: 'TEXT',
        },
    });

    const onSubmit = async (data: FormValues) => {
        const result = await ChannelCreateAction(data, groupId);

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
                    <DialogTitle>채널 생성</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="groupName">채널명</Label>
                            <Input
                                id="groupName"
                                {...form.register('channelName')}
                            />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">취소</Button>
                        </DialogClose>
                        <Button type="submit">생성하기</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}