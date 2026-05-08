import {
    ChannelListResponse,
    GroupListResponse,
    MessageResponse,
} from '@/types/common';
import { Session } from 'next-auth';
import { authenticatedFetch } from '@/lib/api-auth';

export async function fetchChannelList(session: Session) {
    const response = await authenticatedFetch(
        session,
        'http://localhost:8080/channels',
    );

    if (!response.ok) {
        return [];
    }

    const data: ChannelListResponse[] = await response.json();

    return data;
}

export async function fetchGroupList(session: Session) {
    const response = await authenticatedFetch(
        session,
        'http://localhost:8080/groups',
    );

    if (!response.ok) {
        return [];
    }

    const data: GroupListResponse[] = await response.json();

    return data;
}

export async function fetchMessageList(session: Session, channelId: string) {
    const response = await authenticatedFetch(
        session,
        `http://localhost:8080/channels/${channelId}/messages`,
    );

    if (!response.ok) {
        return [];
    }

    const data: MessageResponse[] = await response.json();

    return data;
}