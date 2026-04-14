export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    user: User;
}

export interface User {
    id: string;
    username: string;
    profileImage: string;
    statusMessage: string;
}
