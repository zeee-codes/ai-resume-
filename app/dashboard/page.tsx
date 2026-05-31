'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Share2, 
  FileText, 
  LayoutDashboard, 
  Eye, 
  Copy,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { ResumeData } from '../../types';

interface SavedResume {
  id: string;
  name: string;
  role: string;
  createdAt: string;
  data: ResumeData;
}

export default function DashboardPage() {
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load resumes from localStorage or create mock ones
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('user_resumes');
      if (stored) {
        setResumes(JSON.parse(stored));
      } else {
        // Preload mock resumes to populate the interface immediately
        const mockResumes: SavedResume[] = [
          {
            id: 'mock_1',
            name: 'Zaid Al-Sayegh',
            role: 'Senior Full Stack Engineer',
            createdAt: 'May 31, 2026',
            data: {
              personalInfo: {
                name: 'Zaid Al-Sayegh',
                email: 'zaid@engineering.io',
                phone: '555-019-2048'
              },
              summary: 'Metrics-driven Senior Full Stack Engineer with 6+ years of expertise designing and building high-throughput cloud infrastructure and reactive user interfaces. Focused on performance optimization and engineering excellence.',
              skills: ['React/Next.js', 'TypeScript', 'Node.js', 'Go', 'AWS (Fargate/RDS)', 'PostgreSQL', 'Docker'],
              projects: [
                {
                  name: 'Hyper-Scale SaaS Infrastructure',
                  techStack: ['Next.js', 'Go', 'AWS', 'Docker'],
                  bullets: [
                    'Re-architected monolithic API endpoints into decoupled microservices, scaling user throughput by 250% while reducing latency from 180ms to 45ms.',
                    'Engineered an automated serverless media transcoding pipeline serving 120k active assets, saving 35% in monthly compute overhead.',
                    'Implemented strict database caching layers via Redis, reducing primary Postgres query loads by 65%.'
                  ]
                },
                {
                  name: 'Collaborative Real-time Canvas App',
                  techStack: ['React', 'TypeScript', 'WebSockets', 'TailwindCSS'],
                  bullets: [
                    'Built a highly dynamic real-time collaborative workspace interface, driving 45k new user registrations within 60 days of deployment.',
                    'Optimized canvas state synchronization protocols, achieving low-latency multi-client rendering in under 15ms.'
                  ]
                }
              ]
            }
          },
          {
            id: 'mock_2',
            name: 'Jane Doe',
            role: 'Lead Product Designer',
            createdAt: 'May 25, 2026',
            data: {
              personalInfo: {
                name: 'Jane Doe',
                email: 'jane@designworks.co',
                phone: '555-012-3456'
              },
              summary: 'Lead Product Designer specialized in complex design systems and responsive user journeys. Committed to combining premium aesthetics with rigorous accessibility standards.',
              skills: ['Figma', 'UI/UX Design', 'Design Systems', 'HTML/CSS', 'Prototyping', 'User Research'],
              projects: [
                {
                  name: 'Global Enterprise Design System',
                  techStack: ['Figma', 'Tokens Studio', 'React'],
                  bullets: [
                    'Spearheaded the unified UI design token library across 4 product verticals, cutting engineering handoff duration by 50%.',
                    'Audited and overhauled components to achieve full WCAG 2.1 AA compliance across core transaction pages.'
                  ]
                }
              ]
            }
          }
        ];
        localStorage.setItem('user_resumes', JSON.stringify(mockResumes));
        setResumes(mockResumes);
      }
    } catch (e) {
      console.error("Local storage access error", e);
    }
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      const updated = resumes.filter(r => r.id !== id);
      setResumes(updated);
      localStorage.setItem('user_resumes', JSON.stringify(updated));
    }
  };

  const copyShareLink = (resume: SavedResume) => {
    try {
      const base64Data = btoa(encodeURIComponent(JSON.stringify(resume.data)));
      const link = `${window.location.origin}/r/share?data=${base64Data}`;
      navigator.clipboard.writeText(link);
      setCopiedId(resume.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const getAccentColor = (index: number) => {
    const colors = [
      '#FF006E', // Hot Pink
      '#FF6B35', // Orange
      '#0096FF', // Electric Blue
      '#6A00FF'  // Deep Purple
    ];
    return colors[index % colors.length];
  };

  const getShadowHardClass = (index: number) => {
    const classes = [
      'hover:shadow-hard-pink',
      'hover:shadow-hard-orange',
      'hover:shadow-hard-blue',
      'hover:shadow-hard-purple'
    ];
    return classes[index % classes.length];
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col overflow-x-hidden relative">
      
      {/* Decorative Blob */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#FF6B35] border-bold rotate-6 -z-10 shadow-hard-black" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#0096FF] border-bold -rotate-12 -z-10 shadow-hard-black" />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 border-b-4 border-black bg-white max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            className="flex items-center justify-center p-2 border-bold bg-[#FF006E] text-white hover:scale-105 active:scale-95 transition-all shadow-hard-black"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-2">
            <LayoutDashboard size={24} className="text-[#6A00FF]" />
            <h1 className="text-xl font-extrabold tracking-tight uppercase">
              RESUME <span className="bg-[#39FF14] text-black px-2 border-bold shadow-hard-black ml-1">DASHBOARD</span>
            </h1>
          </div>
        </div>

        <Link
          href="/app"
          className="flex items-center gap-2 px-6 py-2.5 bg-[#39FF14] text-black font-mono font-bold text-sm uppercase border-bold hover:scale-110 active:scale-95 transition-all shadow-hard-black"
        >
          <Plus size={16} />
          <span>New Resume</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full py-12 px-6 flex-1">
        
        {/* Intro Banner */}
        <div className="bg-[#FF006E] text-white p-6 border-bold shadow-hard-black rounded-lg mb-12 -rotate-1 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-extrabold uppercase">Stateless Resume Vault</h2>
            <p className="text-xs font-mono font-bold text-[#39FF14] uppercase mt-1">
              Your resumes are stored locally on your device. Clearing your browser storage deletes this list.
            </p>
          </div>
          <div className="bg-white border-bold px-3 py-1 text-black font-mono font-extrabold text-xs uppercase shadow-hard-black rotate-2">
            🔒 Client-Side Only
          </div>
        </div>

        {/* Resumes Grid */}
        {resumes.length === 0 ? (
          <div className="text-center py-20 bg-[#FAFAFA] border-bold shadow-hard-black max-w-xl mx-auto rounded-lg">
            <Eye size={48} className="mx-auto mb-4 text-[#FF006E]" />
            <h3 className="text-lg font-extrabold uppercase mb-2">No resumes found</h3>
            <p className="text-sm font-mono font-bold text-slate-500 mb-6 px-4">
              You haven't completed any recruiter AI interviews yet! Let's get started.
            </p>
            <Link
              href="/app"
              className="px-6 py-3 bg-[#FF006E] text-white font-mono font-bold text-xs uppercase border-bold shadow-hard-black hover:scale-110 transition-all inline-block"
            >
              Start AI Interview
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumes.map((resume, index) => {
              const accent = getAccentColor(index);
              const shadowClass = getShadowHardClass(index);
              const shareLink = `/r/share?data=${btoa(encodeURIComponent(JSON.stringify(resume.data)))}`;

              return (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 20 }}
                  className={`bg-white border-bold shadow-hard-black rounded-lg overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 ${shadowClass}`}
                  style={{ borderTop: `6px solid ${accent}` }}
                >
                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <span className="text-[9px] font-mono font-extrabold bg-[#FAFAFA] border-bold px-2 py-0.5 uppercase text-slate-600">
                          {resume.createdAt}
                        </span>
                        <div className="w-5 h-5 border border-black flex-shrink-0" style={{ backgroundColor: accent }} />
                      </div>
                      
                      <h3 className="text-xl font-extrabold uppercase font-heading text-black line-clamp-1 mb-1">
                        {resume.name}
                      </h3>
                      <p className="text-xs font-mono font-bold text-[#6A00FF] uppercase mb-4 line-clamp-1">
                        {resume.role}
                      </p>

                      <div className="space-y-1.5 border-t border-black pt-4 mb-6">
                        <div className="flex justify-between text-[11px] font-mono font-bold text-slate-600 uppercase">
                          <span>Skills Compiled:</span>
                          <span className="text-black font-extrabold">{resume.data.skills?.length || 0}</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-mono font-bold text-slate-600 uppercase">
                          <span>Projects Logged:</span>
                          <span className="text-black font-extrabold">{resume.data.projects?.length || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <Link
                        href={shareLink}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-black font-mono font-extrabold text-xs uppercase border-bold hover:bg-[#39FF14] transition-all shadow-hard-black"
                      >
                        <Eye size={13} />
                        <span>Preview</span>
                      </Link>
                      
                      <button
                        onClick={() => copyShareLink(resume)}
                        className={`flex items-center justify-center gap-1.5 px-3 py-2 font-mono font-extrabold text-xs uppercase border-bold transition-all shadow-hard-black ${
                          copiedId === resume.id 
                            ? 'bg-[#39FF14] text-black' 
                            : 'bg-white hover:bg-[#0096FF] hover:text-white'
                        }`}
                      >
                        {copiedId === resume.id ? <Sparkles size={13} /> : <Copy size={13} />}
                        <span>{copiedId === resume.id ? 'Copied' : 'Share'}</span>
                      </button>

                      <button
                        onClick={() => handleDelete(resume.id)}
                        className="col-span-2 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#FF6B35] text-white font-mono font-extrabold text-xs uppercase border-bold hover:scale-105 transition-all shadow-hard-black"
                      >
                        <Trash2 size={13} />
                        <span>Delete Resume</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t-4 border-black bg-white px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xs font-mono font-extrabold uppercase text-slate-500">
            © 2026 ZERO-STATE RESUME BUILDER. CLIENT VAULT.
          </span>
          <div className="flex gap-4">
            <Link href="/" className="text-xs font-mono font-extrabold uppercase hover:underline">Landing Page</Link>
            <Link href="/app" className="text-xs font-mono font-extrabold uppercase hover:underline">Recruiter Builder</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
