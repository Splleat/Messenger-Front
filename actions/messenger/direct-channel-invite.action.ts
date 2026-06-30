'use server';
import { API_BASE_URL } from '@/lib/config';

import { ApiErrorResponse, FormState } from '@/types/common';
import { DirectChannelInviteRequest } from '@/types/messenger';
import { authenticatedFetch } from '@/lib/http';
import { auth } from '@/auth';
import { validateFormData } from '@/lib/form-validator';
import { inviteSchema } from '@/schema/messenger';

export async function DirectChannelInviteAction(
    data: FormData,
    channelId: string,
): Promise<FormState> {
    const session = await auth();

    const validation = validateFormData(inviteSchema, data);

    if (!validation.success) {
        return validation.state;
    }

    const request: DirectChannelInviteRequest = {
        targetIds: [validation.data.targetId],
    };

    const response = await authenticatedFetch(
        session,
        `${API_BASE_URL}/channels/${channelId}/members`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        },
    );

    if (!response.ok) {
        const error: ApiErrorResponse = await response.json();

        return { error: error.message };
    }

    return { error: null };
}
