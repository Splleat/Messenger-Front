'use client';

import { Session } from 'next-auth';
import React, { useActionState, useEffect, useRef, useState } from 'react';
import { updateProfileAction } from '@/actions/user/update-profile.action';
import { FormState, MyProfileResponse } from '@/types/common';
import { useStorageUpload } from '@/hooks/use-storage-upload';
import { fetchMyProfile, uploadProfileImage } from '@/lib/api-user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function ProfileEditForm({
    session,
    onProfileUpdate,
}: Readonly<{ session: Session; onProfileUpdate?: (profile: MyProfileResponse) => void }>) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profile, setProfile] = useState<MyProfileResponse | null>(null);
    const { uploadFile, isUploading } = useStorageUpload(session);
    const [state, action, isPending] = useActionState(
        async (_prev: FormState, data: FormData) => {
            const response = await updateProfileAction(session, data);

            if (response.error) {
                toast.error('프로필 정보 변경 중 오류가 발생했습니다.');
                return response;
            }

            const updated = await fetchMyProfile(session);
            if (updated) {
                setProfile(updated);
                onProfileUpdate?.(updated);
            }

            toast.success('프로필 정보가 변경되었습니다.');

            return response;
        },
        { error: null },
    );

    useEffect(() => {
        const profile = fetchMyProfile(session);

        profile.then(setProfile);
    }, [session]);

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const objectKey = await uploadFile(file);
        const result = await uploadProfileImage(session, objectKey);

        if (result.error) {
            alert(result.error);
            return;
        }

        const updated = await fetchMyProfile(session);
        if (updated) {
            setProfile(updated);
            onProfileUpdate?.(updated);
            toast.success('프로필 사진이 변경되었습니다.');
        }
    };

    return (
        <form action={action} className="space-y-6">
            <div className="flex flex-col items-center gap-3">
                <div
                    className="relative group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Avatar className="w-24 h-24 border-2 transition-all hover:brightness-90">
                        <AvatarImage
                            src={profile.imageUrl}
                            className="object-cover"
                        />
                        <AvatarFallback className="text-xl font-semibold">
                            {profile.name?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground border-2 border-background shadow">
                        <Camera className="w-3.5 h-3.5" />
                    </div>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isUploading || isPending}
                />
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={(e) =>
                            setProfile({ ...profile, name: e.target.value })
                        }
                        placeholder="이름을 입력하세요"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="statusMessage">상태 메시지</Label>
                    <Input
                        id="statusMessage"
                        name="statusMessage"
                        value={profile.statusMessage || ''}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                statusMessage: e.target.value,
                            })
                        }
                        placeholder="상태 메시지를 입력하세요"
                    />
                </div>
            </div>

            {state.error && (
                <div className="text-xs text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                    {state.error}
                </div>
            )}

            <Button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2"
            >
                {isPending ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        저장 중...
                    </>
                ) : (
                    '저장'
                )}
            </Button>
        </form>
    );
}
