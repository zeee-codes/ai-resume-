'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  LayoutDashboard,
  Palette,
  FileDown
} from 'lucide-react';
import { ResumeData } from '../../../types';
import { ResumePreview } from '../../../components/ResumePreview';
import { ResumePDF } from '../../../components/ResumePDF';

// Dynamically load PDFDownloadLink to prevent Next.js SSR crashes
import dynamic from 'next/dynamic';
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

type AccentChoice = 'pink' | 'blue' | 'orange';

function ResumeShareViewer() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [data, setData] = useState<ResumeData | null>(null);
  const [accent, setAccent] = useState<AccentChoice>('blue');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // 1. Check for data query param (Base64 encoded JSON payload)
    const rawData = searchParams.get('data');
    if (rawData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(rawData))) as ResumeData;
        setData(decoded);
        return;
      } catch (err) {
        console.error("Base64 decode failed:", err);
      }
    }

    // 2. Check local storage if slug matches a local resume
    const slug = params.slug as string;
    if (slug && slug !== 'share') {
      try {
        const local = localStorage.getItem('user_resumes');
        if (local) {
          const resumes = JSON.parse(local);
          const matched = resumes.find((r: any) => r.id === slug);
          if (matched) {
            setData(matched.data);
            return;
          }
        }
      } catch (e) {
        console.error("Local storage lookup failed", e);
      }
    }
  }, [params.slug, searchParams]);

  const accentColors = {
    pink: '#FF006E',
    blue: '#0096FF',
    orange: '#FF6B35'
  };

  const getOppositeColor = () => {
    switch (accent) {
      case 'pink': return '#39FF14'; // Lime Green is opposite Hot Pink
      case 'blue': return '#FF006E'; // Hot Pink opposite Electric Blue
      case 'orange': return '#39FF14'; // Lime Green opposite Orange
      default: return '#39FF14';
    }
  };

  const getOppositeText = () => {
    switch (accent) {
      case 'pink': return 'text-black';
      case 'blue': return 'text-white';
      case 'orange': return 'text-black';
      default: return 'text-black';
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col justify-center items-center p-6 text-center">
        <div className="bg-[#FF006E] border-bold p-8 shadow-hard-black max-w-md rounded-lg rotate-1">
          <FileText size={48} className="mx-auto mb-4 text-white" />
          <h1 className="text-2xl font-extrabold uppercase text-white mb-2">Resume Not Found</h1>
          <p className="text-sm font-mono font-bold text-white mb-6">
            The link is invalid or the resume data has been cleared from local storage.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-[#39FF14] text-black font-mono font-extrabold text-xs uppercase border-bold shadow-hard-black hover:scale-110 active:scale-95 transition-all inline-block"
          >
            Go to Landing Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col relative pb-20">
      
      {/* Decorative Blob */}
      <div className="absolute top-40 right-10 w-28 h-28 bg-[#39FF14] border-bold rotate-6 -z-10 shadow-hard-black" />
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-[#FF006E] border-bold -rotate-12 -z-10 shadow-hard-black" />

      {/* CTA Contrasting Banner */}
      <div 
        className="w-full py-4 px-6 border-b-4 border-black text-center font-mono font-extrabold uppercase text-xs sm:text-sm flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 transition-all duration-300 relative z-20 shadow-hard-black"
        style={{ backgroundColor: getOppositeColor() }}
      >
        <span className={getOppositeText()}>
          🔥 WANT A BOLD ATS-COMPLIANT RESUME LIKE THIS ONE?
        </span>
        <Link 
          href="/app"
          className="bg-white text-black px-4 py-1.5 border-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shadow-hard-black font-mono font-bold text-[10px] sm:text-xs uppercase"
        >
          <span>BUILD IT IN 2 MINS</span>
          <ArrowRight size={12} />
        </Link>
      </div>

      {/* Toolbar */}
      <div className="max-w-4xl mx-auto w-full mt-8 px-6 relative z-10">
        <div className="bg-white border-bold p-4 shadow-hard-black rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-[#6A00FF]" />
            <span className="text-xs font-mono font-extrabold uppercase">Choose Template Color Accent:</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Hot Pink choice */}
            <button
              onClick={() => setAccent('pink')}
              className={`w-6 h-6 border-bold transition-all ${
                accent === 'pink' ? 'scale-125 rotate-6 shadow-hard-black' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: '#FF006E' }}
              title="Hot Pink"
            />
            {/* Electric Blue choice */}
            <button
              onClick={() => setAccent('blue')}
              className={`w-6 h-6 border-bold transition-all ${
                accent === 'blue' ? 'scale-125 rotate-6 shadow-hard-black' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: '#0096FF' }}
              title="Electric Blue"
            />
            {/* Orange choice */}
            <button
              onClick={() => setAccent('orange')}
              className={`w-6 h-6 border-bold transition-all ${
                accent === 'orange' ? 'scale-125 rotate-6 shadow-hard-black' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: '#FF6B35' }}
              title="Orange"
            />

            {/* Divider */}
            <div className="w-px h-6 bg-black mx-1" />

            {/* Compile Link */}
            {isClient ? (
              <PDFDownloadLink
                document={<ResumePDF data={data} />}
                fileName={`${data.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`}
              >
                {({ loading: pdfLoading }) => (
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono font-extrabold uppercase text-white bg-black border-bold rounded hover:scale-105 active:scale-95 transition-all shadow-hard-black"
                  >
                    <FileDown size={11} className={pdfLoading ? 'animate-spin' : ''} />
                    <span>{pdfLoading ? '...' : 'PDF'}</span>
                  </button>
                )}
              </PDFDownloadLink>
            ) : null}

            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono font-extrabold uppercase text-black bg-[#39FF14] border-bold rounded hover:scale-105 active:scale-95 transition-all shadow-hard-black"
            >
              <LayoutDashboard size={11} />
              <span>Vault</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Resume Content */}
      <main className="max-w-4xl mx-auto w-full mt-10 px-6 relative z-10 flex-1">
        <ResumePreview data={data} accentColor={accentColors[accent]} />
      </main>

    </div>
  );
}

export default function PublicResumePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white text-black flex flex-col justify-center items-center p-6 text-center font-mono font-extrabold uppercase text-sm">
        <div className="p-4 bg-[#0096FF] border-bold text-white shadow-hard-black rotate-1">
          Loading Bold Resume Engine...
        </div>
      </div>
    }>
      <ResumeShareViewer />
    </Suspense>
  );
}
