export interface ApiErrorResponse {
    code: string,
    message: string,
    timestamp: Date
}

export type ActionResponse<T = undefined> =
    | { success: true; data?: T }
    | { success: false; error: ApiErrorResponse }