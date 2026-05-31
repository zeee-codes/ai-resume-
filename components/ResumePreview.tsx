"use client";

import { motion } from 'framer-motion';
import { ResumeData } from '../types';
import { Mail, Phone, User, Award, Layers, FolderGit2 } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData | null;
  accentColor?: string; // Option to pass theme accent (default is Electric Blue)
}

export const ResumePreview = ({ data, accentColor = '#0096FF' }: ResumePreviewProps) => {
  if (!data) {
    // Beautiful interactive Skeleton Placeholder State to WOW the user on landing
    return (
      <div className="w-full h-full min-h-[500px] flex flex-col justify-between p-8 bg-white border-bold-3 shadow-hard-black rounded-lg relative overflow-hidden">
        {/* Colorful Neobrutalist Geometry Elements */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#FF006E] border-bold rotate-12" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#39FF14] border-bold -rotate-12" />
        
        <div className="space-y-8 relative z-10">
          {/* Header Skeleton */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-48 h-8 bg-[#FF006E] border-bold rounded animate-pulse" />
            <div className="mx-auto w-64 h-5 bg-[#0096FF] border-bold rounded animate-pulse" />
          </div>

          <hr className="border-2 border-black" />

          {/* Summary Skeleton */}
          <div className="space-y-3">
            <div className="w-40 h-7 bg-[#39FF14] border-bold flex items-center px-2 py-0.5">
              <span className="text-[10px] uppercase tracking-wider text-black font-extrabold font-mono">RECRUITER AI ACTIVE</span>
            </div>
            <div className="w-full h-4 bg-black border border-black animate-pulse" />
            <div className="w-11/12 h-4 bg-black border border-black animate-pulse" />
          </div>

          {/* Skills Skeleton */}
          <div className="space-y-3">
            <div className="w-24 h-5 bg-[#FF6B35] border-bold rounded px-1 text-[10px] text-white font-mono uppercase font-bold text-center">Skills</div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="w-16 h-7 bg-white border-bold rounded px-2 animate-pulse" />
              ))}
            </div>
          </div>

          {/* Projects Skeleton */}
          <div className="space-y-4">
            <div className="w-32 h-5 bg-[#6A00FF] border-bold rounded px-1 text-[10px] text-white font-mono uppercase font-bold text-center">Projects</div>
            <div className="space-y-3 p-4 bg-white border-bold">
              <div className="flex justify-between">
                <div className="w-40 h-4 bg-[#0096FF] border border-black animate-pulse" />
                <div className="w-20 h-3 bg-black border border-black animate-pulse" />
              </div>
              <div className="w-full h-3 bg-black border border-black animate-pulse" />
            </div>
          </div>
        </div>

        <div className="text-center relative z-10 mt-6 bg-[#39FF14] border-bold p-3">
          <p className="text-sm font-bold text-black uppercase font-mono">
            Awaiting interview data...
          </p>
          <p className="text-xs text-black font-mono mt-1 max-w-sm mx-auto">
            Answer the recruiter's questions in the left panel to dynamically build your professional ATS resume.
          </p>
        </div>
      </div>
    );
  }

  // Color rotation scheme for section headers
  const sectionColors = {
    name: '#FF006E',      // Hot Pink
    summary: '#39FF14',   // Lime Green
    skills: '#FF6B35',    // Orange
    projects: '#6A00FF'   // Deep Purple
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="w-full bg-white text-black p-10 shadow-hard-black border-bold-3 rounded-lg overflow-y-auto max-h-[calc(100vh-140px)] relative"
      style={{ borderLeftColor: accentColor, borderTopColor: accentColor }}
    >
      {/* Decorative Brand Accent Corner */}
      <div 
        className="absolute top-0 right-0 w-8 h-8 border-b-2 border-l-2 border-black"
        style={{ backgroundColor: accentColor }}
      />

      {/* Header Block */}
      <div className="text-center mb-8">
        <h1 
          className="text-4xl font-extrabold uppercase tracking-tight text-black mb-2 inline-block px-3 py-1 border-bold"
          style={{ 
            fontFamily: 'var(--font-outfit), sans-serif',
            backgroundColor: sectionColors.name,
            color: 'white',
            boxShadow: '3px 3px 0px 0px #000000'
          }}
        >
          {data.personalInfo.name}
        </h1>
        <div className="flex justify-center items-center gap-4 text-xs font-mono font-bold text-black flex-wrap mt-3">
          {data.personalInfo.email && (
            <span className="flex items-center gap-1.5 bg-white border-bold px-2 py-1">
              <Mail size={13} className="text-[#0096FF]" />
              <a href={`mailto:${data.personalInfo.email}`} className="hover:underline">{data.personalInfo.email}</a>
            </span>
          )}
          {data.personalInfo.phone && (
            <span className="flex items-center gap-1.5 bg-white border-bold px-2 py-1">
              <Phone size={13} className="text-[#FF006E]" />
              <span>{data.personalInfo.phone}</span>
            </span>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Executive Summary */}
        {data.summary && (
          <div className="border-bold p-4 bg-white shadow-hard-black">
            <h2 
              className="text-xs uppercase font-extrabold tracking-widest text-black flex items-center gap-2 mb-3 border-bold px-2 py-1 inline-block"
              style={{ backgroundColor: sectionColors.summary }}
            >
              <User size={13} className="text-black" />
              Professional Summary
            </h2>
            <p className="text-sm leading-relaxed font-sans text-black text-justify">
              {data.summary}
            </p>
          </div>
        )}

        {/* Skills Panel */}
        {data.skills && data.skills.length > 0 && (
          <div className="border-bold p-4 bg-white shadow-hard-black">
            <h2 
              className="text-xs uppercase font-extrabold tracking-widest text-white flex items-center gap-2 mb-3 border-bold px-2 py-1 inline-block"
              style={{ backgroundColor: sectionColors.skills }}
            >
              <Layers size={13} className="text-white" />
              Core Competencies
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-white text-black text-xs font-mono font-bold px-2.5 py-1 border-bold hover:scale-105 hover:bg-[#39FF14] transition-all"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {data.projects && data.projects.length > 0 && (
          <div className="border-bold p-4 bg-white shadow-hard-black">
            <h2 
              className="text-xs uppercase font-extrabold tracking-widest text-white flex items-center gap-2 mb-4 border-bold px-2 py-1 inline-block"
              style={{ backgroundColor: sectionColors.projects }}
            >
              <FolderGit2 size={13} className="text-white" />
              Professional Projects
            </h2>
            <div className="space-y-6">
              {data.projects.map((proj, idx) => (
                <div key={idx} className="group border-bold p-4 bg-[#FAFAFA] shadow-hard-black">
                  <div className="flex flex-wrap justify-between items-baseline mb-2 pb-1 border-b-2 border-black">
                    <h3 className="text-base font-extrabold text-black uppercase font-mono">
                      {proj.name}
                    </h3>
                    {proj.techStack && proj.techStack.length > 0 && (
                      <span className="text-[10px] font-bold font-mono text-black bg-[#39FF14] border-bold px-2 py-0.5">
                        {proj.techStack.join(', ')}
                      </span>
                    )}
                  </div>
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className="list-none space-y-2 mt-3 font-sans">
                      {proj.bullets.map((bullet, bulletIdx) => (
                        <li key={bulletIdx} className="text-xs text-black leading-relaxed flex items-start gap-2">
                          <span className="inline-block mt-1 w-2.5 h-2.5 bg-[#FF006E] border border-black flex-shrink-0" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
