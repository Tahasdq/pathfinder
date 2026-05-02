'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Target, Layers, Cloud, Zap, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { Mermaid } from './Mermaid';
import { SkillRadar } from './SkillRadar';
import { Button } from '@/components/ui/button';

export interface StrategyResult {
  _id?: string;
  isActive?: boolean;
  createdAt?: string;
  skillGap: { skill: string; current: string; required: string; gap: number }[];
  radarData: { skill: string; current: number; required: number }[];
  mermaidDiagram: string;
  roadmap: { milestone: string; duration: string; details: string[] }[];
  cloudStack: { service: string; role: string; useCase: string }[];
}

interface ResultsDashboardProps {
  result: StrategyResult | null;
  loading: boolean;
}

import { useAppStore } from '@/lib/store';
import { Calendar } from 'lucide-react';

export function ResultsDashboard({ result, loading }: ResultsDashboardProps) {
  const clearResult = useAppStore(state => state.clearResult);

  return (
    <AnimatePresence>
      {result && (
        <div className="space-y-12 mt-12">
          {result.isActive && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full w-fit"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Active Career Path</span>
              {result.createdAt && (
                <span className="text-[10px] text-zinc-600 font-mono border-l border-zinc-800 pl-3 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(result.createdAt).toLocaleDateString()}
                </span>
              )}
            </motion.div>
          )}
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold tracking-tight">Your Transition Strategy</h2>
            <div className="flex gap-4">
              <button 
                onClick={clearResult}
                className="bg-zinc-950 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                Generate New
              </button>
              <button 
                onClick={() => {
                  if (!result) return;
                  const md = `# AI Engineering Transition Strategy\n\n## Technical Architecture\n\`\`\`mermaid\n${result.mermaidDiagram}\n\`\`\`\n\n## Skill Gap Analysis\n${result.skillGap.map(g => `- **${g.skill}**: ${g.current} ➡️ ${g.required} (Gap: ${g.gap}/10)`).join('\n')}\n\n## Learning Roadmap\n${result.roadmap.map(r => `### ${r.milestone} (${r.duration})\n${r.details.map(d => `- ${d}`).join('\n')}`).join('\n\n')}\n\n## Google Cloud Stack\n${result.cloudStack.map(c => `- **${c.service}** (${c.role}): ${c.useCase}`).join('\n')}`;
                  navigator.clipboard.writeText(md);
                  alert("Strategy copied to clipboard as Markdown!");
                }}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                Export as Markdown
              </button>
            </div>
          </div>
          {/* Visual Intelligence Section */}
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Technical Architecture</h3>
              <Mermaid chart={result.mermaidDiagram} />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Skill Proficiency Radar</h3>
              <SkillRadar data={result.radarData || []} />
            </div>
          </div>

          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Skill Gap Map */}
            <div className="col-span-full md:col-span-2 lg:col-span-1 space-y-6">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-white" />
              <h3 className="text-lg font-medium">Skill Gap Analysis</h3>
            </div>
            <div className="space-y-4">
              {result.skillGap?.map((gap, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="bg-[#0a0a0a] border border-zinc-800 p-4 rounded-xl"
                >
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-sm text-zinc-500 uppercase tracking-tighter font-bold">{gap.skill}</p>
                      <p className="text-lg font-light">{gap.required}</p>
                    </div>
                    <span className="text-xs font-mono text-zinc-600">Gap: {gap.gap}/10</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden mb-4">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(gap.gap / 10) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      className="h-full bg-white opacity-40"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/prepare?skill=${encodeURIComponent(gap.skill)}`}>
                      <Button variant="outline" size="sm" className="bg-zinc-950 border-zinc-800 hover:bg-zinc-900 text-zinc-400 gap-2 h-8">
                        <Zap className="w-3 h-3" />
                        Prepare
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Roadmap */}
          <div className="col-span-full md:col-span-2 lg:col-span-1 space-y-6">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-white" />
              <h3 className="text-lg font-medium">Learning Roadmap</h3>
            </div>
            <div className="relative space-y-8">
              {result.roadmap?.map((milestone, i) => (
                <div key={i} className="relative pl-8 border-l border-zinc-900 pb-2">
                  <div className="absolute left-[-5px] top-0 w-[10px] h-[10px] rounded-full bg-zinc-700"></div>
                  <p className="text-sm text-zinc-500 font-mono mb-1">{milestone.duration}</p>
                  <h4 className="font-medium text-white mb-2">{milestone.milestone}</h4>
                  <ul className="space-y-2">
                    {milestone.details?.map((detail, di) => (
                      <li key={di} className="text-sm text-zinc-500 font-light flex gap-2">
                        <ChevronRight className="w-4 h-4 text-zinc-800 shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Cloud Architecture */}
          <div className="col-span-full md:col-span-2 lg:col-span-1 space-y-6">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-white" />
              <h3 className="text-lg font-medium">Google Cloud Stack</h3>
            </div>
            <div className="space-y-4">
              {result.cloudStack?.map((cloud, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#0a0a0a] border border-zinc-800 p-5 rounded-xl group transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-zinc-900 rounded-lg group-hover:bg-white group-hover:text-black transition-colors">
                      <Zap className="w-4 h-4" />
                    </div>
                    <h4 className="font-semibold text-white">{cloud.service}</h4>
                  </div>
                  <p className="text-xs text-zinc-600 font-mono mb-2 uppercase tracking-widest">{cloud.role}</p>
                  <p className="text-sm text-zinc-400 font-light leading-relaxed">{cloud.useCase}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}
    </AnimatePresence>
  );
}
