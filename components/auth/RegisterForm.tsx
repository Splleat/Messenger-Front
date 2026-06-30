'use client';

import { useActionState } from 'react';
import { registerAction } from '@/actions/auth/register.action';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
import { FormState } from '@/types/common';
import { registerSchema } from '@/schema/auth';
import { validateFormData } from '@/lib/form-validator';
import Link from 'next/link';

export default function RegisterForm() {
    const [state, action, isPending] = useActionState(
        async (_prev: FormState, data: FormData) => {
            const parsed = validateFormData(registerSchema, data);

            if (!parsed.success) {
                return parsed.state;
            }

            return await registerAction(data);
        },
        { error: null },
    );

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>회원가입</CardTitle>
                <CardDescription>
                    회원가입을 위한 카드 컴포넌트.
                </CardDescription>
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
                                />
                                <FieldDescription>
                                    이메일을 입력해주세요.
                                </FieldDescription>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="name">이름</FieldLabel>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="이름"
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
                                    name="password"
                                    type="password"
                                    placeholder="*****"
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
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? '회원가입 중...' : '회원가입'}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </FieldSet>
            </CardContent>
            <CardFooter className="justify-center">
                <Link
                    href="/auth/login"
                    className="text-primary hover:underline"
                >
                    로그인 페이지로 이동
                </Link>
            </CardFooter>
        </Card>
    );
}