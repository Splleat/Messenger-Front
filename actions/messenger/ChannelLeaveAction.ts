'use server'

import { authenticatedFetch } from '@/lib/api-auth';
import { Session } from 'next-auth';
import { ActionResponse, ApiErrorResponse } from '@/types/common';

export async function ChannelLeaveAction(session: Session, channelId: string): Promise<ActionResponse> {
    const response = await authenticatedFetch(
        session,
        `http://localhost:8080/channels/${channelId}`, {
            method: 'DELETE'
        },
    );

    if (!response.ok) {
        const error: ApiErrorResponse = await response.json();

        return { success: false, error: error };
    }

    return { success: true };
}