'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mic, History, Award, BookOpen, Star, ChevronRight, Clock, MessageSquare } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function InterviewPage() {
  const { data: session } = useSession();
  const result = useAppStore((state) => state.strategyResult);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch('/api/interview/history')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setHistory(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [session]);

  const averageScore = history.length > 0 
    ? (history.reduce((acc, curr) => acc + curr.score, 0) / history.length).toFixed(1)
    : "0.0";

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 pb-24">
      <div className="max-w-6xl mx-auto px-6 pt-32">
        
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3 mb-6 text-emerald-500 font-mono text-xs uppercase tracking-[0.3em]">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>Live Interview Coach Active</span>
            </div>
            <h1 className="text-6xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              Practice for the <br />Future of AI.
            </h1>
            <p className="text-zinc-500 text-xl font-light leading-relaxed max-w-xl">
              Simulate high-stakes technical interviews with our fine-tuned AI agent. 
              Get real-time critique on your architecture logic and communication style.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900/30 border border-white/5 rounded-[2rem] p-8 backdrop-blur-xl flex flex-col justify-center items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-20">
              <Star className="w-12 h-12 text-emerald-500" />
            </div>
            <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold mb-2">Your Readiness Score</p>
            <h2 className="text-8xl font-black text-white mb-2">{averageScore}</h2>
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <Award className="w-4 h-4 text-emerald-500" />
              <span>Based on {history.length} sessions</span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* History Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-zinc-500" />
                <h3 className="text-xl font-medium">Practice History</h3>
              </div>
              {history.length > 0 && (
                <span className="text-xs text-zinc-600 font-mono">LATEST SESSIONS</span>
              )}
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 w-full bg-zinc-900/50 rounded-3xl animate-pulse"></div>
                ))}
              </div>
            ) : history.length === 0 ? (
              <div className="bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-[2rem] p-16 text-center">
                <MessageSquare className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-500 text-lg">No interview sessions found yet.</p>
                <p className="text-zinc-700 text-sm mt-1">Generate a strategy first to start practicing specific skills.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item, i) => (
                  <motion.div 
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-zinc-400 uppercase tracking-widest border border-white/5">
                            {item.skill}
                          </span>
                          <div className="flex items-center gap-1.5 text-zinc-600 text-[10px] font-mono uppercase">
                            <Clock className="w-3 h-3" />
                            {new Date(item.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <h4 className="text-white font-medium text-lg mb-2 group-hover:text-emerald-400 transition-colors leading-snug">
                          {item.question}
                        </h4>
                        <p className="text-zinc-500 text-sm line-clamp-1 font-light italic">
                          "{item.answer}"
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-white mb-1">{item.score}/10</div>
                        <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${item.score * 10}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions / Tips Column */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[2rem] p-8">
              <div className="p-4 bg-emerald-500/10 rounded-2xl w-fit mb-6 border border-emerald-500/20 text-emerald-500">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Voice Mastery</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                Our AI analyzes your verbal clarity and structure. Practice speaking clearly and using technical keywords to boost your communication score.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm text-zinc-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  Focus on "How" and "Why"
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  Use Star Method (Situation, Task...)
                </li>
                <li className="flex items-center gap-3 text-sm text-zinc-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  Mention GCP-specific services
                </li>
              </ul>
            </div>

            <Card className="bg-[#0a0a0a] border-zinc-800 rounded-[2rem] overflow-hidden group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Start New Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result?.skillGap && result.skillGap.length > 0 ? (
                    result.skillGap.map(gap => (
                      <div key={gap.skill} className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-2xl hover:bg-zinc-800/50 transition-all border border-transparent hover:border-white/5 group/item">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{gap.skill}</span>
                          <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Gap: {gap.gap}/10</span>
                        </div>
                        <Link href={`/prepare?skill=${encodeURIComponent(gap.skill)}`}>
                          <Button variant="outline" size="sm" className="bg-zinc-950 border-zinc-800 hover:bg-zinc-900 text-zinc-400 gap-2 h-8">
                            <Zap className="w-3 h-3" />
                            Prepare for Interview
                          </Button>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-600 text-xs text-center py-4">Generate a strategy to see recommended skills here.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </main>
  );
}
