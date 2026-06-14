'use client';

import { useState, useEffect, useRef } from 'react';
import { Message, ResumeData } from '../../types';
import { ResumePDF } from '../../components/ResumePDF';
import { ResumePreview } from '../../components/ResumePreview';
import Link from 'next/link';
import { 
  Send, 
  Bot, 
  Sparkles, 
  Trash2, 
  RefreshCw, 
  FileDown, 
  FileText,
  User,
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically load PDFDownloadLink to prevent Next.js SSR crashes
import dynamic from 'next/dynamic';
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

export default function AppBuilder() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      content: "Hi! I'm your ATS Resume Recruiter. What's your full name?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [progress, setProgress] = useState(10);
  const [activeTab, setActiveTab] = useState<'chat' | 'preview'>('chat');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set client-side safety mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent accidental data loss on refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (messages.length > 1 || resumeData) {
        e.preventDefault();
        e.returnValue = 'You have an active interview session. Refreshing will clear all data. Are you sure?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [messages, resumeData]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Calculate dynamic progress
  useEffect(() => {
    if (resumeData) {
      setProgress(100);
    } else {
      const step = Math.min(10 + messages.length * 12, 95);
      setProgress(step);
    }
  }, [messages, resumeData]);

  const saveResumeToLocal = async (data: ResumeData) => {
    if (typeof window === 'undefined') return;
    try {
      const resumeId = `resume_${Date.now()}`;
      const title = data.personalInfo?.name ? `${data.personalInfo.name} - Resume` : "Product Engineer";

      // 1. Save locally to localStorage
      const savedResumesStr = localStorage.getItem('user_resumes') || '[]';
      const savedResumes = JSON.parse(savedResumesStr);
      const newResume = {
        id: resumeId,
        name: data.personalInfo?.name || "Untitled Resume",
        role: title,
        data: data,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      savedResumes.unshift(newResume);
      localStorage.setItem('user_resumes', JSON.stringify(savedResumes));

      // 2. Synchronize with Supabase cloud database if user is authenticated
      if (user) {
        const { error } = await supabase.from('resumes').insert({
          user_id: user.id,
          title: title,
          resume_data: data,
          template: 'classic',
          is_public: true
        });

        if (error) {
          console.error("Supabase Database synchronization error:", error);
        } else {
          console.log("☁️ Successfully backed up resume to Supabase cloud database!");
        }
      }
    } catch (e) {
      console.error("Local storage save error", e);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();

      if (response.ok) {
        const text = data.text.trim();
        
        if (isJsonResponse(text)) {
          const parsed = repairAndParseJSON(text);
          if (parsed && parsed.personalInfo?.name) {
            await saveResumeToLocal(parsed);
            setResumeData(parsed);
            setMessages(prev => [
              ...prev,
              {
                role: 'model',
                content: '🎉 Resume built! Your resume is ready to download.',
              },
            ]);
            // Switch to preview tab automatically
            setActiveTab('preview');
          } else {
            setMessages(prev => [
              ...prev,
              {
                role: 'model',
                content: text, // Show as message if parsing fails
              },
            ]);
          }
        } else {
          setMessages(prev => [
            ...prev,
            {
              role: 'model',
              content: text,
            },
          ]);
        }
      } else {
        setMessages([
          ...updatedMessages, 
          { role: 'model', content: `Error: ${data.error || 'Failed to fetch response'}` }
        ]);
      }
    } catch (err: any) {
      setMessages([
        ...updatedMessages, 
        { role: 'model', content: "I'm having trouble connecting to the recruiter node. Please check your network connection and try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const isJsonResponse = (text: string): boolean => {
    let cleaned = text.trim();
    // Strip markdown code fences first to ensure robust checks
    cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return cleaned.startsWith('{') && cleaned.endsWith('}');
  };

  const repairAndParseJSON = (jsonString: string): ResumeData | null => {
    try {
      let cleaned = jsonString.trim();

      // Remove markdown code fences if present
      cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');

      // Remove leading/trailing whitespace inside braces
      cleaned = cleaned.replace(/{\s*/, '{').replace(/\s*}/, '}');

      // Fix common JSON issues
      // 1. Replace single quotes with double quotes (careful not to break strings)
      cleaned = cleaned.replace(/'/g, '"');

      // 2. Remove trailing commas before closing brackets/braces
      cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');

      // 3. Fix unquoted keys (simple fix for common cases)
      cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');

      // 4. Ensure all strings are properly quoted
      // This is a simplified fix; be careful with complex strings
      cleaned = cleaned.replace(/:\s*([^",\[\]{}]*?)(,|[}\]])/g, (match, value, end) => {
        const trimmedValue = value.trim();
        // If value looks like a string (not a number, boolean, null, or object), quote it
        if (
          trimmedValue &&
          !/^(true|false|null|\d+(?:\.\d+)?)$/.test(trimmedValue) &&
          !trimmedValue.startsWith('"') &&
          !trimmedValue.startsWith('[') &&
          !trimmedValue.startsWith('{')
        ) {
          return `: "${trimmedValue}"${end}`;
        }
        return match;
      });

      // 5. Fix newlines inside strings (escape them)
      cleaned = cleaned.replace(/"\s*\n\s*"/g, '" + "');

      console.log('Repaired JSON:', cleaned); // Debug log

      const parsed = JSON.parse(cleaned) as ResumeData;
      return parsed;
    } catch (error) {
      console.error('JSON repair failed:', error);
      console.error('Attempted to parse:', jsonString);
      return null;
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to start a new session? This will wipe your current resume progress.")) {
      setMessages([
        { 
          role: 'model', 
          content: "Hi! I'm your ATS Resume Recruiter. What's your full name?" 
        }
      ]);
      setResumeData(null);
      setProgress(10);
      setInput('');
      setActiveTab('chat');
    }
  };

  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden bg-white text-black relative">
      {/* Bold Redesigned Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b-4 border-black bg-white relative z-20">
        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            className="flex items-center justify-center p-2 border-bold bg-[#FF006E] text-white hover:scale-105 active:scale-95 transition-all shadow-hard-black"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold font-heading text-black uppercase flex items-center gap-2">
              ZERO-STATE <span className="bg-[#0096FF] text-white px-2 border-bold shadow-hard-black">AI BUILDER</span>
            </h1>
            <p className="text-[10px] font-mono font-extrabold uppercase text-slate-500">Stateless • Metrics-Driven • Instantly ATS-Compliant</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-xs font-mono font-extrabold uppercase text-black bg-[#39FF14] border-bold hover:scale-105 active:scale-95 transition-all shadow-hard-black"
          >
            <LayoutDashboard size={14} />
            <span>Dashboard</span>
          </Link>
          <button
            onClick={handleReset}
            id="reset-session-btn"
            className="flex items-center gap-2 px-3 py-2 text-xs font-mono font-extrabold uppercase text-white bg-[#FF6B35] border-bold hover:scale-105 active:scale-95 transition-all shadow-hard-black"
            title="Reset Interview"
          >
            <Trash2 size={13} />
            <span>Reset</span>
          </button>
        </div>
      </header>

      {/* Mobile Tab Swapper */}
      <div className="flex md:hidden border-b-4 border-black bg-white relative z-10">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 text-sm font-mono font-extrabold uppercase text-center border-r-2 border-black ${
            activeTab === 'chat' ? 'bg-[#FF006E] text-white' : 'bg-white text-black'
          }`}
        >
          1. AI Chat Panel
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-3 text-sm font-mono font-extrabold uppercase text-center ${
            activeTab === 'preview' ? 'bg-[#0096FF] text-white' : 'bg-white text-black'
          }`}
        >
          2. Live Preview
        </button>
      </div>

      {/* Split Screen Container */}
      <main className="flex flex-1 flex-col md:flex-row h-[calc(100vh-77px)] overflow-hidden relative z-10">
        
        {/* LEFT PANEL: Chat Window */}
        <section 
          className={`w-full md:w-1/2 flex flex-col h-full bg-[#FAFAFA] border-r-4 border-black transition-all ${
            activeTab === 'chat' ? 'flex' : 'hidden md:flex'
          }`}
        >
          
          {/* Active Status & Progress Bar */}
          <div className="px-6 py-3 border-b-2 border-black bg-white flex items-center justify-between">
            <div className="flex items-center gap-2 bg-[#39FF14] border-bold px-2 py-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
              </span>
              <span className="text-[10px] font-mono font-extrabold uppercase text-black">AGENT ONLINE</span>
            </div>
            
            {/* Elegant Progress Indicator */}
            <div className="flex items-center gap-3 w-1/2 justify-end">
              <span className="text-[10px] font-mono text-black font-extrabold uppercase">{progress}% READY</span>
              <div className="w-24 bg-white border-bold h-3 overflow-hidden shadow-hard-black">
                <div 
                  className="bg-[#0096FF] h-full border-r-2 border-black transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Messages Containment */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => {
                const isModel = msg.role === 'model';
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isModel ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className={`flex gap-3 max-w-[85%] ${isModel ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                  >
                    {isModel ? (
                      <div className="flex-shrink-0 h-10 w-10 border-bold bg-[#0096FF] text-white flex items-center justify-center shadow-hard-black">
                        <Bot size={18} />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 h-10 w-10 border-bold bg-[#39FF14] text-black flex items-center justify-center shadow-hard-black">
                        <User size={18} />
                      </div>
                    )}
                    
                    <div 
                      className={`p-4 text-sm leading-relaxed border-bold rounded-lg ${
                        isModel 
                          ? 'bg-[#F0F0F0] text-black font-mono border-l-4 border-l-[#0096FF]' 
                          : 'bg-[#FF006E] text-white'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Recruiter Loading State */}
            {loading && (
              <div className="flex gap-3 max-w-[80%] mr-auto">
                <div className="flex-shrink-0 h-10 w-10 border-bold bg-[#0096FF] text-white flex items-center justify-center shadow-hard-black">
                  <Bot size={18} />
                </div>
                <div className="p-4 bg-[#F0F0F0] border-bold rounded-lg border-l-4 border-l-[#0096FF] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#FF006E] border border-black animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2.5 h-2.5 bg-[#0096FF] border border-black animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2.5 h-2.5 bg-[#39FF14] border border-black animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Panel */}
          <form 
            onSubmit={handleSendMessage}
            className="p-4 border-t-4 border-black bg-white"
          >
            <div className="relative flex items-center gap-3">
              <input
                id="chat-input-field"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading || !!resumeData}
                placeholder={resumeData ? "Interview complete! Check the preview." : "Type your response..."}
                className="w-full bg-white border-bold rounded-lg py-4 pl-4 pr-12 text-sm text-black placeholder-slate-400 font-mono outline-none focus:scale-[1.02] focus:border-[#FF006E] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                autoComplete="off"
              />
              <button
                id="send-message-btn"
                type="submit"
                disabled={!input.trim() || loading || !!resumeData}
                className="px-6 py-4 bg-[#0096FF] hover:bg-[#0096FF] disabled:bg-slate-300 disabled:text-slate-500 text-white font-mono font-bold text-sm uppercase rounded-lg border-bold shadow-hard-black hover:scale-110 active:scale-95 transition-all"
              >
                <Send size={16} />
              </button>
            </div>
            
            {/* Guide Tip */}
            <div className="mt-2 text-center bg-white border-bold p-1 shadow-hard-black">
              <span className="text-[10px] font-mono font-extrabold uppercase text-black">
                Tip: Share quantitative metrics (e.g. "reduced loading time by 35% by implementing lazy loading")
              </span>
            </div>
          </form>
        </section>

        {/* RIGHT PANEL: Live HTML Preview + PDF Download actions */}
        <section 
          className={`w-full md:w-1/2 flex flex-col h-full bg-[#FAFAFA] p-6 overflow-hidden transition-all ${
            activeTab === 'preview' ? 'flex' : 'hidden md:flex'
          }`}
        >
          
          {/* Right Header Toolbar */}
          <div className="flex flex-wrap items-center justify-between mb-4 gap-2 bg-white border-bold p-3 shadow-hard-black">
            <h2 className="text-xs font-mono font-extrabold tracking-wider text-black uppercase flex items-center gap-2">
              <FileText size={15} className="text-[#0096FF]" />
              Interactive Live Preview
            </h2>
            
            {/* Client-safe Dynamic PDF Download Link */}
            {isClient && resumeData ? (
              <div className="flex gap-2">
                <PDFDownloadLink
                  document={<ResumePDF data={resumeData} />}
                  fileName={`${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`}
                >
                  {({ loading: pdfLoading }) => (
                    <button
                      id="download-pdf-btn"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-extrabold uppercase text-white bg-[#FF006E] border-bold rounded-lg shadow-hard-black hover:scale-110 active:scale-95 transition-all"
                    >
                      <FileDown size={14} className={pdfLoading ? 'animate-spin' : ''} />
                      <span>{pdfLoading ? 'COMPILING...' : 'DOWNLOAD PDF'}</span>
                    </button>
                  )}
                </PDFDownloadLink>
                <Link
                  href={`/r/share?data=${btoa(encodeURIComponent(JSON.stringify(resumeData)))}`}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-extrabold uppercase text-black bg-[#39FF14] border-bold rounded-lg shadow-hard-black hover:scale-110 active:scale-95 transition-all"
                >
                  <Sparkles size={14} />
                  <span>SHARE</span>
                </Link>
              </div>
            ) : resumeData ? (
              <button 
                disabled 
                className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-extrabold text-slate-500 bg-white border-bold rounded-lg cursor-not-allowed"
              >
                <RefreshCw size={13} className="animate-spin" />
                <span>COMPILING...</span>
              </button>
            ) : (
              <span className="text-[10px] text-slate-600 font-mono font-extrabold bg-[#FAFAFA] border-bold px-2 py-0.5 uppercase">AWAITING COMPILE DATA</span>
            )}
          </div>

          {/* Actual Live Preview Card Container */}
          <div className="flex-1 overflow-hidden relative border-bold shadow-hard-black p-1 bg-white rounded-lg">
            <ResumePreview data={resumeData} />
          </div>
        </section>
        
      </main>
    </div>
  );
}
