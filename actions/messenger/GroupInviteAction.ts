'use server'

import {
    ActionResponse,
    ApiErrorResponse,
    GroupInviteRequest,
} from '@/types/common';
import { authenticatedFetch } from '@/lib/api-auth';
import { auth } from '@/auth';

export async function GroupInviteAction(
    groupId: string,
    request : GroupInviteRequest
): Promise<ActionResponse> {
    const session = await auth();

    const response = await authenticatedFetch(
        session,
        `http://localhost:8080/groups/${groupId}`, {
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