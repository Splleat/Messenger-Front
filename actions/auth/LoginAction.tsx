'use server';

import { cookies } from 'next/dist/server/request/cookies';
import { LoginFormValues, LoginResponse, loginSchema } from '@/types/auth';

export async function LoginAction(data: LoginFormValues) {
    const parsed = loginSchema.safeParse(data);

    if (!parsed.success) {
        return { error: '입력값이 올바르지 않습니다. ' };
    }

    const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        return { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
    }

    const loginResponse = await response.json();

    const cookieStore = await cookies();

    cookieStore.set('accessToken', loginResponse.accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 1800000,
    });

    cookieStore.set('refreshToken', loginResponse.refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 604800000,
    });

    return {
        success: true,
        user: {
            id: loginResponse.id,
            username: loginResponse.username,
            profileImage: loginResponse.profileImage,
            statusMessage: loginResponse.statusMessage,
        }
    };
}