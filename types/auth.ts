import { z } from "zod";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LogoutRequest {
    accessToken: string;
    refreshToken: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    id: string;
    username: string;
    profileImage?: string;
    statusMessage?: string;
    accessTokenExpiresIn: number;
}

export interface TokenReissueResponse {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
}

export const loginSchema = z.object({
    email: z.email('올바른 이메일을 입력하세요'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    email: z.email('올바른 이메일을 입력하세요'),
    name: z.string()
        .min(2, '이름은 2자 이상이어야 합니다.')
        .max(50, '이름은 50자 이하여야 합니다.'),
    password: z.string()
        .min(8, '비밀번호는 8자 이성이어야 합니다.')
        .max(72, '비밀번호는 72자 이하여야 합니다.')
});

export type RegisterFormValues = z.infer<typeof registerSchema>;