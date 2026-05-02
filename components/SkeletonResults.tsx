'use client';

import { motion } from 'motion/react';

export function SkeletonResults() {
  return (
    <div className="space-y-12 mt-12 animate-pulse">
      {/* Visual Intelligence Section Skeleton */}
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-6 w-48 bg-zinc-900 rounded-lg"></div>
          <div className="h-[300px] w-full bg-[#0a0a0a] rounded-2xl border border-zinc-900"></div>
        </div>
        <div className="space-y-4">
          <div className="h-6 w-48 bg-zinc-900 rounded-lg"></div>
          <div className="h-[300px] w-full bg-[#0a0a0a] rounded-2xl border border-zinc-900"></div>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-6">
            <div className="h-6 w-32 bg-zinc-900 rounded-lg"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-24 w-full bg-[#0a0a0a] border border-zinc-900 rounded-xl"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
