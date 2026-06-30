'use server';

import { API_BASE_URL } from '@/lib/config';
import { authenticatedFetch } from '@/lib/http';
import { auth } from '@/auth';
import { UserSearchResult } from '@/types/profile';

export async function searchProfiles(name: string, page: number = 0): Promise<UserSearchResult[]> {
    if (!name.trim()) return [];

    const session = await auth();
    const url = `${API_BASE_URL}/profiles/search?name=${encodeURIComponent(name)}&page=${page}`;

    const response = await authenticatedFetch(session, url);

    if (!response.ok) return [];

    return response.json();
}
