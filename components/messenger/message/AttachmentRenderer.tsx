import { AttachmentResponse } from '@/types/messenger';
import { DownloadIcon } from 'lucide-react';
import { downloadFile } from '@/lib/download';
import { AttachmentCard } from '@/components/messenger/message/AttachmentCard';
import { toast } from 'sonner';

export function AttachmentRenderer({
    attachment,
}: Readonly<{ attachment: AttachmentResponse }>) {
    const { name, url, type, size } = attachment;

    if (type === 'image') {
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-block"
            >
                <img
                    src={url}
                    alt={name}
                    className="max-h-80 max-w-sm rounded-lg object-cover transition-opacity hover:opacity-90"
                />
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        downloadFile(url, name).then(() =>
                            toast.success('파일이 다운로드 되었습니다.'),
                        );
                    }}
                    className="absolute top-2 right-2 rounded-md bg-background/80 p-1.5 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
                >
                    <DownloadIcon className="w-4 h-4" />
                </button>
            </a>
        );
    }

    return (
        <a href={url} target="_blank" rel="noopener noreferrer">
            <AttachmentCard
                name={name}
                size={size}
                action={
                    <DownloadIcon
                        className="shrink-0 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                            e.preventDefault();
                            downloadFile(url, name).then(() => toast.success('파일이 다운로드 되었습니다.'));
                        }}
                    />
                }
            />
        </a>
    );
}
