'use server';

import { registerSchema } from '@/types/auth';
import { ApiErrorResponse, FormState } from '@/types/common';
import { redirect } from 'next/navigation';

export async function RegisterAction(
    data: FormData,
): Promise<FormState> {
    const parsed = registerSchema.safeParse({
        email: data.get('email'),
        name: data.get('name'),
        password: data.get('password'),
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
    });

    if (!response.ok) {
        const error: ApiErrorResponse = await response.json();

        return { error: error.message };
    }

    redirect('/auth/login');
}