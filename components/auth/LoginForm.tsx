'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { LoginFormValues, loginSchema } from '@/types/auth';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function LoginForm() {
    const [error, setError] = useState<string | null>(null);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false
        });

        if (result?.error) {
            setError(result.error);
        } else {
            redirect('/');
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>로그인</CardTitle>
                <CardDescription>로그인을 위한 카드 컴포넌트.</CardDescription>
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
                                <Button type="submit">로그인</Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </FieldSet>
            </CardContent>
        </Card>
    );
}
