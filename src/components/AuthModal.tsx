import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, LogIn } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error('Sign in failed:', error);
      setError(error instanceof Error ? error.message : 'Google sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-md p-10 border border-black/10 overflow-hidden"
          >
            {/* Design accents */}
            <div className="absolute top-0 right-0 w-24 h-2 bg-[#E17055]" />
            <div className="absolute top-0 right-0 w-2 h-24 bg-[#E17055]" />
            <div className="absolute bottom-0 left-0 w-24 h-2 bg-[#2D545E]" />
            <div className="absolute bottom-0 left-0 w-2 h-24 bg-[#2D545E]" />
            <div className="absolute inset-0 bg-grainy opacity-[0.03] pointer-events-none" />

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-1.5 mb-10">
                <div className="w-2.5 h-2.5 bg-[#2D545E]" />
                <div className="w-2.5 h-2.5 bg-[#E17055]" />
                <div className="w-2.5 h-2.5 bg-black" />
              </div>

              <h3 className="text-4xl font-display font-black tracking-tight uppercase leading-none mb-4">
                Access <br/>The Lab.
              </h3>
              <p className="text-[11px] font-mono uppercase tracking-[0.3em] font-bold text-black/40 mb-12">
                Secure Authentication Required
              </p>

              <button 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-4 bg-black text-white py-6 mb-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#2D545E] transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
              >
                <LogIn className="w-4 h-4" />
                {loading ? 'Connecting...' : 'Sign In With Google'}
              </button>

              {error && (
                <p className="mb-4 text-[10px] font-bold leading-relaxed text-red-600">
                  {error}
                </p>
              )}

              <p className="text-[10px] font-medium text-black/30 max-w-[200px] mx-auto leading-relaxed">
                By entering, you establish a secure link with our production servers.
              </p>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-black/10 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
