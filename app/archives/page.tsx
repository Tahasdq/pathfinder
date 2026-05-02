'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSession } from 'next-auth/react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { Activity, Database, Lock, Search, Target, CheckCircle2, ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';

interface SessionData {
  _id: string;
  skill: string;
  score: number;
  critique: string;
  question: string;
  createdAt: string;
}

interface StrategyData {
  _id: string;
  title?: string;
  isActive: boolean;
  skillGap: any[];
  createdAt: string;
}

import { useAppStore } from '@/lib/store';

export default function ArchivesPage() {
  const { data: session, status } = useSession();
  const setStrategyResult = useAppStore(state => state.setStrategyResult);
  const [history, setHistory] = useState<SessionData[]>([]);
  const [strategies, setStrategies] = useState<StrategyData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!session) return;
    try {
      const [histRes, stratRes] = await Promise.all([
        fetch('/api/interview/history'),
        fetch('/api/strategy/history')
      ]);
      const histData = await histRes.json();
      const stratData = await stratRes.json();
      
      if (Array.isArray(histData)) setHistory([...histData].reverse());
      if (Array.isArray(stratData)) setStrategies(stratData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [session, status]);

  const activateStrategy = async (id: string) => {
    // Optimistic UI Update: Instantly show the user which path is now active
    setStrategies(prev => prev.map(strat => ({
      ...strat,
      isActive: strat._id === id
    })));

    try {
      const res = await fetch('/api/strategy/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategyId: id })
      });
      const updatedStrategy = await res.json();
      
      if (updatedStrategy && !updatedStrategy.error) {
        setStrategyResult(updatedStrategy); // Update the global store immediately
      }
      
      fetchData(); // Refresh list to ensure sync
    } catch (err) {
      console.error(err);
      fetchData(); // Revert on error
    }
  };

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-[#050505] pt-32 pb-24 px-6 flex justify-center items-center">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-[#050505] text-zinc-100 pt-32 pb-24 px-6 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-8 border border-zinc-800">
          <Lock className="w-10 h-10 text-zinc-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Archives Locked</h1>
        <p className="text-zinc-500 max-w-md mb-8">
          You must be signed in to view your Command Center and track your Readiness Score over time.
        </p>
      </main>
    );
  }

  const chartData = history.map((item, index) => ({
    name: `S${index + 1}`,
    score: item.score,
    date: new Date(item.createdAt).toLocaleDateString(),
    skill: item.skill
  }));

  const averageScore = history.length > 0 
    ? (history.reduce((acc, curr) => acc + curr.score, 0) / history.length).toFixed(1)
    : "0.0";

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 pb-24">
      <div className="max-w-6xl mx-auto px-6 pt-24">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6 text-emerald-500 font-mono text-xs uppercase tracking-[0.3em]">
            <Database className="w-4 h-4" />
            <span>Command Center</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            Your Intelligence Archives.
          </h1>
          <p className="text-zinc-500 text-xl font-light max-w-2xl">
            Track your Readiness Score trajectory and manage your career path versions.
          </p>
        </motion.div>

        {history.length === 0 && strategies.length === 0 ? (
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-16 text-center border-dashed">
            <Search className="w-12 h-12 text-zinc-600 mx-auto mb-6" />
            <h3 className="text-xl font-medium mb-2 text-white">No Archives Found</h3>
            <p className="text-zinc-500 max-w-sm mx-auto mb-8">
              You haven't generated any strategies or completed interviews yet.
            </p>
            <Link 
              href="/"
              className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-colors"
            >
              Start Your Path
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Top Row: Chart & Sessions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chart Section */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-2 bg-[#0a0a0a] border border-zinc-800 rounded-3xl p-8"
              >
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h3 className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-2">Trajectory</h3>
                    <p className="text-2xl font-semibold">Readiness Score</p>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-500 text-sm mb-1">Average</p>
                    <p className="text-4xl font-black text-emerald-500">{averageScore}</p>
                  </div>
                </div>
                
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#71717a', fontSize: 12 }} 
                        dy={10}
                      />
                      <YAxis 
                        domain={[0, 10]} 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#71717a', fontSize: 12 }} 
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                        itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                        labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorScore)" 
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Recent Sessions List */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1 bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 flex flex-col max-h-[440px]"
              >
                <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  Session Logs
                </h3>
                <div className="overflow-y-auto pr-2 space-y-4 flex-1 custom-scrollbar">
                  {history.length > 0 ? [...history].reverse().map((session, i) => (
                    <div key={session._id} className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800 group hover:border-zinc-700 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono text-zinc-500">{new Date(session.createdAt).toLocaleDateString()}</span>
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                          {session.score}/10
                        </span>
                      </div>
                      <p className="font-medium text-sm text-white mb-2">{session.skill}</p>
                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                        {session.critique.replace('FEEDBACK: ', '')}
                      </p>
                    </div>
                  )) : (
                    <div className="text-center py-12 text-zinc-600 text-sm italic">
                      No interviews recorded.
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Bottom Section: Strategy Management */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Target className="w-6 h-6 text-blue-500" />
                  Career Path Versions
                </h2>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{strategies.length} Paths Saved</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {strategies.map((strat, i) => (
                  <div 
                    key={strat._id}
                    className={`relative p-6 rounded-[2rem] border transition-all duration-500 ${
                      strat.isActive 
                      ? 'bg-blue-500/5 border-blue-500/30 ring-1 ring-blue-500/20' 
                      : 'bg-zinc-900/20 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {strat.isActive && (
                      <div className="absolute top-6 right-6 flex items-center gap-1.5 px-2.5 py-1 bg-blue-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse">
                        <CheckCircle2 className="w-3 h-3" />
                        Active Path
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 mb-4 text-zinc-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-mono">{new Date(strat.createdAt).toLocaleString()}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-6 line-clamp-2">
                      {strat.title || "Career Strategy"}
                    </h3>

                    <div className="space-y-4 mb-8">
                      <h4 className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Focus Areas</h4>
                      <div className="flex flex-wrap gap-2">
                        {strat.skillGap.slice(0, 3).map((g, idx) => (
                          <span key={idx} className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-md text-[10px] text-zinc-300">
                            {g.skill}
                          </span>
                        ))}
                        {strat.skillGap.length > 3 && (
                          <span className="px-2 py-1 text-[10px] text-zinc-600">+{strat.skillGap.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    {!strat.isActive ? (
                      <button 
                        onClick={() => activateStrategy(strat._id)}
                        className="w-full py-3 rounded-2xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                      >
                        Pin as Active Path
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="w-full py-3 rounded-2xl bg-blue-500/10 text-blue-400 font-bold text-sm border border-blue-500/20 flex items-center justify-center gap-2 cursor-default">
                        Following this Path
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        )}
      </div>
    </main>
  );
}
