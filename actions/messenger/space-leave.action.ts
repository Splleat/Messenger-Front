'use server';
import { API_BASE_URL } from '@/lib/config';

import { Session } from 'next-auth';
import { authenticatedFetch } from '@/lib/api-auth';
import { ApiErrorResponse, FormState } from '@/types/common';

export async function SpaceLeaveAction(
    session: Session,
    spaceId: string,
): Promise<FormState> {
    const response = await authenticatedFetch(
        session,
        `${API_BASE_URL}/spaces/${spaceId}`,
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