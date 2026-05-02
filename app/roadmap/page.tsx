'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, Flag, Rocket, CheckCircle2, AlertCircle, Calendar, Lock } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function RoadmapPage() {
  const { data: session, status } = useSession();
  const setSignInModalOpen = useAppStore(state => state.setSignInModalOpen);
  const [mounted, setMounted] = useState(false);
  const { strategyResult: result, completedRoadmapTasks, toggleRoadmapTask } = useAppStore();

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
        <h1 className="text-4xl font-bold tracking-tight mb-4">Roadmap Locked</h1>
        <p className="text-zinc-500 max-w-md mb-8">
          You must be signed in to view your career progression roadmap.
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

  const steps = result?.roadmap || [];

  if (steps.length === 0) {
    return (
      <main className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col items-center justify-center">
        <AlertCircle className="w-12 h-12 text-zinc-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Strategy Generated</h2>
        <p className="text-zinc-500 mb-6">You need to generate an AI strategy first to view your custom roadmap.</p>
        <Link href="/">
          <span className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-zinc-200 transition-colors">
            Generate Strategy
          </span>
        </Link>
      </main>
    );
  }

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
            <Target className="w-4 h-4" />
            <span>Strategic Path</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-6">Evolution Roadmap.</h1>
          <p className="text-zinc-500 text-lg font-light leading-relaxed max-w-2xl">
            A structured journey from traditional engineering to AI architecture. Click on tasks to mark them as complete.
          </p>
        </motion.div>

        <div className="space-y-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative pl-12 border-l border-zinc-900"
            >
              <div className={`absolute left-[-17px] top-0 p-2 rounded-full border border-zinc-900 transition-colors duration-500 ${i === 0 ? 'bg-white text-black' : 'bg-black text-zinc-500'}`}>
                {i === 0 ? <CheckCircle2 className="w-4 h-4" /> : <Rocket className="w-4 h-4" />}
              </div>
              
              <span className="text-sm font-mono text-zinc-600 uppercase tracking-widest">{step.duration}</span>
              <h3 className="text-2xl font-medium mt-2 mb-4">{step.milestone}</h3>
              
              <div className="flex flex-wrap gap-3">
                {step.details?.map((task, ti) => {
                  const taskId = `${i}-${ti}-${task.substring(0, 10)}`;
                  const isCompleted = completedRoadmapTasks.includes(taskId);
                  return (
                    <button 
                      key={ti} 
                      onClick={() => toggleRoadmapTask(taskId)}
                      className={`px-4 py-2 rounded-full border transition-all flex items-center gap-2 text-sm ${
                        isCompleted 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                        : 'bg-[#0a0a0a] border-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                      {task}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
