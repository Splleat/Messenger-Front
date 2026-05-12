'use client'

import { useForm } from 'react-hook-form';
import { DirectChannelCreateActon } from '@/actions/messenger/DirectChannelCreateActon';
import { redirect } from 'next/navigation';
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

interface FormValues {
    channelName: string,
    type: 'TEXT' | never,
}

export function ChannelCreateForm() {
    const form = useForm<FormValues>({
        defaultValues: {
            channelName: '',
            type: 'TEXT',
        },
    });

    const onSubmit = async (data: FormValues) => {
        const result = await DirectChannelCreateActon(data);

        if (result.success) {
            redirect('/main');
        }
    };

    return (
        <Dialog>
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