import { ProfileEditForm } from '@/components/user/ProfileEditForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function UserProfile() {
    const session = await auth();

    if (!session?.accessToken || session.error === 'RefreshTokenError') {
        redirect('/auth/login');
    }

    return (
        <div>
            <ProfileEditForm session={session}></ProfileEditForm>
        </div>
    )
}