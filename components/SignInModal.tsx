'use client';

import { motion, AnimatePresence } from 'motion/react';
import { signIn } from 'next-auth/react';
import { X, Chrome, Mail, ArrowRight } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#0a0a0a] border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl relative"
            >
            <button 
              onClick={onClose}
              className="absolute right-6 top-6 p-2 rounded-full hover:bg-zinc-900 transition-colors"
            >
              <X className="w-5 h-5 text-zinc-500" />
            </button>

            <div className="text-center mb-10 mt-4">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/5">
                <Chrome className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h2>
              <p className="text-zinc-500 font-light">Join the future of AI engineering intelligence.</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => signIn('google')}
                className="w-full group bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all active:scale-[0.98]"
              >
                <Chrome className="w-5 h-5" />
                Sign in with Google
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                disabled
                className="w-full bg-zinc-900/50 text-zinc-500 py-4 rounded-2xl font-medium flex items-center justify-center gap-3 cursor-not-allowed border border-white/5"
              >
                <Mail className="w-5 h-5 opacity-50" />
                Continue with Email
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-zinc-900 text-center">
              <p className="text-xs text-zinc-600 leading-relaxed px-4">
                By signing in, you agree to our Terms of Service and Privacy Policy. 
                Your data is securely stored and encrypted.
              </p>
            </div>
          </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
