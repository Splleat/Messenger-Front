'use server';
import { API_BASE_URL } from '@/lib/config';

import { auth } from '@/auth';
import { ApiErrorResponse, FormState } from '@/types/common';
import { SpaceCreateRequest } from '@/types/messenger';
import { authenticatedFetch } from '@/lib/api-auth';
import { validateFormData } from '@/lib/form-validator';
import { spaceCreateSchema } from '@/schema/messenger';

export async function SpaceCreateAction(data: FormData): Promise<FormState> {
    const session = await auth();

    const validation = validateFormData(spaceCreateSchema, data);

    if (!validation.success) {
        return validation.state;
    }

    const request: SpaceCreateRequest = validation.data;

    const response = await authenticatedFetch(
        session,
        `${API_BASE_URL}/spaces`,
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