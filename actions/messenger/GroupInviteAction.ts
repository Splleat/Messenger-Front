'use server';

import {
    ApiErrorResponse,
    FormState,
    GroupInviteRequest,
} from '@/types/common';
import { authenticatedFetch } from '@/lib/api-auth';
import { auth } from '@/auth';
import { validateFormData } from '@/lib/form-validator';
import { inviteSchema } from '@/schema/messenger';

export async function GroupInviteAction(
    data: FormData,
    groupId: string,
): Promise<FormState> {
    const session = await auth();

    const validation = validateFormData(inviteSchema, data);

    if (!validation.success) {
        return validation.state;
    }

    const request: GroupInviteRequest = {
        targetIds: [validation.data.targetId],
    };

    const response = await authenticatedFetch(
        session,
        `http://localhost:8080/groups/${groupId}`,
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