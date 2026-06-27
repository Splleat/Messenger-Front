import { API_BASE_URL } from '@/lib/config';
import { Session } from 'next-auth';
import { authenticatedFetch } from '@/lib/api-auth';
import { ApiErrorResponse } from '@/types/common';

export async function updateProfileAction(session: Session, formData: FormData) {
    const response = await authenticatedFetch(session, `${API_BASE_URL}/profiles`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: formData.get('name'),
            statusMessage: formData.get('statusMessage'),
        }),
    })

    if (!response.ok) {
        const error: ApiErrorResponse = await response.json();

        return { error: error.message };
    }

    return { error: null };
}