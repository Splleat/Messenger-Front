import { Spinner } from '@/components/ui/spinner';

export function LoadingSpinner() {
    return (
        <div className="flex items-cneter gap-6">
            <Spinner className="size-8"/>
        </div>
    )
}