import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, LogIn, Key, ArrowRight } from 'lucide-react';
import { DataService } from '../lib/dataService';
import { useAuth } from '../lib/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { setCustomUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');

    try {
      const res = await DataService.customerLogin({ email, password });
      if (res?.authenticated && res?.user) {
        setCustomUser(res.user);
        onClose();
      } else {
        setError(res?.error || 'Invalid credentials.');
      }
    } catch (err: any) {
      setError(err?.message || err?.error || 'Invalid email or password.');
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
            className="relative bg-white w-full max-w-md p-8 sm:p-10 border border-black/10 overflow-hidden shadow-2xl"
          >
            {/* Design accents */}
            <div className="absolute top-0 right-0 w-24 h-2 bg-[#E17055]" />
            <div className="absolute top-0 right-0 w-2 h-24 bg-[#E17055]" />
            <div className="absolute bottom-0 left-0 w-24 h-2 bg-[#2D545E]" />
            <div className="absolute bottom-0 left-0 w-2 h-24 bg-[#2D545E]" />

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-1.5 mb-6">
                <div className="w-2.5 h-2.5 bg-[#2D545E]" />
                <div className="w-2.5 h-2.5 bg-[#E17055]" />
                <div className="w-2.5 h-2.5 bg-black" />
              </div>

              <h3 className="text-3xl font-display font-black tracking-tight uppercase leading-none mb-2">
                Client Portal <br/>Sign In
              </h3>
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] font-bold text-[#2D545E] mb-6">
                Access Quotations & Print Orders
              </p>

              <form onSubmit={handleEmailLogin} className="space-y-4 text-left mb-6">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">Username / Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="client@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2D545E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-500 mb-1">Password</label>
                  <div className="relative">
                    <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="Password from Welcome Email"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2D545E]"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-[11px] font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
                    {error}
                  </p>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-[#2D545E] text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] hover:bg-slate-900 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" />
                  {loading ? 'Authenticating...' : 'Sign In To Client Portal'}
                </button>
              </form>

              <p className="text-[10px] font-medium text-slate-400 leading-relaxed">
                Credentials were sent in your Print Plaza Welcome Email upon submitting a quote request.
              </p>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
