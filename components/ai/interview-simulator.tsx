'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Zap, Target, CheckCircle2, MessageSquare, Mic, MicOff } from 'lucide-react';
import { InterviewState, InterviewEvaluation } from '@/types/interview';

interface InterviewSimulatorProps {
  skillName: string;
}

export function InterviewSimulator({ skillName }: InterviewSimulatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<InterviewState>({
    status: 'idle',
    question: null,
    evaluation: null,
    error: null,
  });
  const [answer, setAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            setAnswer(prev => prev + event.results[i][0].transcript + ' ');
          }
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          // Restart if it stopped unexpectedly while still supposed to be listening
          recognitionRef.current.start();
        }
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setAnswer(''); // Optional: clear answer when starting fresh voice recording
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const startInterview = async () => {
    setState({ ...state, status: 'loading_question', error: null });
    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill: skillName, type: 'generate' }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setState({ ...state, status: 'answering', question: data.question });
    } catch (err: any) {
      setState({ ...state, status: 'idle', error: err.message });
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setState({ ...state, status: 'evaluating', error: null });
    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          skill: skillName, 
          question: state.question, 
          answer, 
          type: 'evaluate' 
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setState({ ...state, status: 'feedback', evaluation: data });
    } catch (err: any) {
      setState({ ...state, status: 'answering', error: err.message });
    }
  };

  const reset = () => {
    setAnswer('');
    setState({
      status: 'idle',
      question: null,
      evaluation: null,
      error: null,
    });
    if (isListening) {
      setIsListening(false);
      recognitionRef.current?.stop();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) reset();
    }}>
      <DialogTrigger render={
        <Button variant="outline" size="sm" className="bg-zinc-950 border-zinc-800 hover:bg-zinc-900 text-zinc-400 gap-2 h-8">
          <Zap className="w-3 h-3" />
          Practice Interview
        </Button>
      } />
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-zinc-400 uppercase tracking-widest text-xs font-bold">
            <Target className="w-4 h-4" />
            AI Interview Simulator: {skillName}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 min-h-[300px] flex flex-col">
          <AnimatePresence mode="wait">
            {state.status === 'idle' && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center flex-1 gap-4"
              >
                <div className="p-4 bg-zinc-900 rounded-full">
                  <MessageSquare className="w-8 h-8 text-zinc-500" />
                </div>
                <p className="text-zinc-400 text-center max-w-md">
                  Ready to test your knowledge in {skillName}? Gemini will generate a senior-level technical question for you.
                </p>
                <Button onClick={startInterview} className="bg-white text-black hover:bg-zinc-200 rounded-full px-8">
                  Begin Session
                </Button>
              </motion.div>
            )}

            {state.status === 'loading_question' && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center flex-1 gap-4"
              >
                <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
                <p className="text-zinc-500 animate-pulse">Generating technical challenge...</p>
              </motion.div>
            )}

            {state.status === 'answering' && (
              <motion.div 
                key="answering"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6 flex-1"
              >
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold">Question</span>
                  <p className="text-xl font-light leading-relaxed text-zinc-200">
                    {state.question}
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <Textarea 
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your technical response here, or use the microphone to speak..."
                      className={`min-h-[150px] bg-zinc-900/50 text-zinc-300 focus:border-zinc-600 transition-all ${isListening ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-zinc-800'}`}
                    />
                    {isListening && (
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold">Listening</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="outline" 
                      onClick={toggleListen}
                      className={`gap-2 rounded-full border ${isListening ? 'bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      {isListening ? 'Stop Recording' : 'Voice Input'}
                    </Button>
                    <div className="flex justify-end gap-3">
                      <Button variant="ghost" onClick={reset} className="text-zinc-500 hover:text-white">Cancel</Button>
                      <Button 
                        onClick={submitAnswer} 
                        disabled={!answer.trim() || isListening}
                        className="bg-white text-black hover:bg-zinc-200 rounded-full"
                      >
                        Submit Answer
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {state.status === 'evaluating' && (
              <motion.div 
                key="evaluating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center flex-1 gap-4"
              >
                <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
                <p className="text-zinc-500 animate-pulse">Evaluating your response...</p>
              </motion.div>
            )}

            {state.status === 'feedback' && state.evaluation && (
              <motion.div 
                key="feedback"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 flex-1"
              >
                <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-2 border-zinc-800 flex items-center justify-center text-xl font-bold">
                      {state.evaluation.score}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Interview Score</p>
                      <p className="text-xs text-zinc-500">Based on technical accuracy</p>
                    </div>
                  </div>
                  <CheckCircle2 className={`w-6 h-6 ${state.evaluation.score >= 7 ? 'text-green-500' : 'text-zinc-500'}`} />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold">Critique</span>
                  <p className="text-sm text-zinc-400 leading-relaxed italic">
                    "{state.evaluation.critique}"
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold">Model Answer</span>
                  <div className="p-4 bg-zinc-900 rounded-xl text-sm text-zinc-300 leading-relaxed border border-zinc-800/50">
                    {state.evaluation.perfectAnswer}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="ghost" onClick={reset} className="text-zinc-500 hover:text-white">Try Another</Button>
                  <Button onClick={() => setIsOpen(false)} className="bg-white text-black hover:bg-zinc-200 rounded-full">
                    Done
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
