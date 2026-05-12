import { z } from 'zod';

export interface ApiErrorResponse {
    code: string;
    message: string;
    timestamp: Date;
}

export type ActionResponse<T = void> =
    | (T extends void ? { success: true } : { success: true; data: T })
    | { success: false; error: ApiErrorResponse };

export interface ChannelListResponse {
    channelId: string;
    channelName: string;
}

export interface GroupListResponse {
    groupId: string;
    groupName: string;
}

export interface GroupCreateRequest {
    groupName: string;
    nickname: string;
}

export interface GroupInviteRequest {
    targetIds: string[];
}

export interface GroupResponse {
    groupId: string;
    groupName: string;
    channelList: ChannelListResponse[];
}

export interface ChannelCreateRequest {
    channelName: string;
    type: ChannelType;
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

export interface DirectChannelInviteRequest {
    targetIds: string[]
}

export const groupCreateSchema = z.object({
    groupName: z.string().min(2, '그룹 이름은 2글자 이상이어야 합니다.'),
    nickname: z.string().min(2, '닉네임은 2글자 이상이어야 합니다.'),
});

export type GroupCreateFormValues = z.infer<typeof groupCreateSchema>;

export const createValidationError = (
    message: string,
): ActionResponse<never> => ({
    success: false,
    error: {
        code: 'VALIDATION_ERROR',
        message,
        timestamp: new Date(),
    },
});

export const createAuthError = (message: string): ActionResponse<never> => ({
    success: false,
    error: {
        code: 'UNAUTHENTICATED',
        message,
        timestamp: new Date(),
    },
});

type ChannelType = 'TEXT';