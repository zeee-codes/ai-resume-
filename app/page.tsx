'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Bot, 
  Zap, 
  ArrowRight, 
  FileDown, 
  Layers, 
  LayoutDashboard, 
  ShieldCheck
} from 'lucide-react';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring" as const, stiffness: 200, damping: 20 } 
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col overflow-x-hidden relative">
      
      {/* Decorative Neobrutalist background grid blobs */}
      <div className="absolute top-20 right-10 w-48 h-48 bg-[#39FF14] border-bold rotate-12 -z-10 shadow-hard-black" />
      <div className="absolute bottom-40 left-10 w-36 h-36 bg-[#FF006E] border-bold -rotate-12 -z-10 shadow-hard-black" />

      {/* Main Navigation */}
      <header className="flex items-center justify-between px-6 py-6 border-b-4 border-black bg-white max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#FF006E] border-bold text-white shadow-hard-black rotate-3">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight uppercase">
              ZERO-STATE <span className="bg-[#0096FF] text-white px-2 border-bold shadow-hard-black ml-1">AI</span>
            </h1>
            <p className="text-[10px] font-mono font-extrabold uppercase text-slate-500">Stateless • Metrics-Driven • ATS Compliant</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard"
            className="hidden sm:flex items-center gap-2 px-4 py-2 border-bold text-black font-mono font-extrabold text-sm uppercase bg-[#39FF14] hover:scale-105 active:scale-95 transition-all shadow-hard-black"
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </Link>
          <Link 
            href="/app"
            className="px-6 py-2.5 bg-[#FF006E] text-white font-mono font-bold text-sm uppercase border-bold hover:scale-110 active:scale-95 transition-all shadow-hard-black"
          >
            Build Free
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-20 px-6 max-w-7xl mx-auto flex-1 flex flex-col justify-center">
        <motion.div 
          className="flex flex-col lg:flex-row gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* LEFT: Text */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div variants={itemVariants} className="inline-block bg-[#39FF14] text-black font-mono font-extrabold text-xs uppercase px-3 py-1 border-bold shadow-hard-black mb-6 rotate-2">
              ⚡ 100% Free • No Sign-up Required
            </motion.div>
            
            <motion.h1 
              variants={itemVariants} 
              className="text-5xl sm:text-6xl font-extrabold font-heading mb-6 text-black uppercase leading-tight"
            >
              Your Dream Job <br />
              <span className="bg-[#FF006E] text-white px-3 inline-block border-bold shadow-hard-black my-1 -rotate-1">Starts Here</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants} 
              className="text-lg font-mono text-black font-bold mb-10 max-w-xl mx-auto lg:mx-0 border-l-4 border-l-[#0096FF] pl-4"
            >
              An expert AI Recruiter interviews you in minutes, automatically compiles metrics using the proven X-Y-Z formula, and builds an ATS-ready PDF instantly.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link 
                href="/app" 
                className="px-8 py-4 bg-[#FF006E] text-white font-mono font-bold text-base uppercase border-bold shadow-hard-black hover:scale-110 active:scale-95 transition-all text-center"
              >
                Start AI Interview
              </Link>
              <Link 
                href="/dashboard" 
                className="px-8 py-4 border-bold text-black font-mono font-bold text-base uppercase bg-white shadow-hard-black hover:scale-110 active:scale-95 hover:bg-[#39FF14] transition-all text-center"
              >
                See Saved Resumes
              </Link>
            </motion.div>
          </div>

          {/* RIGHT: Mockup (colored card) */}
          <motion.div 
            variants={itemVariants}
            className="flex-1 w-full max-w-lg bg-[#39FF14] p-6 border-bold-3 shadow-hard-black rounded-lg transform rotate-2 hover:rotate-0 transition-transform duration-300"
          >
            <div className="bg-white p-6 border-bold rounded shadow-hard-black space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-black pb-3">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FF006E] border border-black" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#0096FF] border border-black" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#39FF14] border border-black" />
                <span className="text-[10px] font-mono font-extrabold text-slate-500 uppercase ml-auto">recruiter_mockup.json</span>
              </div>

              {/* Chat bubble AI */}
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-[#0096FF] border-bold flex-shrink-0 flex items-center justify-center text-white text-xs">AI</div>
                <div className="bg-[#F0F0F0] border-bold p-3 rounded-lg text-xs font-mono">
                  That sounds great! Can we quantify that? For example, how many users did it serve, or did it improve performance/load times?
                </div>
              </div>

              {/* Chat bubble User */}
              <div className="flex gap-2 flex-row-reverse">
                <div className="w-8 h-8 bg-[#FF006E] border-bold flex-shrink-0 flex items-center justify-center text-white text-xs">ME</div>
                <div className="bg-[#FF006E] text-white border-bold p-3 rounded-lg text-xs font-mono">
                  It served 50k monthly active users, improving load times by 40% using database indexing.
                </div>
              </div>

              {/* Real compiled item inside the mockup */}
              <div className="border-bold p-3 bg-white border-l-4 border-l-[#6A00FF]">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[10px] font-extrabold font-mono uppercase bg-[#39FF14] px-1 border border-black">PROJ_HIGHLIGHT</span>
                  <span className="text-[9px] font-mono font-bold text-slate-500">DATABASE INDEXING</span>
                </div>
                <p className="text-[10px] font-sans text-black leading-relaxed font-bold">
                  • Optimized database query structures with custom indexing, improving page load speeds by 40% and serving 50k monthly active users.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="w-full py-20 bg-[#FAFAFA] border-t-4 border-black px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold uppercase tracking-wider inline-block px-4 py-2 border-bold bg-[#FF6B35] text-white shadow-hard-black">
              DESIGNED TO BE BOLD
            </h2>
            <p className="text-sm font-mono font-extrabold text-black mt-4 uppercase">
              No compromises. No boring standard formats. Complete control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 border-bold shadow-hard-black rounded-lg border-l-8 border-l-[#FF006E]">
              <div className="w-12 h-12 bg-[#FF006E] text-white border-bold flex items-center justify-center mb-4 shadow-hard-black">
                <Bot size={24} />
              </div>
              <h3 className="text-lg font-extrabold uppercase font-heading mb-2">AI Recruiter Interview</h3>
              <p className="text-sm font-mono text-black font-bold">
                Talk to an advanced recruiter agent who guides you to craft metrics-driven statements that hiring managers look for.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 border-bold shadow-hard-black rounded-lg border-l-8 border-l-[#0096FF]">
              <div className="w-12 h-12 bg-[#0096FF] text-white border-bold flex items-center justify-center mb-4 shadow-hard-black">
                <FileDown size={24} />
              </div>
              <h3 className="text-lg font-extrabold uppercase font-heading mb-2">Instant ATS PDF</h3>
              <p className="text-sm font-mono text-black font-bold">
                Instantly download a clean, ATS-parsed, and professional PDF matching all industry-standard ATS conventions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 border-bold shadow-hard-black rounded-lg border-l-8 border-l-[#39FF14]">
              <div className="w-12 h-12 bg-[#39FF14] text-black border-bold flex items-center justify-center mb-4 shadow-hard-black">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-extrabold uppercase font-heading mb-2">Metrics-Driven</h3>
              <p className="text-sm font-mono text-black font-bold">
                Our AI uses the X-Y-Z formula to format highlights automatically: "Accomplished [X], as measured by [Y], by doing [Z]".
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 border-bold shadow-hard-black rounded-lg border-l-8 border-l-[#FF6B35]">
              <div className="w-12 h-12 bg-[#FF6B35] text-white border-bold flex items-center justify-center mb-4 shadow-hard-black">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-extrabold uppercase font-heading mb-2">Stateless Privacy</h3>
              <p className="text-sm font-mono text-black font-bold">
                Your data remains entirely on the client side. No server databases, no trackers, and no privacy compromises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="w-full py-20 px-6 max-w-7xl mx-auto text-center">
        <div className="bg-[#6A00FF] text-white p-12 border-bold-3 shadow-hard-black rounded-lg max-w-4xl mx-auto rotate-1 hover:rotate-0 transition-transform duration-300">
          <h2 className="text-4xl font-extrabold uppercase mb-4">
            Build Your ATS Resume Now
          </h2>
          <p className="text-sm font-mono font-extrabold uppercase text-[#39FF14] mb-8">
            Takes under 5 minutes. Entirely free.
          </p>
          <Link 
            href="/app"
            className="px-8 py-4 bg-[#39FF14] text-black font-mono font-extrabold text-lg uppercase border-bold shadow-hard-black hover:scale-110 active:scale-95 transition-all inline-block"
          >
            Get Started <ArrowRight className="inline ml-2" size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 border-t-4 border-black bg-white px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xs font-mono font-extrabold uppercase text-slate-500">
            © 2026 ZERO-STATE RESUME BUILDER. PURE BOLD STYLE.
          </span>
          <div className="flex gap-4">
            <Link href="/app" className="text-xs font-mono font-extrabold uppercase hover:underline">App Builder</Link>
            <Link href="/dashboard" className="text-xs font-mono font-extrabold uppercase hover:underline">Dashboard</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
