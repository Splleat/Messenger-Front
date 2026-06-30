'use client';

import {
    Card,
    CardContent,
    CardDescription, CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useActionState } from 'react';
import { loginAction } from '@/actions/auth/login.action';
import { FormState } from '@/types/common';
import { loginSchema } from '@/schema/auth';
import { validateFormData } from '@/lib/form-validator';
import Link from "next/link";

export default function LoginForm() {
    const [state, action, isPending] = useActionState(async (_prev: FormState, data: FormData) => {
        const parsed = validateFormData(loginSchema, data);

        if (!parsed.success) {
            return parsed.state;
        }

        return await loginAction(data);
    }, { error: null });

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>로그인</CardTitle>
                <CardDescription>로그인을 위한 카드 컴포넌트.</CardDescription>
            </CardHeader>
            <CardContent>
                <FieldSet className="w-full max-w-xs">
                    <form action={action}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">이메일</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="example@example.com"
                                    required
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
                                    name="password"
                                    type="password"
                                    placeholder="*****"
                                    required
                                />
                                <FieldDescription>
                                    비밀번호를 입력해주세요.
                                </FieldDescription>
                            </Field>
                            {state.error ? (
                                <FieldError
                                    errors={[{ message: state.error }]}
                                />
                            ) : null}
                            <Field>
                                <Button type="submit" disabled={isPending} className="w-full">
                                    {isPending ? '로그인 중...' : '로그인'}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </FieldSet>
            </CardContent>
            <CardFooter className="justify-center">
                <Link href="/auth/register" className="text-primary hover:underline">회원가입 페이지로 이동</Link>
            </CardFooter>
        </Card>
    );
}
