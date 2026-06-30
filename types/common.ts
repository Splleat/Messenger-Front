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
