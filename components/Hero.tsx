'use client';

import { motion } from 'motion/react';

export function Hero() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center mb-16 pt-24"
    >
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
        Architect your transition <br /> to AI Engineering.
      </h1>
      <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
        Pathfinder leverages deep intelligence to map your technical evolution. 
        Paste your resume or upload your CV to begin.
      </p>
    </motion.div>
  );
}
