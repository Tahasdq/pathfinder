'use client';

import { motion } from 'motion/react';
import { Sparkles, Brain, Cpu, BarChart, Lock } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useSession } from 'next-auth/react';
import { ResultsDashboard } from '@/components/ResultsDashboard';

export default function IntelligencePage() {
  const { data: session, status } = useSession();
  const setSignInModalOpen = useAppStore(state => state.setSignInModalOpen);
  const result = useAppStore((state) => state.strategyResult);

  if (status === "loading") return <main className="min-h-screen bg-[#050505]" />;

  if (!session) {
    return (
      <main className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col items-center justify-center text-center px-6">
        <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-8 border border-zinc-800">
          <Lock className="w-10 h-10 text-zinc-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Intelligence Locked</h1>
        <p className="text-zinc-500 max-w-md mb-8">
          You must be signed in to view your career intelligence and skill radar.
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
  
  const defaultInsights = [
    { title: "Market Trends", desc: "AI Engineering demand has increased by 45% YoY in GCP ecosystems.", icon: BarChart },
    { title: "Core Skills", desc: "Python, PyTorch, and Vertex AI are the most sought-after skills.", icon: Brain },
    { title: "Infrastructure", desc: "Shift towards serverless inference and RAG architectures.", icon: Cpu },
  ];

  // Derive personalized insights if result exists
  const insights = result ? [
    { 
      title: "Your Target Edge", 
      desc: `Focusing on ${result.skillGap[0]?.skill || 'AI'} gives you a 60% higher chance in technical architect roles.`, 
      icon: BarChart 
    },
    { 
      title: "Skill Priority", 
      desc: `Your primary gap is in ${result.skillGap.find(g => g.gap > 5)?.skill || 'Advanced AI'}. Mastering this is your key milestone.`, 
      icon: Brain 
    },
    { 
      title: "Stack Strategy", 
      desc: `Utilizing ${result.cloudStack[0]?.service || 'Vertex AI'} aligns with current high-growth serverless patterns.`, 
      icon: Cpu 
    },
  ] : defaultInsights;

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 pb-24">
      <div className="max-w-4xl mx-auto px-6 pt-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-4 text-zinc-500 uppercase tracking-widest text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>{result ? "Personalized Strategy" : "Market Intelligence"}</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            {result ? "Your Career Intelligence." : "AI Industry Intelligence."}
          </h1>
          <p className="text-zinc-500 text-lg font-light leading-relaxed max-w-2xl">
            {result 
              ? "Custom intelligence synthesized from your professional profile and target AI trajectory."
              : "Real-time insights into the AI Engineering landscape, curated for technical architects."
            }
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {insights.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0a0a0a] border border-zinc-800 p-8 rounded-2xl group hover:border-zinc-700 transition-all"
            >
              <item.icon className="w-8 h-8 mb-4 text-white group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-medium mb-2">{item.title}</h3>
              <p className="text-zinc-500 text-sm font-light leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ResultsDashboard result={result} loading={false} />
          </motion.div>
        )}
      </div>
    </main>
  );
}
