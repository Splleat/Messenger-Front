import { AttachmentResponse } from '@/types/messenger';
import { DownloadIcon } from 'lucide-react';
import { downloadFile } from '@/lib/download';
import { AttachmentCard } from '@/components/messenger/message/AttachmentCard';
import { toast } from 'sonner';

export function AttachmentRenderer({
    attachment,
}: Readonly<{ attachment: AttachmentResponse }>) {
    const { url, type } = attachment;

    const fileName = url.substring(url.lastIndexOf('/') + 1);

    return (
        <a href={url} target="_blank" rel="noopener noreferrer">
            <AttachmentCard
                name={fileName}
                thumbnailUrl={type === 'image' ? url : undefined}
                action={
                    <DownloadIcon
                        className="shrink-0 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                            e.preventDefault();
                            downloadFile(url, fileName).then(() => toast.success('파일이 다운로드 되었습니다.'));
                        }}
                    />
                }
            />
        </a>
    );
}
