'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React, { useActionState, useRef, useState } from 'react';
import { FormState } from '@/types/common';
import { Paperclip, SendHorizontal } from 'lucide-react';

export function ChannelChatInput({
    placeHolder,
    onSubmit,
}: Readonly<{
    placeHolder: string;
    onSubmit: (text: string, file?: File) => void;
}>) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [state, action, isPending] = useActionState(
        async (_prev: FormState, data: FormData) => {
            const text = data.get('text') as string;
            
            if (!text.trim() && !selectedFile) {
                return { error: '메시지를 입력해주세요.' };
            }

            onSubmit(text, selectedFile ?? undefined);
            
            setSelectedFile(null);
            formRef.current?.reset();
            
            return { error: null };
        },
        { error: null }
    );

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    return (
        <div className="px-4 pb-6 bg-background">
            {selectedFile && (
                <div className="mb-2 px-2 py-1 text-xs bg-muted rounded-md flex items-center justify-between">
                    <span className="truncate">{selectedFile.name}</span>
                    <button 
                        onClick={() => setSelectedFile(null)}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        ✕
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
                    <Input
                        type="text"
                        name="text"
                        autoComplete="off"
                        className="bg-transparent border-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground py-6"
                        placeholder={placeHolder}
                    />
                    <Button 
                        type="submit" 
                        size="icon"
                        variant="ghost"
                        disabled={isPending}
                        className="text-primary hover:text-primary/80 shrink-0"
                    >
                        <SendHorizontal className="w-5 h-5" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
