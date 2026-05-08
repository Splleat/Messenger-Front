'use server';

import { RegisterFormValues, registerSchema } from '@/types/auth';
import {
    ActionResponse,
    ApiErrorResponse,
    createValidationError,
} from '@/types/common';

export async function RegisterAction(
    data: RegisterFormValues,
): Promise<ActionResponse> {
    const parsed = registerSchema.safeParse(data);

    if (!parsed.success) {
        return createValidationError('입력값이 올바르지 않습니다.');
    }

    const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error: ApiErrorResponse = await response.json();

        return { success: false, error: error };
    }

    return { success: true };
}