import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function MessageContent({
    content,
    isUpdated,
    isDeleted,
    isEditing,
    draft,
    onDraftChange,
    onSave,
    onCancel,
}: Readonly<{
    content: string;
    isUpdated: boolean;
    isDeleted: boolean;
    isEditing: boolean;
    draft: string;
    onDraftChange: (value: string) => void;
    onSave: () => void;
    onCancel: () => void;
}>) {
    if (isDeleted) {
        return (
            <p className="text-sm italic text-muted-foreground">
                삭제된 메시지입니다.
            </p>
        );
    }

    if (isEditing) {
        return (
            <div className="mt-1 flex flex-col gap-2">
                <Textarea
                    value={draft}
                    onChange={(e) => onDraftChange(e.target.value)}
                    className="text-sm"
                    autoFocus
                />
                <div className="flex gap-2">
                    <Button size="sm" onClick={onSave}>
                        저장
                    </Button>
                    <Button size="sm" variant="outline" onClick={onCancel}>
                        취소
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <p className="text-sm leading-7 text-foreground/90">
            {content}
            {isUpdated && (
                <span className="ml-1 text-xs text-muted-foreground">
                    (수정됨)
                </span>
            )}
        </p>
    );
}
