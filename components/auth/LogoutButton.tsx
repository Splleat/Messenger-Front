'use client';

import { Button } from '@/components/ui/button';
import { LogoutAction } from '@/actions/auth/LogoutAction';

export default function LogoutButton() {
    const onClick = async () => {
        await LogoutAction();
    };

    return <Button onClick={onClick}>로그아웃</Button>;
}