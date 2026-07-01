'use client';

import { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { fetchTargetProfile } from '@/lib/api-user';
import { ProfileResponse } from '@/types/profile';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

export function ProfileCardModal({
    session,
    userId,
    open,
    onOpenChange,
}: Readonly<{
    session: Session;
    userId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}>) {
    const [profile, setProfile] = useState<ProfileResponse | null>(null);

    useEffect(() => {
        if (!open || !userId) return;

        let cancelled = false;

        fetchTargetProfile(session, userId).then((data) => {
            if (!cancelled) setProfile(data ?? null);
        });

        return () => {
            cancelled = true;
            setProfile(null);
        };
    }, [open, userId, session]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm p-0 gap-0 overflow-hidden">
                <DialogHeader className="sr-only">
                    <DialogTitle>프로필</DialogTitle>
                </DialogHeader>
                {profile ? (
                    <div className="flex flex-col">
                        <div className="relative h-52 w-full bg-muted">
                            {profile.imageUrl ? (
                                <img
                                    src={profile.imageUrl}
                                    alt={profile.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/40 to-primary/10 text-6xl font-bold text-primary-foreground">
                                    {profile.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-1 p-4">
                            <div className="text-lg font-semibold">
                                {profile.name}
                            </div>
                            {profile.statusMessage && (
                                <div className="text-sm text-muted-foreground">
                                    {profile.statusMessage}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-80">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
