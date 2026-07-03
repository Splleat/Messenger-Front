'use client';

import { Button } from '@/components/ui/button';
import React, { useActionState, useRef, useState } from 'react';
import { FormState } from '@/types/common';
import { Paperclip, SendHorizontal, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';

export function ChannelChatInput({
    placeHolder,
    onSubmit,
    onTyping,
    isUploading,
}: Readonly<{
    placeHolder: string;
    onSubmit: (text: string, file?: File) => void;
    onTyping: (isTyping: boolean) => void;
    isUploading: boolean;
}>) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const isTypingRef = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
            isTypingRef.current = false

            // 파일 선택 초기화
            setSelectedFile(null);
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
            setSelectedFile(file);
        }
    };

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        // Enter가 눌렸고 Shift가 눌리지 않았다면 메시지 전송
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            formRef.current?.requestSubmit();
        }
    }

    return (
        <div className="px-4 pb-6 bg-background">
            {selectedFile && (
                <div className="mb-2 px-2 py-1 text-xs bg-muted rounded-md flex items-center justify-between">
                    <span className="truncate">{selectedFile.name}</span>
                    <button
                        onClick={() => setSelectedFile(null)}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-3 h-3" />
                    </button>
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
