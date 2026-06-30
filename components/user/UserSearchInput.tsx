'use client';

import { useEffect, useRef, useState } from 'react';
import { searchProfiles } from '@/actions/user/search-profiles.action';
import { UserSearchResult } from '@/types/profile';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

interface Props {
    onSelect: (user: UserSearchResult) => void;
    selected: UserSearchResult | null;
}

export function UserSearchInput({ onSelect, selected }: Props) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<UserSearchResult[]>([]);
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim()) {
                const data = await searchProfiles(query);
                setResults(data);
                setOpen(true);
            } else {
                setResults([]);
                setOpen(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    function handleSelect(user: UserSearchResult) {
        onSelect(user);
        setQuery('');
        setResults([]);
        setOpen(false);
    }

    return (
        <div className="flex flex-col gap-2">
            {selected && (
                <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={selected.imageUrl} />
                        <AvatarFallback>{selected.name[0]}</AvatarFallback>
                    </Avatar>
                    <span>{selected.name}</span>
                    {selected.statusMessage && (
                        <span className="text-xs text-muted-foreground truncate">{selected.statusMessage}</span>
                    )}
                </div>
            )}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverAnchor asChild>
                    <div ref={inputRef}>
                        <Input
                            placeholder="이름으로 검색"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoComplete="off"
                        />
                    </div>
                </PopoverAnchor>
                <PopoverContent
                    className="p-0"
                    style={{ width: inputRef.current?.offsetWidth }}
                    align="start"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <Command>
                        <CommandList>
                            <CommandEmpty className="py-4 text-sm">
                                검색 결과가 없습니다.
                            </CommandEmpty>
                            <CommandGroup>
                                {results.map((user) => (
                                    <CommandItem
                                        key={user.userId}
                                        onSelect={() => handleSelect(user)}
                                        className="cursor-pointer"
                                    >
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={user.imageUrl} />
                                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span>{user.name}</span>
                                            {user.statusMessage && (
                                                <span className="text-xs text-muted-foreground">{user.statusMessage}</span>
                                            )}
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
