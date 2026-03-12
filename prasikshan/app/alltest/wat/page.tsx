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

export default function WatInstruction() {
  const instructions = [
    {
      id: 1,
      title: "Thought Process",
      desc: "WAT assesses your subconscious thought process, attitude, and personality through word association.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
    },
    {
      id: 2,
      title: "60 Words",
      desc: "A series of 60 words will be displayed sequentially. Spontaneity is the key to success.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
    },
    {
      id: 3,
      title: "Rapid Display",
      desc: "Each word appears for only 15 seconds. You must form and write a sentence within this timeframe.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    },
    {
      id: 4,
      title: "Positive Outlook",
      desc: "Sentences should be meaningful, realistic, and positive, projecting an officer-like personality.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
    },
    {
      id: 5,
      title: "Instinctive Flow",
      desc: "Avoid overthinking or trying to use complicated vocabulary. Go with your first constructive instinct.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="M4.93 19.07l2.83-2.83" /><path d="M16.24 7.76l2.83-2.83" /></svg>
    },
    {
      id: 6,
      title: "System Integrity",
      desc: "Progress is tracked. Do not refresh or navigate away while the automated word sequence is running.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
    }
  ];

  return (
    <>
      <div className="min-h-screen flex flex-col" style={{ background: `linear-gradient(160deg, ${B.iceBlue} 0%, ${B.iceMid} 100%)` }}>
        {/* Hero Section */}
        <div className="relative overflow-hidden pt-16 pb-20 px-4" style={{ background: `linear-gradient(135deg, ${B.navyDeep}, ${B.navyDark})` }}>
          <div className="absolute top-0 right-0 w-1/4 h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 L100 0 L100 100 Z" fill="white" />
            </svg>
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Association Test · Phase 2</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Word Association <span className="text-emerald-300">Test (WAT)</span>
            </h1>
            <p className="text-lg font-medium max-w-2xl mx-auto" style={{ color: 'rgba(190,227,248,0.7)' }}>
              Capture the first thought that springs to mind. A rapid evaluation designed to reveal your attitudes and character traits through simple word stimulus.
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

            {/* Test Summary Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="rounded-2xl p-6 flex items-center gap-5" style={{ background: 'rgba(16,185,129,0.05)', border: '1.5px solid rgba(16,185,129,0.15)' }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#10B981] mb-1">Total Words</p>
                  <p className="text-2xl font-black" style={{ color: B.textDark }}>60 Words</p>
                </div>
              </div>
              <div className="rounded-2xl p-6 flex items-center gap-5" style={{ background: 'rgba(37,99,235,0.05)', border: '1.5px solid rgba(37,99,235,0.15)' }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(37,99,235,0.1)', color: '#2563EB' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#2563EB] mb-1">Time per Word</p>
                  <p className="text-2xl font-black" style={{ color: B.textDark }}>15 Seconds</p>
                </div>
              </div>
            </div>

            {/* Final Call to Action */}
            <div className="rounded-2xl p-8 text-center"
              style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)', border: '1.5px dashed rgba(18,77,150,0.25)' }}>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="text-left md:max-w-md">
                  <h3 className="text-xl font-black mb-2" style={{ color: B.textDark }}>Ready to Start WAT?</h3>
                  <p className="text-sm font-medium" style={{ color: B.textMuted }}>
                    Words will appear in a rapid sequence. Have your hands ready for continuous typing without pausing.
                  </p>
                </div>
                <Link
                  href="/alltest/wat/displaywatquestions"
                  className="group relative flex items-center gap-3 px-10 py-4 rounded-xl font-black text-lg text-white transition-all overflow-hidden shadow-2xl active:scale-95"
                  style={{ background: `linear-gradient(90deg, ${B.navyDark}, ${B.navy})` }}
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  Start WAT Test
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
