'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signUp, signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkSupabaseConfig = (): boolean => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    const isMockUrl = url.includes('your-project') || url === '';
    const isMockKey = key.includes('your-anon-key') || key === '';
    
    if (isMockUrl || isMockKey) {
      setError('Supabase Configuration Missing! Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file and RESTART your dev server (npm run dev) in the terminal.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!checkSupabaseConfig()) return;
    
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Auth failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    if (!checkSupabaseConfig()) return;
    
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google auth failed');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative bg-white border-bold-3 shadow-hard-black rounded-lg p-8 max-w-md w-full"
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 border-bold bg-white text-black hover:bg-[#FF006E] hover:text-white transition-all shadow-hard-black hover:scale-110 active:scale-90"
        >
          <X size={16} />
        </button>

        <h2 className="text-3xl font-extrabold uppercase mb-6 text-black border-bold inline-block px-3 py-1 bg-[#39FF14] shadow-hard-black rotate-1">
          {isSignUp ? 'SIGN UP' : 'SIGN IN'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-extrabold uppercase text-slate-600 mb-1">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-bold rounded-lg text-black font-mono focus:scale-[1.02] focus:border-[#FF006E] outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-extrabold uppercase text-slate-600 mb-1">
              PASSWORD
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-bold rounded-lg text-black font-mono focus:scale-[1.02] focus:border-[#FF006E] outline-none transition-all"
              required
            />
          </div>

          {error && (
            <p className="text-xs font-mono font-extrabold uppercase text-white bg-[#FF6B35] border-bold p-2 text-center shadow-hard-black">
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3.5 bg-[#FF006E] text-white font-mono font-extrabold text-sm uppercase rounded-lg border-bold shadow-hard-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : isSignUp ? 'CREATE ACCOUNT' : 'SECURE SIGN IN'}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-black"></div>
          </div>
          <span className="relative px-3 bg-white font-mono font-extrabold text-xs uppercase text-slate-500">
            OR CLASH WITH SOCIAL
          </span>
        </div>

        <button
          onClick={handleGoogle}
          className="w-full px-6 py-3.5 border-bold bg-white text-black font-mono font-extrabold text-sm uppercase rounded-lg shadow-hard-black hover:scale-105 hover:bg-[#0096FF] hover:text-white active:scale-95 transition-all"
        >
          🔑 SIGN IN WITH GOOGLE
        </button>

        <p className="text-center mt-6 text-xs font-mono font-extrabold uppercase text-black">
          {isSignUp ? 'ALREADY REGISTERED?' : 'NEW TO THE BUILDER?'}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-2 text-[#FF006E] hover:underline font-extrabold"
          >
            {isSignUp ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
}
