'use client';

import { PlusCircle, Smile, Gift, StickyNote } from "lucide-react";
import { Input } from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export function ChannelChatInput({
    placeHolder,
    value,
    onChange,
    onSubmit,
}: Readonly<{
    placeHolder: string;
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
}>) {
    return (
        <div className="px-4 pb-6 bg-background">
            <div className="flex items-center gap-3 bg-muted/50 rounded-lg px-4 py-1 border border-border focus-within:border-primary/50 transition-all shadow-sm">
                <PlusCircle className="w-6 h-6 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />

                <form
                    className="flex-1"
                    onSubmit={(event) => {
                        event.preventDefault();
                        onSubmit();
                    }}
                >
                    <Input
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        className="bg-transparent border-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground py-6"
                        placeholder={placeHolder}
                    />
                    <Button type="submit" className="hidden">
                        전송
                    </Button>
                </form>

                <div className="hidden sm:flex items-center gap-3 text-muted-foreground">
                    <Gift className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
                    <StickyNote className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
                    <Smile className="w-6 h-6 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                </div>
            </div>
        </div>
    );
}
