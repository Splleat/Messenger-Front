'use server';

import { API_BASE_URL } from '@/lib/config';

import { ApiErrorResponse, FormState } from '@/types/common';
import { redirect } from 'next/navigation';
import { registerSchema } from '@/schema/auth';
import { validateFormData } from '@/lib/form-validator';
import { RegisterRequest } from '@/types/auth';

export async function registerAction(
    data: FormData,
): Promise<FormState> {
    const validation = validateFormData(registerSchema, data);

    if (!validation.success) {
        return validation.state;
    }

    const request: RegisterRequest = validation.data;

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error: ApiErrorResponse = await response.json();

        return { error: error.message };
    }

    redirect('/auth/login');
}