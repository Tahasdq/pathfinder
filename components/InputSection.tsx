'use client';

import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Loader2, ArrowRight, Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ai, MODELS } from '@/lib/ai';
import { useAppStore } from '@/lib/store';
import { useSession } from 'next-auth/react';

interface InputSectionProps {
  setLoading: (loading: boolean) => void;
  loading: boolean;
}

export function InputSection({ setLoading, loading }: InputSectionProps) {
  const { data: session } = useSession();
  const setStrategyResult = useAppStore((state) => state.setStrategyResult);
  const setSignInModalOpen = useAppStore((state) => state.setSignInModalOpen);
  const [input, setInput] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadingMessage, setLoadingMessage] = useState('Analyzing Resume...');
  const [progress, setProgress] = useState(0);
  const loadingMessages = [
    'Analyzing Resume...',
    'Mapping Skill Gaps...',
    'Identifying GCP Services...',
    'Generating Roadmap...',
    'Optimizing Career Path...',
    'Finalizing Strategy...'
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    
    if (file.type === 'application/pdf') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          fullText += pageText + '\n';
        }
        
        setInput(fullText);
      } catch (err) {
        console.error("PDF Parsing Error:", err);
        alert("Failed to parse PDF. Please try copying the text manually or uploading a .txt file.");
      }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInput(text);
      };
      reader.readAsText(file);
    }
  };

  const removeFile = () => {
    setFileName(null);
    setInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const generateStrategy = async () => {
    if (!input.trim()) return;
    
    if (!session) {
      setSignInModalOpen(true);
      return;
    }
    
    setLoading(true);
    setProgress(0);
    let messageIndex = 0;
    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[messageIndex]);
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) {
          return prev + (98 - prev) * 0.1;
        }
        return prev + (100 - prev) * 0.15;
      });
    }, 800);
    
    try {
      const res = await fetch('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      // Basic validation to ensure we have required arrays
      if (!data.skillGap) data.skillGap = [];
      if (!data.radarData) data.radarData = [];
      if (!data.mermaidDiagram) data.mermaidDiagram = "";
      if (!data.roadmap) data.roadmap = [];
      if (!data.cloudStack) data.cloudStack = [];
      
      console.log("AI Data Received:", data);
      setStrategyResult(data);
      
      // Smooth scroll to results
      setTimeout(() => {
        const element = document.getElementById('results-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      
    } catch (error: any) {
      console.error("Pathfinder AI Error:", error);
      alert(error.message || "Failed to generate strategy. Please try again.");
    } finally {
      clearInterval(interval);
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="relative mb-24"
    >
      {/* Background Glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-[2.5rem] blur-3xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
      
      <Card className="relative bg-[#050505]/60 backdrop-blur-xl border-zinc-800/50 rounded-3xl shadow-2xl overflow-hidden border border-white/5 transition-all hover:border-white/10">
        <CardHeader className="flex flex-row items-center gap-3 pb-4 pt-8 px-8">
          <div className="p-2 bg-zinc-900 rounded-lg">
            <Sparkles className="w-4 h-4 text-zinc-400" />
          </div>
          <div>
            <CardTitle className="text-sm uppercase tracking-[0.2em] font-bold text-zinc-500">Professional Intelligence Input</CardTitle>
            <p className="text-zinc-600 text-xs mt-1 font-light">Supply your background to begin the AI synthesis.</p>
          </div>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          {loading ? (
            <div className="h-56 flex flex-col items-center justify-center gap-8">
              <div className="relative w-full max-w-md">
                {/* Progress Track */}
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  />
                </div>
                
                {/* Percentage Display */}
                <div className="absolute -top-8 right-0 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                  Processing: {Math.round(progress)}%
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  key={loadingMessage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-white font-medium text-lg tracking-tight"
                >
                  {loadingMessage}
                </motion.div>
                <p className="text-zinc-500 text-xs font-mono uppercase tracking-[0.2em] animate-pulse">
                  Synthesizing Intelligence
                </p>
              </div>
            </div>
          ) : !fileName ? (
            <div className="flex flex-col gap-6">
              <div className="relative group">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste your resume content or describe your current tech stack..."
                  className="w-full h-56 bg-zinc-900/30 text-zinc-200 placeholder:text-zinc-700 border-none focus-visible:ring-1 focus-visible:ring-zinc-700/50 resize-none text-lg font-light leading-relaxed p-6 rounded-2xl transition-all"
                />
                <div className="absolute bottom-4 right-4 text-[10px] font-mono text-zinc-800 uppercase tracking-widest pointer-events-none">
                  Manual Entry Mode
                </div>
              </div>
              
              <motion.div 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-4 border border-dashed border-zinc-800 bg-zinc-900/20 rounded-2xl p-10 hover:bg-zinc-900/40 hover:border-zinc-700 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex flex-col items-center gap-3 relative z-10">
                  <div className="p-4 bg-zinc-900 rounded-2xl group-hover:bg-zinc-800 transition-colors border border-zinc-800/50">
                    <Upload className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-center">
                    <span className="text-zinc-400 group-hover:text-white transition-colors block font-medium">Upload CV or Profile</span>
                    <span className="text-zinc-600 text-xs mt-1 block">Supports PDF and TXT formats</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt,.pdf"
                  className="hidden" 
                />
              </motion.div>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-md rounded-3xl p-8 flex items-center gap-6 w-full max-w-md relative group hover:border-zinc-700 transition-all"
              >
                <div className="p-4 bg-zinc-800 rounded-2xl group-hover:bg-white group-hover:text-black transition-all">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-lg truncate mb-1">{fileName}</p>
                  <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] font-bold">Document Analyzed</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={removeFile}
                  className="absolute -top-3 -right-3 bg-zinc-800 hover:bg-red-500/20 hover:text-red-500 border border-zinc-700 rounded-full w-10 h-10 transition-all"
                >
                  <X className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between items-center py-8 px-8 border-t border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Model: Gemini-3-Flash</span>
          </div>
          
          <Button
            onClick={generateStrategy}
            disabled={loading || !input.trim()}
            className="group relative flex items-center gap-3 bg-white text-black px-10 py-7 rounded-2xl font-bold transition-all hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-mono text-xs uppercase tracking-widest">{loadingMessage}</span>
              </>
            ) : (
              <>
                <span className="uppercase tracking-widest text-xs">Generate Strategy</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
            
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform pointer-events-none"></div>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
