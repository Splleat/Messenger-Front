import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';

export function GroupIcon({ link, name }: Readonly<{ link: string; name: string }>) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link href={`${link}`} className="mb-2">
                    <div className="w-12 h-12 bg-muted rounded-[24px] hover:rounded-[16px] transition-all flex items-center justify-center text-foreground font-bold hover:bg-primary hover:text-primary-foreground group">
                        <span className="group-hover:scale-110 transition-transform">
                            {name[0]}
                        </span>
                    </div>
                </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>{name}</p>
            </TooltipContent>
        </Tooltip>
    );
}