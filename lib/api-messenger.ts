import {
    ChannelListResponse,
    GroupListResponse,
    GroupResponse,
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

export async function fetchDirectChannelMessageList(session: Session, channelId: string) {
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

export async function fetchGroupChannelMessageList(session: Session, groupId: string, channelId: string) {
    const response = await authenticatedFetch(
        session,
        `http://localhost:8080/groups/${groupId}/channels/${channelId}`,
    );

    if (!response.ok) {
        return [];
    }

    const data: MessageResponse[] = await response.json();

    return data;
}

export async function fetchGroup(session: Session, groupId: string) {
    const response = await authenticatedFetch(
        session,
        `http://localhost:8080/groups/${groupId}`
    );

    if (!response.ok) {
        return undefined;
    }

    const data: GroupResponse = await response.json();

    return data;
}