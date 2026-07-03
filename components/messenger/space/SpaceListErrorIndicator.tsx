'use client';

import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export function SpaceListErrorIndicator() {
    const router = useRouter();

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    onClick={() => router.refresh()}
                    className="w-12 h-12 rounded-[24px] flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
                >
                    <AlertCircle className="w-5 h-5" />
                </button>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>스페이스 목록을 불러오지 못했습니다. 클릭하여 재시도</p>
            </TooltipContent>
        </Tooltip>
    );
}
