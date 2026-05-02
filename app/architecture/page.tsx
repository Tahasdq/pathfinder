'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Layers, Cloud, Zap, Shield, AlertCircle, Database, Server, Calendar, Lock } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function ArchitecturePage() {
  const { data: session, status } = useSession();
  const setSignInModalOpen = useAppStore(state => state.setSignInModalOpen);
  const [mounted, setMounted] = useState(false);
  const result = useAppStore((state) => state.strategyResult);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || status === "loading") return <main className="min-h-screen bg-[#050505]" />;

  if (!session) {
    return (
      <main className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col items-center justify-center text-center px-6">
        <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-8 border border-zinc-800">
          <Lock className="w-10 h-10 text-zinc-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Architecture Locked</h1>
        <p className="text-zinc-500 max-w-md mb-8">
          You must be signed in to view your infrastructure design.
        </p>
        <button 
          onClick={() => setSignInModalOpen(true)}
          className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-colors"
        >
          Sign In
        </button>
      </main>
    );
  }

  const components = result?.cloudStack || [];

  if (components.length === 0) {
    return (
      <main className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col items-center justify-center">
        <AlertCircle className="w-12 h-12 text-zinc-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Architecture Generated</h2>
        <p className="text-zinc-500 mb-6">You need to generate an AI strategy first to view your cloud stack.</p>
        <Link href="/">
          <span className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-zinc-200 transition-colors">
            Generate Strategy
          </span>
        </Link>
      </main>
    );
  }

  // Helper to map roles to icons dynamically since the AI generates arbitrary services
  const getIcon = (role: string) => {
    if (role.toLowerCase().includes('database') || role.toLowerCase().includes('storage')) return Database;
    if (role.toLowerCase().includes('serverless') || role.toLowerCase().includes('api')) return Zap;
    if (role.toLowerCase().includes('security') || role.toLowerCase().includes('iam')) return Shield;
    return Cloud;
  };
  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 pb-24">
      <div className="max-w-4xl mx-auto px-6 pt-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          {result?.isActive && (
            <div className="flex items-center gap-3 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full w-fit mb-8">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Active Path</span>
              {result.createdAt && (
                <span className="text-[9px] text-zinc-600 font-mono border-l border-zinc-800 pl-3 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(result.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
          <div className="flex items-center gap-2 mb-4 text-zinc-500 uppercase tracking-widest text-xs font-bold">
            <Layers className="w-4 h-4" />
            <span>Infrastructure Design</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-6">Cloud Architecture.</h1>
          <p className="text-zinc-500 text-lg font-light leading-relaxed max-w-2xl">
            Design patterns for scalable AI systems on Google Cloud Platform.
          </p>
        </motion.div>

        <div className="grid gap-8">
          {components.map((item, i) => {
            const Icon = getIcon(item.role);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 bg-[#0a0a0a] border border-zinc-800 p-8 rounded-2xl group hover:bg-[#0f0f0f] transition-all"
              >
                <div className="p-4 bg-zinc-900 rounded-xl group-hover:bg-white group-hover:text-black transition-all h-fit">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">{item.service} <span className="text-sm text-zinc-500 font-mono ml-2">({item.role})</span></h3>
                  <p className="text-zinc-500 font-light leading-relaxed">{item.useCase}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
