'use server';

import { signIn } from '@/auth';
import { FormState } from '@/types/common';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { loginSchema } from '@/schema/auth';
import { validateFormData } from '@/lib/form-validator';

export async function LoginAction(data: FormData): Promise<FormState> {
    const validation = validateFormData(loginSchema, data);

    if (!validation.success) {
        return validation.state;
    }

    try {
        await signIn('credentials', {
            email: validation.data.email,
            password: validation.data.password,
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