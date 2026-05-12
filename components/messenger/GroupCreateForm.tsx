'use client';

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
import { useForm } from 'react-hook-form';
import { GroupCreateAction } from '@/actions/messenger/GroupCreateAction';
import { GroupCreateFormValues, groupCreateSchema } from '@/types/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function GroupCreateForm() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const form = useForm<GroupCreateFormValues>({
        resolver: zodResolver(groupCreateSchema),
        defaultValues: {
            groupName: '',
            nickname: '',
        },
    });

    const onSubmit = async (data: GroupCreateFormValues) => {
        const result = await GroupCreateAction({
            groupName: data.groupName,
            nickname: data.nickname,
        });

        if (result.success) {
            router.refresh();
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">+</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>그룹 생성</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="groupName">그룹명</Label>
                            <Input
                                id="groupName"
                                {...form.register('groupName')}
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="nickname">닉네임</Label>
                            <Input
                                id="nickname"
                                {...form.register('nickname')}
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