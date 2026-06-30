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
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { spaceCreateAction } from '@/actions/messenger/space-create.action';
import { FormState } from '@/types/common';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useActionState, useState } from 'react';
import { validateFormData } from '@/lib/form-validator';
import { spaceCreateSchema } from '@/schema/messenger';

export function SpaceCreateForm() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [state, action, isPending] = useActionState(
        async (_prev: FormState, data: FormData) => {
            const parsed = validateFormData(spaceCreateSchema, data);

            if (!parsed.success) {
                return parsed.state;
            }

            const response = await spaceCreateAction(data);

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
            <DialogTrigger asChild>
                <Button variant="outline">+</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>그룹 생성</DialogTitle>
                </DialogHeader>
                <form action={action}>
                    <FieldGroup>
                        {state.error ? (
                            <FieldError errors={[{ message: state.error }]} />
                        ) : null}
                        <Field>
                            <Label htmlFor="spaceName">그룹명</Label>
                            <Input id="spaceName" name="spaceName" required />
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