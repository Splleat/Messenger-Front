import { create } from 'zustand/react';
import { persist } from 'zustand/middleware';

interface UserInfo {
    id: string;
    username: string;
    profileImage: string;
    statusMessage: string;
}

interface UserState {
    user: UserInfo | null;
    setUser: (user: UserInfo) => void;
    clearUser: () => void;
    _isHydrated: boolean,
    setHydrated: (state: boolean) => void;
}

export const userStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            clearUser: () => set({ user: null }),
            _isHydrated: false,
            setHydrated: (state) => set({ _isHydrated: state})
        }),
        {
            name: 'user-storage',
            onRehydrateStorage: () => (state) => {
                state?.setHydrated(true);
            }
        },
    ),
);

