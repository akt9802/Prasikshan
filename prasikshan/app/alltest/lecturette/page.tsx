"use client";

import React from "react";
import Link from "next/link";
import Footer from "@/components/footer/Footer";

// ── Brand palette ─────────────────────────────────────────────────────────────
const B = {
  navy: '#124D96',
  navyDark: '#0D3A72',
  navyDeep: '#0A2A55',
  blueMid: '#2563EB',
  iceBlue: '#EDF9FF',
  iceMid: '#D7F1FF',
  textDark: '#0F172A',
  textMid: '#334155',
  textMuted: '#475569',
  textLight: '#94A3B8',
};

export default function LecturetteInstruction() {
  const instructions = [
    {
      id: 1,
      title: "Communication",
      desc: "This test assesses your confidence, clarity of thought, and officer-like speaking ability.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
    },
    {
      id: 2,
      title: "Random Topics",
      desc: "You will be presented with random topics. You must choose one and prepare a structured speech.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
    },
    {
      id: 3,
      title: "Preparation",
      desc: "You get exactly 3 minutes to organize your thoughts and structure your narration points.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    },
    {
      id: 4,
      title: "Speech Analysis",
      desc: "The system uses speech-to-text to analyze your fluency, vocabulary, and logical flow.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
    },
    {
      id: 5,
      title: "Body Language",
      desc: "Maintain a steady posture and clear eye contact with the camera for a professional delivery.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2z" /><path d="M1 9h22" /><path d="M9 21v-3.5a1.5 1.5 0 0 1 3 0V21" /></svg>
    },
    {
      id: 6,
      title: "Performance",
      desc: "After finishing, you'll receive a scorecard with insights into your officer-like qualities.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
    }
  ];

  return (
    <>
      <div className="min-h-screen flex flex-col" style={{ background: `linear-gradient(160deg, ${B.iceBlue} 0%, ${B.iceMid} 100%)` }}>
        {/* Hero Section */}
        <div className="relative overflow-hidden pt-16 pb-20 px-4" style={{ background: `linear-gradient(135deg, ${B.navyDeep}, ${B.navyDark})` }}>
          <div className="absolute top-0 right-0 w-1/4 h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <circle cx="100" cy="100" r="80" fill="white" />
            </svg>
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">GTO Task · Phase 2</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Self-Presentation <span className="text-violet-300">(Lecturette)</span>
            </h1>
            <p className="text-lg font-medium max-w-2xl mx-auto" style={{ color: 'rgba(190,227,248,0.7)' }}>
              A test of public speaking and structured thought. Prepare a impactful speech on a randomly assigned topic and demonstrate your command over communication.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 -mt-10 px-4 pb-16 relative z-20">
          <div className="max-w-5xl mx-auto">
            {/* Instructions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {instructions.map((item) => (
                <div key={item.id} className="rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group"
                  style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(18,77,150,0.12)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:rotate-6 shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${B.navy}, ${B.blueMid})`, color: '#fff' }}>
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-black mb-2" style={{ color: B.textDark }}>{item.title}</h3>
                  <p className="text-sm font-medium leading-relaxed" style={{ color: B.textMid }}>{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Test Format Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="rounded-2xl p-6 flex items-center gap-5" style={{ background: 'rgba(139,92,246,0.05)', border: '1.5px solid rgba(139,92,246,0.15)' }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#8B5CF6] mb-1">Preparation</p>
                  <p className="text-2xl font-black" style={{ color: B.textDark }}>3 Minutes</p>
                </div>
              </div>
              <div className="rounded-2xl p-6 flex items-center gap-5" style={{ background: 'rgba(37,99,235,0.05)', border: '1.5px solid rgba(37,99,235,0.15)' }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(37,99,235,0.1)', color: '#2563EB' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#2563EB] mb-1">Narration</p>
                  <p className="text-2xl font-black" style={{ color: B.textDark }}>3 Minutes</p>
                </div>
              </div>
            </div>

            {/* Final Call to Action */}
            <div className="rounded-2xl p-8 text-center"
              style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)', border: '1.5px dashed rgba(18,77,150,0.25)' }}>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="text-left md:max-w-md">
                  <h3 className="text-xl font-black mb-2" style={{ color: B.textDark }}>Ready to Speak?</h3>
                  <p className="text-sm font-medium" style={{ color: B.textMuted }}>
                    Once you click start, your topic will be revealed and the 3-minute preparation timer will begin. Keep your microphone ready.
                  </p>
                </div>
                <Link
                  href="/alltest/lecturette/displaylecturettequestion"
                  className="group relative flex items-center gap-3 px-10 py-4 rounded-xl font-black text-lg text-white transition-all overflow-hidden shadow-2xl active:scale-95"
                  style={{ background: `linear-gradient(90deg, ${B.navyDark}, ${B.navy})` }}
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  Start Lecturette Test
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
