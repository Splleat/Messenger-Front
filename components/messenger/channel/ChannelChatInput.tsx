'use client';

import { Button } from '@/components/ui/button';
import React, { useActionState, useEffect, useMemo, useRef } from 'react';
import { FormState } from '@/types/common';
import { Paperclip, SendHorizontal, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { AttachmentCard } from '@/components/messenger/message/AttachmentCard';

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;

    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function ChannelChatInput({
    placeHolder,
    onSubmit,
    onTyping,
    isUploading,
    selectedFile,
    onFileChange,
}: Readonly<{
    placeHolder: string;
    onSubmit: (text: string, file?: File) => void;
    onTyping: (isTyping: boolean) => void;
    isUploading: boolean;
    selectedFile: File | null;
    onFileChange: (file: File | null) => void;
}>) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const isTypingRef = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const previewUrl = useMemo(() => {
        if (selectedFile?.type.startsWith('image/')) {
            return URL.createObjectURL(selectedFile);
        }

        return null;
    }, [selectedFile]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const [state, action, isPending] = useActionState(
        async (_prev: FormState, data: FormData) => {
            const text = data.get('text') as string;

            if (!text.trim() && !selectedFile) {
                return { error: '메시지를 입력해주세요.' };
            }

            onSubmit(text, selectedFile ?? undefined);

            // 타이핑 상태 해제
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            onTyping(false);
            isTypingRef.current = false;

            // 파일 선택 초기화
            onFileChange(null);
            formRef.current?.reset();

            return { error: null };
        },
        { error: null },
    );

    function handleInputChange() {
        if (!isTypingRef.current) {
            isTypingRef.current = true;
            onTyping(true);
        }

        // 기존 타이머 리셋
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            isTypingRef.current = false;
            onTyping(false);
        }, 3000);
    }

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileChange(file);
        }
    };

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        // Enter가 눌렸고 Shift가 눌리지 않았다면 메시지 전송
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            formRef.current?.requestSubmit();
        }
    }

    function handlePaste(e: React.ClipboardEvent) {
        const file = e.clipboardData?.files[0];

        if (file) {
            e.preventDefault();
            onFileChange(file);
        }
    }

    return (
        <div className="relative px-4 pb-6 bg-background">
            {selectedFile && (
                <div className="mb-2">
                    <AttachmentCard
                        name={selectedFile.name}
                        sizeLabel={formatFileSize(selectedFile.size)}
                        thumbnailUrl={previewUrl ?? undefined}
                        action={
                            <button
                                onClick={() => onFileChange(null)}
                                className="ml-auto shrink-0 text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        }
                    />
                </div>
            )}
            <div className="flex items-center gap-3 bg-muted/50 rounded-lg px-4 py-1 border border-border focus-within:border-primary/50 transition-all shadow-sm">
                <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isUploading}
                    className="text-muted-foreground hover:text-primary shrink-0"
                    onClick={handleFileClick}
                >
                    <Paperclip className="w-5 h-5" />
                </Button>
                <form
                    ref={formRef}
                    className="flex-1 flex items-center gap-2"
                    action={action}
                >
                    <Textarea
                        name="text"
                        autoComplete="off"
                        className="bg-transparent border-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground py-6"
                        placeholder={placeHolder}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        variant="ghost"
                        disabled={isPending || isUploading}
                        className="text-primary hover:text-primary/80 shrink-0"
                    >
                        {isUploading ? (
                            <Spinner />
                        ) : (
                            <SendHorizontal className="w-5 h-5" />
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
