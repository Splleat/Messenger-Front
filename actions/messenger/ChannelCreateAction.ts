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
    groupId?: string,
): Promise<ActionResponse> {
    const session = await auth();

    const url = groupId
        ? `http://localhost:8080/groups/${groupId}/channels`
        : 'http://localhost:8080/channels';

    const response = await authenticatedFetch(session, url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error: ApiErrorResponse = await response.json();

        return { success: false, error: error };
    }

    return { success: true };
}