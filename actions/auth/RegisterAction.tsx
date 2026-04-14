'use server'

import { RegisterFormValues, registerSchema } from '@/types/auth';
import { ApiErrorResponse } from '@/types/common';
import { redirect } from 'next/navigation';

export async function RegisterAction(data: RegisterFormValues) {
    const parsed = registerSchema.safeParse(data);

    if (!parsed.success) {
        return { error: '입력값이 올바르지 않습니다.' };
    }

    const response = await fetch('http://localhost:8080/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const { message } = await response.json() as ApiErrorResponse;

        return { error: message };
    }

    redirect('/api/auth/login')
}