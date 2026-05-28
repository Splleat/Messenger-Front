'use server';

import { Session } from 'next-auth';
import { authenticatedFetch } from '@/lib/api-auth';
import { ApiErrorResponse, FormState } from '@/types/common';

export async function GroupLeaveAction(
    session: Session,
    groupId: string,
): Promise<FormState> {
    const response = await authenticatedFetch(
        session,
        `http://localhost:8080/groups/${groupId}`,
        {
            method: 'DELETE',
        },
    );

    if (!response.ok) {
        const error: ApiErrorResponse = await response.json();

        return { error: error.message };
    }

    return { error: null };
}