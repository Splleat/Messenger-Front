'use client';

import { Button } from '@/components/ui/button';
import { logoutAction } from '@/actions/auth/logout.action';
import { useActionState } from 'react';

export default function LogoutButton() {
    const [state, action, isPending] = useActionState(async () => {
        return await logoutAction();
    }, null);

    return (
        <div className="flex flex-col gap-2">
            <form action={action} className="flex flex-col gap-2">
                {state?.error ? <p className="text-red-500">{state.error}</p> : null}
                <Button type="submit" variant="ghost" disabled={isPending}>
                    {isPending ? '로그아웃 중...' : '로그아웃'}
                </Button>
            </form>
        </div>
    );
}
