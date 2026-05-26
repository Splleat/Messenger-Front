'use server';

import { auth } from '@/auth';
import {
    ApiErrorResponse,
    FormState,
    GroupCreateRequest,
} from '@/types/common';
import { authenticatedFetch } from '@/lib/api-auth';
import { validateFormData } from '@/lib/form-validator';
import { groupCreateSchema } from '@/schema/messenger';

export async function GroupCreateAction(data: FormData): Promise<FormState> {
    const session = await auth();

    const validation = validateFormData(groupCreateSchema, data);

    if (!validation.success) {
        return validation.state;
    }

    const request: GroupCreateRequest = validation.data;

    const response = await authenticatedFetch(
        session,
        'http://localhost:8080/groups',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        },
    );

    if (!response.ok) {
        const error: ApiErrorResponse = await response.json();

        return { error: error.message };
    }

    return { error: null };
}