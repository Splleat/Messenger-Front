import { API_BASE_URL } from '@/lib/config';
import { LoginRequest, LoginResponse, TokenReissueResponse } from '@/types/auth';
import { ActionResponse, ApiErrorResponse, createAuthError, createValidationError } from '@/types/common';
import { JWT } from '@auth/core/jwt';
import { loginSchema } from '@/schema/auth';

export async function fetchLogin(
    credentials: LoginRequest,
): Promise<ActionResponse<LoginResponse>> {
    const parsed = loginSchema.safeParse(credentials);

    if (!parsed.success) {
        return createValidationError('입력값이 올바르지 않습니다.');
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
        return { success: true, data: data as LoginResponse };
    }

    return { success: false, error: data as ApiErrorResponse };
}

export async function tokenReissue(
    token: JWT,
): Promise<ActionResponse<TokenReissueResponse>> {
    const { accessToken, refreshToken } = token;

    if (!accessToken || !refreshToken) {
        return createAuthError('인증 정보가 존재하지 않습니다.');
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, refreshToken }),
    });

    if (response.ok) {
        const data: TokenReissueResponse = await response.json();
        return { success: true, data };
    }

    const error: ApiErrorResponse = await response.json();
    return { success: false, error };
}
