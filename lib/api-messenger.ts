import { API_BASE_URL } from '@/lib/config';
import {
    ChannelListResponse,
    ChannelMessagePage,
    ChannelParticipantResponse,
    MessagePageParam,
    MessagePageResponse,
    SpaceListResponse,
    SpaceResponse,
} from '@/types/messenger';
import { Session } from 'next-auth';
import { authenticatedFetch, fetchResult } from '@/lib/http';
import { ActionResponse } from '@/types/common';

export async function fetchChannelList(
    session: Session,
): Promise<ActionResponse<ChannelListResponse[]>> {
    return fetchResult<ChannelListResponse[]>(
        session,
        `${API_BASE_URL}/channels`,
    );
}

export async function fetchSpaceList(
    session: Session,
): Promise<ActionResponse<SpaceListResponse[]>> {
    return fetchResult<SpaceListResponse[]>(session, `${API_BASE_URL}/spaces`);
}

export async function fetchChannelParticipants(
    session: Session,
    channelId: string,
): Promise<ActionResponse<ChannelParticipantResponse[]>> {
    return fetchResult<ChannelParticipantResponse[]>(
        session,
        `${API_BASE_URL}/channels/${channelId}/participants`,
    );
}

export async function fetchMessages(
    session: Session,
    param: MessagePageParam,
    channelId: string,
): Promise<ChannelMessagePage> {
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
            };
        }
        default:
             throw new Error('처리할 수 없는 방향값');
    }
}

export async function fetchCursorPrevMessage(
    session: Session,
    channelId: string,
    cursorId: string,
): Promise<MessagePageResponse> {
    const response = await authenticatedFetch(
        session,
        `${API_BASE_URL}/channels/${channelId}/messages?cursorId=${cursorId}&direction=prev`,
    );

    if (!response.ok) {
        return { messages: [], hasMore: false, cursorId };
    }

    return await response.json();
}

export async function fetchCursorNextMessage(
    session: Session,
    channelId: string,
    cursorId: string,
): Promise<MessagePageResponse> {
    const response = await authenticatedFetch(
        session,
        `${API_BASE_URL}/channels/${channelId}/messages?cursorId=${cursorId}&direction=next`,
    );

    if (!response.ok) {
        return { messages: [], hasMore: false, cursorId };
    }

    return await response.json();
}

// 채널 진입
export async function fetchChannelEnterMessages(
    session: Session,
    channelId: string,
    spaceId?: string,
): Promise<ChannelMessagePage> {
    const url = spaceId
        ? `${API_BASE_URL}/spaces/${spaceId}/channels/${channelId}`
        : `${API_BASE_URL}/channels/${channelId}`;

    const response = await authenticatedFetch(session, url);

    if (!response.ok) {
        return {
            messages: [],
            hasPrev: false,
            prevCursorId: undefined,
            hasNext: false,
            nextCursorId: undefined,
        };
    }

    return await response.json();
}

export async function fetchSpace(
    session: Session,
    spaceId: string,
): Promise<ActionResponse<SpaceResponse>> {
    return fetchResult<SpaceResponse>(
        session,
        `${API_BASE_URL}/spaces/${spaceId}`,
    );
}

export async function updateChannelLastRead(
    session: Session,
    channelId: string,
    lastReadMessageId: string,
): Promise<ActionResponse<void>> {
    return fetchResult<void>(
        session,
        `${API_BASE_URL}/channels/${channelId}/read`,
        { method: 'PATCH', body: JSON.stringify({ lastReadMessageId }) },
    );
}
