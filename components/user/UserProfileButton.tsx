'use client';

import { Session } from 'next-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React, { useState } from 'react';
import { ProfileEditModal } from '@/components/user/ProfileEditModal';
import { MyProfileResponse } from '@/types/profile';

export function UserProfileButton({
    session,
    profile,
}: Readonly<{
    session: Session;
    profile: MyProfileResponse | null;
}>) {
    const [profileOpen, setProfileOpen] = useState(false);

    return (
        <div>
            <Avatar
                className="w-10 h-10 rounded-full shrink-0 border border-border cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setProfileOpen(true)}
            >
                <AvatarImage src={profile?.imageUrl} />
                <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">
                    {profile?.name?.[0].toUpperCase() || 'ME'}
                </AvatarFallback>
            </Avatar>
            {session && (
                <ProfileEditModal
                    session={session}
                    open={profileOpen}
                    onOpenChange={setProfileOpen}
                />
            )}
        </div>
    );
}