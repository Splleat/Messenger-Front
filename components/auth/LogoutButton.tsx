'use client';

import { Button } from '@/components/ui/button';
import { LogoutAction } from '@/actions/auth/LogoutAction';
import { useState } from 'react';

export default function LogoutButton() {
    const [error, setError] = useState<string | null>();

    const onClick = async () => {
        const result = await LogoutAction();

        if (!result.success) {
            setError(result.error.message);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button onClick={onClick} variant="ghost">
                로그아웃
            </Button>
        </div>
    );
}
