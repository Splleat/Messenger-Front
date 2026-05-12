'use server'

import { ActionResponse, DirectChannelInviteRequest } from '@/types/common';
import { authenticatedFetch } from '@/lib/api-auth';
import { auth } from '@/auth';

export async function DirectChannelInviteAction(channelId: string, request: DirectChannelInviteRequest): Promise<ActionResponse> {
    const session = await auth();

    const response = await authenticatedFetch(
        session,
        `http://localhost:8080/channels/${channelId}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        }
    )

    if (!response.ok) {
        const error = await response.json();

        return { success: false, error: error };
    }

    return { success: true };
}