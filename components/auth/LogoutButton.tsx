'use client';

import { Button } from '@/components/ui/button';
import { LogoutAction } from '@/actions/auth/LogoutAction';
import { useActionState } from 'react';

export default function LogoutButton() {
    const [state, action, isPending] = useActionState(async () => {
        return await LogoutAction();
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
