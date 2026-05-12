'use server'

import { Session } from 'next-auth';
import { authenticatedFetch } from '@/lib/api-auth';
import { ActionResponse, ApiErrorResponse } from '@/types/common';

export async function GroupLeaveAction(session: Session, groupId: string): Promise<ActionResponse> {
    const response = await authenticatedFetch(
        session,
        `http://localhost:8080/groups/${groupId}`, {
            method: 'DELETE'
        },
    );

    if (!response.ok) {
        const error: ApiErrorResponse = await response.json();

        return { success: false, error };
    }

    return { success: true };
}