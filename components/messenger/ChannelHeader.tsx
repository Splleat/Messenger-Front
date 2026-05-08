import { Hash, Bell, Users, Search, Inbox, HelpCircle } from "lucide-react";

export function ChannelHeader({ name }: Readonly<{ name: string }>) {
    return (
        <header className="h-12 border-b border-border flex items-center px-4 justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
            <div className="flex items-center gap-2 overflow-hidden">
                <Hash className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <span className="font-bold text-sm text-foreground truncate">
                    {name}
                </span>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground">
                <div className="hidden md:flex items-center gap-4">
                    <Bell className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
                    <Users className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
                </div>

                <div className="relative hidden sm:block">
                    <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        className="bg-muted border-none h-7 rounded-md text-xs pl-8 pr-2 w-36 focus:w-48 transition-all focus:ring-1 focus:ring-ring outline-none text-foreground"
                        placeholder="검색하기"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <Inbox className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
                    <HelpCircle className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
                </div>
            </div>
        </header>
    );
}
