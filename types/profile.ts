export interface MyProfileResponse {
    email: string;
    name: string;
    imageUrl?: string;
    statusMessage?: string;
}

export interface ProfileResponse {
    userId: string;
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
