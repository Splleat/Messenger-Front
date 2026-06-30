'use server'
import { API_BASE_URL } from '@/lib/config';

import { authenticatedFetch } from '@/lib/http';
import { Session } from 'next-auth';
import { ActionResponse, ApiErrorResponse } from '@/types/common';

export async function channelLeaveAction(session: Session, channelId: string): Promise<ActionResponse> {
    const response = await authenticatedFetch(
        session,
        `${API_BASE_URL}/channels/${channelId}`, {
            method: 'DELETE'
        },
    );

    if (!response.ok) {
        const error: ApiErrorResponse = await response.json();

        return { success: false, error: error };
    }

    return { success: true };
}
