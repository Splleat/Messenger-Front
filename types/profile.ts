export interface MyProfileResponse {
    email: string;
    name: string;
    imageUrl?: string;
    statusMessage?: string;
}

export interface ProfileResponse {
    name: string;
    imageUrl?: string;
    statusMessage?: string;
}

export interface UserSearchResult {
    userId: string;
    name: string;
    imageUrl?: string;
    statusMessage?: string;
}
