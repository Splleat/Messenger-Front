'use server'

import {
    ActionResponse,
    ApiErrorResponse,
    ChannelCreateRequest,
} from '@/types/common';
import { authenticatedFetch } from '@/lib/api-auth';
import { auth } from '@/auth';

export async function ChannelCreateAction(
    request: ChannelCreateRequest,
): Promise<ActionResponse> {
    const session = await auth();

    const response = await authenticatedFetch(
        session,
        'http://localhost:8080/channels',
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