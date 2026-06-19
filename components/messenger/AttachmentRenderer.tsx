import { AttachmentResponse } from '@/types/common';
import { Card, CardContent } from '@/components/ui/card';
import { DownloadIcon, FileIcon } from 'lucide-react';
import { downloadFile } from '@/lib/download';

export function AttachmentRenderer({
    attachment,
}: Readonly<{ attachment: AttachmentResponse }>) {
    const { type, url } = attachment;

    const fileName = url.substring(url.lastIndexOf('/') + 1);

    return (
        <Card className="hover:bg-accent/50 transition-colors cursor-pointer w-96">
            <CardContent className="flex items-center gap-3">
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="content"
                >
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                        <FileIcon className="w-5 h-5" />
                    </div>
                </a>
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate text-foreground">
                        {fileName}
                    </p>
                </div>
                <div>
                    <DownloadIcon
                        onClick={() => downloadFile(url, fileName)}
                    />
                </div>
            </CardContent>
        </Card>
    );
}