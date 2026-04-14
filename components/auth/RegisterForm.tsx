'use client'

import { RegisterFormValues, registerSchema } from '@/types/auth';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterAction } from '@/actions/auth/RegisterAction';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function RegisterForm() {
    const [error, setError] = useState<string | null>(null);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            name: '',
            password: '',
        },
    });

    const onSubmit = async (data: RegisterFormValues) => {
        const result = await RegisterAction(data);

        if (result?.error) {
            setError(result.error);
        }
    };

    return (
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle>회원가입</CardTitle>
                <CardDescription>회원가입을 위한 카드 컴포넌트.</CardDescription>
            </CardHeader>
            <CardContent>
                <FieldSet className="w-full max-w-xs">
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">이메일</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@example.com"
                                    {...form.register('email')}
                                />
                                <FieldDescription>
                                    이메일을 입력해주세요.
                                </FieldDescription>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="name">이름</FieldLabel>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="이름"
                                    {...form.register('name')}
                                />
                                <FieldDescription>
                                    이름을 입력해주세요.
                                </FieldDescription>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">
                                    비밀번호
                                </FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="*****"
                                    {...form.register('password')}
                                />
                                <FieldDescription>
                                    비밀번호를 입력해주세요.
                                </FieldDescription>
                            </Field>
                            <Field>
                                {error && (
                                    <p className="text-sm text-red-500">
                                        {error}
                                    </p>
                                )}
                                <Button type="submit">회원가입</Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </FieldSet>
            </CardContent>
        </Card>
    );
}