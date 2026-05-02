'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'inherit',
});

export function Mermaid({ chart }: { chart: string }) {
  const [svg, setSvg] = useState('');
  const id = useRef(`mermaid-${Math.floor(Math.random() * 10000)}`);

  useEffect(() => {
    if (chart) {
      mermaid.render(id.current, chart).then(({ svg }) => {
        setSvg(svg);
      }).catch((err) => {
        console.error("Mermaid Render Error:", err);
      });
    }
  }, [chart]);

  if (!chart) return null;

  return (
    <div 
      className="bg-[#0a0a0a] p-6 rounded-2xl border border-zinc-800 flex justify-center overflow-hidden min-h-[200px]" 
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
