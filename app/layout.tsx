import type { Metadata } from 'next';
import { Inter, Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Pathfinder AI | Career Intelligence',
  description: 'Architect your transition to AI Engineering with deep career intelligence.',
};

import { Navbar } from '@/components/Navbar';
import NextAuthSessionProvider from '@/components/SessionProvider';
import { cn } from "@/lib/utils";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans dark", geist.variable)}>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <NextAuthSessionProvider>
          <Navbar />
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
