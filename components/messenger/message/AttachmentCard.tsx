import { Card, CardContent } from '@/components/ui/card';
import { FileIcon } from 'lucide-react';
import React from 'react';

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;

    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function AttachmentCard({
    name,
    size,
    thumbnailUrl,
    action,
}: Readonly<{
    name: string;
    size?: number;
    thumbnailUrl?: string;
    action: React.ReactNode;
}>) {
    return (
        <Card className="w-96">
            <CardContent className="flex items-center gap-3">
                {thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={name}
                        className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    />
                ) : (
                    <div className="shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
                        <FileIcon className="w-5 h-5" />
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-foreground">
                        {name}
                    </p>
                    {size !== undefined && (
                        <p className="text-xs text-muted-foreground">
                            {formatFileSize(size)}
                        </p>
                    )}
                </div>
                {action}
            </CardContent>
        </Card>
    );
}
