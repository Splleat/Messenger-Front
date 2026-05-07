export interface ApiErrorResponse {
    code: string;
    message: string;
    timestamp: Date;
}

export type ActionResponse<T = void> =
    | (T extends void ?
        { success: true } : { success: true; data: T })
    | { success: false; error: ApiErrorResponse }

export interface ChannelListResponse {
    channelId: number;
    channelName: string;
}

export interface GroupListResponse {
    groupId: number;
    groupName: string;
}

export interface MessageResponse {
    userId: number;
    channelId: number;
    username: string;
    profileUrl: string;
    content: string;
    type: string;
    parentMessageId: number;
    createdAt: Date;
}

export const createValidationError = (message: string):
ActionResponse<never> => ({
    success: false,
    error: {
        code: 'VALIDATION_ERROR',
        message,
        timestamp: new Date(),
    },
});

export const createAuthError = (message: string):
ActionResponse<never> => ({
    success: false,
    error: {
        code: 'UNAUTHENTICATED',
        message,
        timestamp: new Date()
    },
});