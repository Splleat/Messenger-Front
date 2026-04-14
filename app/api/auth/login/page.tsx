'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from '@/components/ui/card';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from "@/components/ui/input";
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';

const loginSchema = z.object({
    email: z.email('올바른 이메일을 입력하세요'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = async (value: LoginFormValues) => {
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(value),
        });

        if (!response.ok) {
            return { error: '이메일 또는 비밀번호가 올바르지 않습니다. ' }
        }

        const data = await response.json();

        console.log(`로그인 성공: ${data}`)
    };

    return (
        <Card className="w-full sm:max-w-md">
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
                                <Button type="submit">로그인</Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </FieldSet>
            </CardContent>
        </Card>
    );
}
