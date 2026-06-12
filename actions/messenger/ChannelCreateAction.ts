'use server';

import {
    ApiErrorResponse,
    ChannelCreateRequest,
    FormState,
} from '@/types/common';
import { authenticatedFetch } from '@/lib/api-auth';
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
        ? `http://localhost:8080/spaces/${spaceId}/channels`
        : 'http://localhost:8080/channels';

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