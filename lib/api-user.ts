import { API_BASE_URL } from '@/lib/config';
import { Session } from 'next-auth';
import { authenticatedFetch } from '@/lib/http';
import { MyProfileResponse, ProfileResponse } from '@/types/profile';

export async function fetchMyProfile(session: Session) {
    const response = await authenticatedFetch(
        session,
        `${API_BASE_URL}/profiles/me`,
    );

    if (!response.ok) {
        return null;
    }

    const data: MyProfileResponse = await response.json();

    return data;
}

export async function fetchTargetProfile(session: Session, targetId: string) {
    const response = await authenticatedFetch(
        session,
        `${API_BASE_URL}/profiles/${targetId}`,
    );

    if (!response.ok) {
        return undefined;
    }

    const data: ProfileResponse = await response.json();

    return data;
}

export async function uploadProfileImage(
    session: Session,
    newImageKey: string,
) {
    const response = await authenticatedFetch(
        session,
        `${API_BASE_URL}/profiles`,
        {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newImageKey: newImageKey }),
        },
    );

    if (!response.ok) {
        return { error: '?„ë¡œ???´ë?ì§€ ?…ë¡œ???¤íŒ¨' };
    }

    return { error: null };
}
