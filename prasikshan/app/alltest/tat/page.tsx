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

export default function TatInstruction() {
  const instructions = [
    {
      id: 1,
      title: "Test Objective",
      desc: "TAT assesses your imagination, perception, and ability to analyze complex human situations.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
    },
    {
      id: 2,
      title: "12 Pictures",
      desc: "A series of 12 pictures will be shown one by one. The last one is a blank slide for your own story.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></svg>
    },
    {
      id: 3,
      title: "Visual Focus",
      desc: "Each picture is visible for 30 seconds. Use this time to establish the characters and the plot.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    },
    {
      id: 4,
      title: "Story Writing",
      desc: "You get 4 minutes per picture to draft a narrative including the past, present, and future resolution.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
    },
    {
      id: 5,
      title: "OLQ Analysis",
      desc: "Stories should be positive, realistic, and showcase Officer-Like Qualities through character actions.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
    },
    {
      id: 6,
      title: "Browser Conduct",
      desc: "Ensure stability. Navigating back or refreshing will disrupt the sequence of the personality test.",
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
              <circle cx="100" cy="0" r="100" fill="white" />
            </svg>
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Psychological Test · Phase 2</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Thematic Apperception <span className="text-indigo-300">Test (TAT)</span>
            </h1>
            <p className="text-lg font-medium max-w-2xl mx-auto" style={{ color: 'rgba(190,227,248,0.7)' }}>
              A profound exploration of your personality through creative storytelling. Interpret the visuals to reveal your inner thoughts and leadership potential.
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="rounded-2xl p-6 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(18,77,150,0.1)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(18,77,150,0.08)', color: B.navy }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="3" x2="9" y2="21" /></svg>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Pictures</p>
                  <p className="text-xl font-black" style={{ color: B.textDark }}>12 Slides</p>
                </div>
              </div>
              <div className="rounded-2xl p-6 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(18,77,150,0.1)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(18,77,150,0.08)', color: B.navy }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Observation</p>
                  <p className="text-xl font-black" style={{ color: B.textDark }}>30s / Pic</p>
                </div>
              </div>
              <div className="rounded-2xl p-6 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(18,77,150,0.1)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(18,77,150,0.08)', color: B.navy }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Writing</p>
                  <p className="text-xl font-black" style={{ color: B.textDark }}>4m / Pic</p>
                </div>
              </div>
            </div>

            {/* Final Call to Action */}
            <div className="rounded-2xl p-8 text-center"
              style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)', border: '1.5px dashed rgba(18,77,150,0.25)' }}>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="text-left md:max-w-md">
                  <h3 className="text-xl font-black mb-2" style={{ color: B.textDark }}>Ready for TAT?</h3>
                  <p className="text-sm font-medium" style={{ color: B.textMuted }}>
                    The test will proceed automatically once started. Keep your focus sharp for the next 50+ minutes.
                  </p>
                </div>
                <Link
                  href="/alltest/tat/displaytatquestions"
                  className="group relative flex items-center gap-3 px-10 py-4 rounded-xl font-black text-lg text-white transition-all overflow-hidden shadow-2xl active:scale-95"
                  style={{ background: `linear-gradient(90deg, ${B.navyDark}, ${B.navy})` }}
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  Start TAT Test
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
