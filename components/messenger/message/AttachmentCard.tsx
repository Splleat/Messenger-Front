import { Card, CardContent } from '@/components/ui/card';
import { FileIcon } from 'lucide-react';
import React from 'react';

export function AttachmentCard({
    name,
    sizeLabel,
    thumbnailUrl,
    action,
}: Readonly<{
    name: string;
    sizeLabel?: string;
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
                    {sizeLabel && (
                        <p className="text-xs text-muted-foreground">
                            {sizeLabel}
                        </p>
                    )}
                </div>
                {action}
            </CardContent>
        </Card>
    );
}
