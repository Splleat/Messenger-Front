import {
    ChannelListResponse,
    ChannelParticipantResponse,
    GroupListResponse,
    GroupResponse,
    MessageCursorBothResponse,
    MessageCursorNextResponse,
    MessageCursorPrevResponse,
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

export async function fetchChannelParticipants(session: Session, channelId: string) {
    const response = await authenticatedFetch(
        session,
        `http://localhost:8080/channels/${channelId}/participants`,
    );

    if (!response.ok) {
        return [];
    }

    const data: ChannelParticipantResponse[] = await response.json();

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

export async function fetchGroupChannelEnterMessageList(session: Session, groupId: string, channelId: string) {
    const response = await authenticatedFetch(
        session,
        `http://localhost:8080/groups/${groupId}/channels/${channelId}`,
    );

    if (!response.ok) {
        return [];
    }

    const data: MessageCursorBothResponse = await response.json();

    return data;
}

export async function fetchDirectChannelEnterMessageList(session: Session, channelId: string) {
    const response = await authenticatedFetch(
        session,
        `http://localhost:8080/channels/${channelId}`
    );

    if (!response.ok) {
        return [];
    }

    const data: MessageCursorBothResponse = await response.json();

    return data
}

export async function fetchCursorPrevMessage(session: Session, channelId: string, cursorId: string) {
    const response = await authenticatedFetch(
        session,
        `http://localhost:8080/channels/${channelId}/prev?cursorId=${cursorId}`,
    );

    if (!response.ok) {
        return [];
    }

    const data: MessageCursorPrevResponse = await response.json();

    return data;
}

export async function fetchCursorNextMessage(session: Session, channelId: string, cursorId: string) {
    const response = await authenticatedFetch(
        session,
        `http://localhost:8080/channels/${channelId}/next?cursorId=${cursorId}`,
    );

    if (!response.ok) {
        return [];
    }

    const data: MessageCursorNextResponse = await response.json();

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