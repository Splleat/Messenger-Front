'use client'

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
    const onClick = async () => {
        await signOut({ callbackUrl: '/auth/login' })
    }

    return (
        <Button onClick={onClick}>
            로그아웃
        </Button>
    )
}