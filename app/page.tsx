'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAppStore } from '@/lib/store';
import { Hero } from '@/components/Hero';
import { InputSection } from '@/components/InputSection';
import { ResultsDashboard, type StrategyResult } from '@/components/ResultsDashboard';
import { SkeletonResults } from '@/components/SkeletonResults';

export default function PathfinderPage() {
  const [loading, setLoading] = useState(false);
  // Prevent hydration mismatch by only reading store after mount
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const result = useAppStore((state) => state.strategyResult);
  const setStrategyResult = useAppStore((state) => state.setStrategyResult);
  
  useEffect(() => {
    setMounted(true);
    
    // Always fetch latest pinned strategy on mount to stay in sync with Archives
    if (session) {
      fetch('/api/strategy')
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setStrategyResult(data);
          }
        })
        .catch(err => console.error('Failed to sync strategy:', err));
    }
  }, [session, setStrategyResult]);

  if (!mounted) return <main className="min-h-screen bg-[#050505]" />;

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-zinc-800 selection:text-white pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <Hero />
        
        <InputSection 
          setLoading={setLoading} 
          loading={loading} 
        />

        {loading && <SkeletonResults />}

        {!loading && result && (
          <div id="results-section">
            <ResultsDashboard 
              result={result} 
              loading={loading} 
            />
          </div>
        )}

        {!result && !loading && (
          <div className="flex justify-center gap-12 mt-32 border-t border-zinc-900 pt-12">
            <div className="text-center">
              <p className="text-3xl font-bold bg-gradient-to-b from-white to-zinc-800 bg-clip-text text-transparent">Gemini 1.5</p>
              <p className="text-zinc-600 text-xs uppercase tracking-widest mt-2">Next-Gen Logic</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold bg-gradient-to-b from-white to-zinc-800 bg-clip-text text-transparent">256k+</p>
              <p className="text-zinc-600 text-xs uppercase tracking-widest mt-2">Context Tokens</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold bg-gradient-to-b from-white to-zinc-800 bg-clip-text text-transparent">GCP Native</p>
              <p className="text-zinc-600 text-xs uppercase tracking-widest mt-2">Architecture Ready</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
