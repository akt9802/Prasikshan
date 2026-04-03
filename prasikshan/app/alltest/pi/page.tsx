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

export default function PiInstruction() {
  const instructions = [
    {
      id: 1,
      title: "Personality Profile",
      desc: "The Personal Interview is a comprehensive evaluation of your upbringing, values, and officer potential.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
    },
    {
      id: 2,
      title: "Holistic Review",
      desc: "Expect questions on family, education, hobbies, achievements, and your awareness of current events.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
    },
    {
      id: 3,
      title: "Interaction",
      desc: "The session is an interactive dialogue. Be prepared for cross-questioning and deep-dive inquiries.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
    },
    {
      id: 4,
      title: "Honesty & Clarity",
      desc: "Authenticity is vital. Answer truthfully with clarity, focusing on your own experiences and growth.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
    },
    {
      id: 5,
      title: "Demeanor",
      desc: "Maintain formal posture and natural eye contact. Project a calm, composed, and confident image.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    },
    {
      id: 6,
      title: "Session Duration",
      desc: "The interview typically lasts between 30 to 60 minutes. Stay consistent in your responses throughout.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    }
  ];

  return (
    <>
      <div className="min-h-screen flex flex-col" style={{ background: `linear-gradient(160deg, ${B.iceBlue} 0%, ${B.iceMid} 100%)` }}>
        {/* Hero Section */}
        <div className="relative overflow-hidden pt-16 pb-20 px-4" style={{ background: `linear-gradient(135deg, ${B.navyDeep}, ${B.navyDark})` }}>
          <div className="absolute top-0 right-0 w-1/4 h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M100 0 L0 100 L100 100 Z" fill="white" />
            </svg>
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Intervention · Phase 2</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Personal <span className="text-cyan-300">Interview (PI)</span>
            </h1>
            <p className="text-lg font-medium max-w-2xl mx-auto" style={{ color: 'rgba(190,227,248,0.7)' }}>
              A decisive evaluation of your suitability for the armed forces. Engage in a deep-dive conversation designed to highlight your character and values.
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
              <div className="rounded-2xl p-6 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(18,77,150,0.1)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(18,77,150,0.08)', color: B.navy }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Interaction Mode</p>
                  <p className="text-xl font-black" style={{ color: B.textDark }}>Interactive Q&A</p>
                </div>
              </div>
              <div className="rounded-2xl p-6 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(18,77,150,0.1)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(18,77,150,0.08)', color: B.navy }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Typical Duration</p>
                  <p className="text-xl font-black" style={{ color: B.textDark }}>30 - 60 Minutes</p>
                </div>
              </div>
            </div>

            {/* Final Call to Action */}
            <div className="rounded-2xl p-8 text-center"
              style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)', border: '1.5px dashed rgba(18,77,150,0.25)' }}>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="text-left md:max-w-md">
                  <h3 className="text-xl font-black mb-2" style={{ color: B.textDark }}>Ready to Begin?</h3>
                  <p className="text-sm font-medium" style={{ color: B.textMuted }}>
                    Prepare for a high-intensity professional dialogue. Take a deep breath and project your authentic self.
                  </p>
                </div>
                <Link
                  href="/alltest/pi/displaypiquestions"
                  className="group relative flex items-center gap-3 px-10 py-4 rounded-xl font-black text-lg text-white transition-all overflow-hidden shadow-2xl active:scale-95"
                  style={{ background: `linear-gradient(90deg, ${B.navyDark}, ${B.navy})` }}
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  Start Personal Interview
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
