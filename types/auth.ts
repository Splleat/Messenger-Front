export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    name: string;
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
    accessTokenExpiresIn: string;
}

export interface TokenReissueResponse {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: string;
}