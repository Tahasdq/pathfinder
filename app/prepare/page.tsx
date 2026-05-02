'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  ArrowRight, 
  Brain, 
  Sparkles,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { useSession } from 'next-auth/react';

export default function PreparePage() {
  const { data: session, status } = useSession();
  const setSignInModalOpen = useAppStore(state => state.setSignInModalOpen);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const skill = searchParams.get('skill') || 'AI Engineering';
  
  const [isStarted, setIsStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [question, setQuestion] = useState('');
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [step, setStep] = useState(1); // 1: Intro, 2: Interviewing, 3: Evaluating
  
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const finalTranscriptRef = useRef('');

  if (status === "loading") return <main className="min-h-screen bg-[#050505]" />;

  if (!session) {
    return (
      <main className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col items-center justify-center text-center px-6">
        <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-8 border border-zinc-800">
          <Lock className="w-10 h-10 text-zinc-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Interview Lab Locked</h1>
        <p className="text-zinc-500 max-w-md mb-8">
          You must be signed in to access the AI Interview Simulator.
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

  // Initialize Speech Recognition
  useEffect(() => {
    if (!recognitionRef.current && typeof window !== 'undefined' && ('WebkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += event.results[i][0].transcript + ' ';
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(finalTranscriptRef.current + interimTranscript);
      };

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech Recognition Error:', event.error);
        if (event.error === 'not-allowed') {
          alert("Microphone access denied. Please enable it in your browser settings.");
        }
        setIsListening(false);
      };
    }
  }, []);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        // We do NOT auto-start listening anymore to prevent InvalidState errors
        // The user must click the mic button
      };
      synthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err: any) {
        console.error("Failed to start recognition:", err);
      }
    }
  };

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill, type: 'generate', difficulty: 'easy' }),
      });
      const data = await res.json();
      setQuestion(data.question);
      setStep(2);
      speak(data.question);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!transcript) return;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setLoading(true);
    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          skill, 
          question, 
          answer: transcript, 
          type: 'evaluate' 
        }),
      });
      const data = await res.json();
      setEvaluation(data);
      setStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent)] pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="absolute top-12 left-12 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-mono uppercase tracking-widest">Exit Preparation</span>
      </button>

      <div className="w-full max-w-4xl relative z-10">
        <AnimatePresence mode="wait">
          {/* STEP 1: INTRO */}
          {step === 1 && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="flex justify-center mb-8">
                <div className="p-6 bg-zinc-900 rounded-[2.5rem] border border-white/5 relative group">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Brain className="w-16 h-16 text-white relative z-10" />
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="text-6xl font-bold tracking-tighter bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                  AI Engineering <br />Mock Interview.
                </h1>
                <p className="text-zinc-500 text-xl font-light max-w-xl mx-auto leading-relaxed">
                  You are preparing for <span className="text-white font-medium">{skill}</span>. 
                  The AI will ask a technical question, listen to your verbal response, and provide a senior-level evaluation.
                </p>
              </div>
              <Button 
                onClick={fetchQuestion}
                disabled={loading}
                className="bg-white text-black px-12 py-8 rounded-[2rem] text-lg font-bold hover:bg-zinc-200 transition-all group"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    Enter Simulation
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {/* STEP 2: INTERVIEWING */}
          {step === 2 && (
            <motion.div 
              key="interview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-12"
            >
              <div className="bg-zinc-900/30 border border-white/5 backdrop-blur-xl rounded-[3rem] p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isSpeaking ? 'bg-blue-500 text-white' : isListening ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                    {isSpeaking ? 'AI is Speaking' : isListening ? 'AI is Listening' : 'Waiting'}
                  </div>
                </div>

                <div className="space-y-6">
                  <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">Interviewer</span>
                  <h2 className="text-3xl font-medium leading-tight text-white/90">
                    {question}
                  </h2>
                </div>

                {/* Animated Waveform (CSS only) */}
                <div className="flex items-center justify-center gap-1.5 h-24 my-12">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={isListening || isSpeaking ? {
                        height: [20, Math.random() * 60 + 20, 20],
                      } : { height: 4 }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.5,
                        delay: i * 0.05
                      }}
                      className={`w-1 rounded-full ${isSpeaking ? 'bg-blue-500' : isListening ? 'bg-emerald-500' : 'bg-zinc-800'}`}
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-600 uppercase tracking-widest">
                    <span>Your Response</span>
                    {isListening && <span className="text-emerald-500 animate-pulse">Live Transcription Active</span>}
                  </div>
                  <div className="min-h-[100px] p-6 bg-black/40 rounded-2xl border border-white/5 text-xl font-light leading-relaxed text-zinc-400 italic">
                    {transcript || "Waiting for your response..."}
                  </div>
                </div>

                <div className="mt-12 flex justify-center gap-6">
                  <Button 
                    onClick={toggleListening}
                    variant="outline"
                    className="rounded-full w-20 h-20 p-0 border-zinc-800 hover:bg-zinc-800 transition-colors"
                  >
                    {isListening ? (
                      <Mic className="w-8 h-8 text-red-500 animate-pulse" />
                    ) : (
                      <MicOff className="w-8 h-8 text-zinc-500" />
                    )}
                  </Button>
                  <Button 
                    onClick={submitAnswer}
                    disabled={!transcript || loading}
                    className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-zinc-200"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Finish Response"}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: EVALUATION */}
          {step === 3 && evaluation && (
            <motion.div 
              key="evaluation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                  <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-10 space-y-6">
                    <div className="flex items-center gap-2 text-emerald-500 text-xs font-mono uppercase tracking-widest">
                      <Sparkles className="w-4 h-4" />
                      <span>Coach Feedback</span>
                    </div>
                    <p className="text-xl font-light leading-relaxed text-zinc-300">
                      {evaluation.critique}
                    </p>
                  </div>

                  <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-10 space-y-6">
                    <div className="flex items-center gap-2 text-blue-500 text-xs font-mono uppercase tracking-widest">
                      <ArrowRight className="w-4 h-4" />
                      <span>Next Challenge</span>
                    </div>
                    <div className="text-zinc-400 font-light leading-relaxed whitespace-pre-wrap">
                      {evaluation.perfectAnswer}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-10 text-center flex flex-col items-center justify-center aspect-square">
                    <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold mb-4">Final Score</span>
                    <h3 className="text-8xl font-black text-white">{evaluation.score}</h3>
                    <span className="text-zinc-600 text-xs uppercase tracking-widest mt-2">Out of 10</span>
                  </div>

                  <Button 
                    onClick={() => {
                      const nextQ = evaluation.perfectAnswer;
                      setQuestion(nextQ);
                      finalTranscriptRef.current = '';
                      setTranscript('');
                      setEvaluation(null);
                      setStep(2);
                      setTimeout(() => speak(nextQ), 500);
                    }}
                    className="w-full bg-white text-black py-8 rounded-[2rem] font-bold text-lg hover:bg-zinc-200"
                  >
                    Accept Challenge
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => router.push('/interview')}
                    className="w-full text-zinc-500 hover:text-white"
                  >
                    Finish Session
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
