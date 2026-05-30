'use client';

import { Compass, LogOut, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useSession, signOut } from "next-auth/react";
import { SignInModal } from './SignInModal';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { useEffect } from 'react';

export function Navbar() {
  const { data: session, status } = useSession();
  const isSignInModalOpen = useAppStore((state) => state.isSignInModalOpen);
  const setSignInModalOpen = useAppStore((state) => state.setSignInModalOpen);
  useEffect(() => {
  if (session) {
    setSignInModalOpen(false); // Close immediately when session exists
  }
}, [session, setSignInModalOpen]);

  
  return (
    <>
      <nav className="border-b border-zinc-900 px-6 py-4 backdrop-blur-md sticky top-0 z-50 bg-[#050505]/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Compass className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
            <span className="font-medium tracking-tighter text-xl">PATHFINDER AI</span>
          </Link>
          <div className="hidden md:flex gap-8 text-zinc-500 text-sm font-medium">
            <Link href="/intelligence" className="hover:text-white transition-colors relative group">
              Intelligence
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/interview" className="hover:text-white transition-colors relative group">
              Interview
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/architecture" className="hover:text-white transition-colors relative group">
              Architecture
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/roadmap" className="hover:text-white transition-colors relative group">
              Roadmap
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/archives" className="hover:text-white transition-colors relative group">
              Archives
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full"></span>
            </Link>
            
            <div className="pl-4 border-l border-zinc-800 flex items-center gap-4">
              {status === "loading" ? (
                <div className="w-8 h-8 rounded-full bg-zinc-900 animate-pulse"></div>
              ) : session?.user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-white/5 rounded-full shadow-inner">
                    {session.user.image ? (
                      <img src={session.user.image} alt="Avatar" className="w-6 h-6 rounded-full border border-zinc-700" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                        <User className="w-3 h-3 text-zinc-400" />
                      </div>
                    )}
                    <span className="text-xs font-semibold text-zinc-300 max-w-[100px] truncate">
                      {session.user.name?.split(' ')[0]}
                    </span>
                  </div>
                  <button 
                    onClick={() => signOut()} 
                    className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-full transition-all"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setSignInModalOpen(true)} 
                  className="text-xs px-5 py-2 rounded-full bg-white text-black hover:bg-zinc-200 transition-all font-bold active:scale-95"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <SignInModal isOpen={isSignInModalOpen} onClose={() => setSignInModalOpen(false)} />
    </>
  );
}
