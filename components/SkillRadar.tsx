'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

interface SkillRadarProps {
  data: {
    skill: string;
    current: number;
    required: number;
  }[];
}

export function SkillRadar({ data }: SkillRadarProps) {
  return (
    <div className="h-[350px] w-full bg-[#050505] rounded-3xl border border-zinc-800/50 p-6 relative overflow-hidden group">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
      
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#18181b" strokeDasharray="3 3" />
          <PolarAngleAxis 
            dataKey="skill" 
            tick={{ fill: '#52525b', fontSize: 10, fontWeight: 500 }} 
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 10]} 
            tick={false} 
            axisLine={false} 
          />
          <Radar
            name="Target Proficiency"
            dataKey="required"
            stroke="#ffffff"
            strokeWidth={2}
            fill="#ffffff"
            fillOpacity={0.05}
            animationDuration={1500}
          />
          <Radar
            name="Current Level"
            dataKey="current"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="#3b82f6"
            fillOpacity={0.2}
            animationDuration={2000}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Required</span>
        </div>
      </div>
    </div>
  );
}
