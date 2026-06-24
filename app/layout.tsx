import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import NextAuthProvider from '@/components/auth/NextAuthProvider';
import { QueryProvider } from '@/components/query-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Messenger',
    description: 'Messenger Project',
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ko" suppressHydrationWarning>
            <body className={inter.className}>
                <QueryProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <NextAuthProvider>
                            <main>{children}</main>
                            <Toaster />
                        </NextAuthProvider>
                    </ThemeProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
