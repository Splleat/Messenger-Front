import {
    ChannelListResponse,
    ChannelMessagePage,
    ChannelParticipantResponse,
    SpaceListResponse,
    SpaceResponse,
    MessagePageParam,
    MessagePageResponse,
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

export async function fetchSpaceList(session: Session) {
    const response = await authenticatedFetch(
        session,
        'http://localhost:8080/spaces',
    );

    if (!response.ok) {
        return [];
    }

    const data: SpaceListResponse[] = await response.json();

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

export async function fetchMessages(session: Session, param: MessagePageParam, channelId: string): Promise<ChannelMessagePage> {
    switch (param.direction) {
        case 'up': {
            const data = await fetchCursorPrevMessage(
                session,
                channelId,
                param.cursor,
            );

            return {
                messages: data.messages,
                hasPrev: data.hasMore,
                prevCursorId: data.cursorId,
                hasNext: false,
                nextCursorId: undefined,
            };
        }

        case 'down': {
            const data = await fetchCursorNextMessage(
                session,
                channelId,
                param.cursor,
            );

            return {
                messages: data.messages,
                hasNext: data.hasMore,
                nextCursorId: data.cursorId,
                hasPrev: false,
                prevCursorId: undefined,
            }
        }
        default:
            throw new Error('처리되지 않은 케이스');
    }
}

export async function fetchCursorPrevMessage(
    session: Session,
    channelId: string,
    cursorId: string,
): Promise<MessagePageResponse> {
    const response = await authenticatedFetch(
        session,
        `http://localhost:8080/channels/${channelId}/messages?cursorId=${cursorId}&direction=prev`,
    );

    if (!response.ok) {
        // TODO: fallback
    }

    return await response.json();
}

export async function fetchCursorNextMessage(session: Session, channelId: string, cursorId: string): Promise<MessagePageResponse> {
    const response = await authenticatedFetch(
        session,
        `http://localhost:8080/channels/${channelId}/messages?cursorId=${cursorId}&direction=next`,
    );

    if (!response.ok) {
        // TODO: fallback
    }

    return await response.json();
}

// 채널 입장
export async function fetchChannelEnterMessages(session: Session, channelId: string, spaceId?: string): Promise<ChannelMessagePage> {
    const url = spaceId ?
        `http://localhost:8080/spaces/${spaceId}/channels/${channelId}` :
        `http://localhost:8080/channels/${channelId}`;

    const response = await authenticatedFetch(
        session,
        url
    );

    if (!response.ok) {
        // TODO: fallback
    }

    return await response.json();
}

export async function fetchSpace(session: Session, spaceId: string) {
    const response = await authenticatedFetch(
        session,
        `http://localhost:8080/spaces/${spaceId}`
    );

    if (!response.ok) {
        return undefined;
    }

    const data: SpaceResponse = await response.json();

    return data;
}

export async function updateChannelLastRead(
    session: Session,
    channelId: string,
    lastReadMessageId: string
) {
    await authenticatedFetch(
        session,
        `http://localhost:8080/channels/${channelId}/read`,
        { method: 'PATCH', body: JSON.stringify({ lastReadMessageId }) }
    );
}