'use server'

import { LoginRequest, LoginResponse, loginSchema } from '@/types/auth';

export async function LoginAction(credentials: LoginRequest) {
    const parsed = loginSchema.safeParse(credentials);

    if (!parsed.success) return null;

    const response = await fetch("http://localhost:8080/auth/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) return null;

    const data: LoginResponse = await response.json();

    return data;
}