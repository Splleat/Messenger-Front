'use server';

import { auth } from '@/auth';
import {
    ActionResponse,
    ApiErrorResponse,
    GroupCreateRequest,
} from '@/types/common';
import { authenticatedFetch } from '@/lib/api-auth';

export async function GroupCreateAction(
    request: GroupCreateRequest,
): Promise<ActionResponse> {
    const session = await auth();

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

        return { success: false, error: error };
    }

    return { success: true };
}