'use client'

import { useSearchParams } from 'next/navigation';
import { useSidebar } from '@/components/ui/sidebar';
import { SpaceIcon } from '@/components/messenger/space/SpaceIcon';
import React from 'react';

export function SpaceNavItem({
    link,
    name,
}: Readonly<{
    link: string;
    name: string;
}>) {
    const searchParams = useSearchParams();
    const { toggleSidebar, open } = useSidebar();

    const linkSpaceId = new URL(link, 'http://x').searchParams.get('spaceId');
    const currentSpaceId = searchParams.get('spaceId');

    const isActive = linkSpaceId === currentSpaceId;

    function handleClick(e: React.MouseEvent) {
        if (isActive) { // 동일한 스페이스 재클릭 -> 사이드바 토글
            e.preventDefault();
            toggleSidebar();
        } else if (!open) { // 다른 스페이스로 이동 -> 사이드바가 닫혀 있으면 다시 열기
            toggleSidebar();
        }
    }

    return <SpaceIcon link={link} name={name} onClick={handleClick} />;
}