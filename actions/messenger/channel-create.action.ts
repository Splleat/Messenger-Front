'use server';
import { API_BASE_URL } from '@/lib/config';

import { ApiErrorResponse, FormState } from '@/types/common';
import { ChannelCreateRequest } from '@/types/messenger';
import { authenticatedFetch } from '@/lib/http';
import { auth } from '@/auth';
import { validateFormData } from '@/lib/form-validator';
import { channelCreateSchema } from '@/schema/messenger';

export async function ChannelCreateAction(
    data: FormData,
    spaceId?: string,
): Promise<FormState> {
    const session = await auth();

    const validation = validateFormData(channelCreateSchema, data);

    if (!validation.success) {
        return validation.state;
    }

    const url = spaceId
        ? `${API_BASE_URL}/spaces/${spaceId}/channels`
        : `${API_BASE_URL}/channels`;

    const request: ChannelCreateRequest = {
        channelName: validation.data.channelName,
        type: "TEXT"
    }

    const response = await authenticatedFetch(session, url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error: ApiErrorResponse = await response.json();

        return { error: error.message };
    }

    return { error: null };
}
