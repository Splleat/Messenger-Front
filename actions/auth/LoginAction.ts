'use server';

import { loginSchema } from '@/types/auth';
import { signIn } from '@/auth';
import { FormState } from '@/types/common';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export async function LoginAction(
    _prev: FormState,
    data: FormData,
): Promise<FormState> {
    const parsed = loginSchema.safeParse({
        email: data.get('email'),
        password: data.get('password'),
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    try {
        await signIn('credentials', {
            email: parsed.data.email,
            password: parsed.data.password,
            redirect: false,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: error.message };
        }

        return { error: '로그인 중 오류가 발생했습니다.' };
    }

    redirect('/');
}