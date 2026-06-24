'use client';

import { Session } from 'next-auth';
import { ProfileEditForm } from '@/components/user/ProfileEditForm';
import { MyProfileResponse } from '@/types/common';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export function ProfileEditModal({
    session,
    open,
    onOpenChange,
    onProfileUpdate,
}: Readonly<{
    session: Session;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onProfileUpdate?: (profile: MyProfileResponse) => void;
}>) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>프로필 설정</DialogTitle>
                </DialogHeader>
                <ProfileEditForm session={session} onProfileUpdate={onProfileUpdate} />
            </DialogContent>
        </Dialog>
    );
}
