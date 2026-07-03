import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background">
            <div className="w-18 h-full flex flex-col items-center py-3 gap-3 bg-card border-r border-border shrink-0">
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="w-12 h-12 rounded-full" />
            </div>

            <div className="w-64 h-full flex flex-col p-3 gap-2 bg-secondary/30 border-r border-border">
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>

            <div className="flex-1 flex flex-col">
                <div className="h-12 border-b border-border px-4 flex items-center">
                    <Skeleton className="h-5 w-32" />
                </div>
                <div className="flex-1 p-4 flex flex-col gap-3">
                    <Skeleton className="h-16 w-1/2" />
                    <Skeleton className="h-16 w-1/3 self-end" />
                    <Skeleton className="h-16 w-2/5" />
                </div>
            </div>
        </div>
    );
}
