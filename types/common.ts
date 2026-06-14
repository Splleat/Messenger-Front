export interface ApiErrorResponse {
    message: string;
    timestamp: Date;
}

export type FormState = {
    error: string | null
}

export type ActionResponse<T = void> =
    | (T extends void ? { success: true } : { success: true; data: T })
    | { success: false; error: ApiErrorResponse };

export interface ChannelListResponse {
    channelId: string;
    channelName: string;
    hasUnread: boolean;
}

export interface SpaceListResponse {
    spaceId: string;
    spaceName: string;
}

export interface SpaceCreateRequest {
    spaceName: string;
}

export interface SpaceInviteRequest {
    targetIds: string[];
}

export interface SpaceResponse {
    spaceId: string;
    spaceName: string;
    channelList: ChannelListResponse[];
}

export interface ChannelCreateRequest {
    channelName: string;
    type: ChannelType;
}

export interface ChannelParticipantResponse {
    userId: string;
    username: string;
    profileImage: string;
    statusMessage: string;
}

export interface MessageRequest {
    content: string;
    idempotencyKey: string;
    type: string;
}

export interface MessageResponse {
    id: string;
    userId: string;
    channelId: string;
    username: string;
    profileUrl: string;
    content: string;
    type: string;
    parentMessageId: string;
    createdAt: string;
}

export interface ChannelEnterResponse {
    messages: MessageResponse[];
    hasPrev: boolean;
    hasNext: boolean;
    prevCursorId?: string;
    nextCursorId?: string;
    lastReadMessageId?: string;
}

export interface MessagePageResponse {
    messages: MessageResponse[];
    hasMore: boolean;
    cursorId?: string;
}

export interface ChannelMessagePage {
    messages: MessageResponse[];
    hasPrev: boolean;
    hasNext: boolean;
    prevCursorId?: string;
    nextCursorId?: string;
}

export type MessagePageParam =
    | { direction: 'initial'; cursor: string | null }
    | { direction: 'up'; cursor: string }
    | { direction: 'down'; cursor: string }

export interface DirectChannelInviteRequest {
    targetIds: string[]
}

export const createValidationError = (
    message: string,
): ActionResponse<never> => ({
    success: false,
    error: {
        message,
        timestamp: new Date(),
    },
});

export const createAuthError = (message: string): ActionResponse<never> => ({
    success: false,
    error: {
        message,
        timestamp: new Date(),
    },
});

type ChannelType = 'TEXT';