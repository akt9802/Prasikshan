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

export default function TenQuestion() {
  const instructions = [
    {
      id: 1,
      title: "Comprehensive Assessment",
      desc: "Ten carefully curated questions to assess your knowledge thoroughly across multiple domains.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
    },
    {
      id: 2,
      title: "Time Management",
      desc: "Manage your time efficiently across all questions to complete the assessment within limits.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    },
    {
      id: 3,
      title: "Thoughtful Responses",
      desc: "Answer each question carefully, applying your knowledge with focused attention to detail.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
    },
    {
      id: 4,
      title: "No Negative Marking",
      desc: "Score based on correct answers only. Attempt all ten questions to maximize your total score.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
    },
    {
      id: 5,
      title: "Browser Stability",
      desc: "Do not refresh or close the browser window during the quiz to avoid test disruption and data loss.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
    },
    {
      id: 6,
      title: "Progress Tracking",
      desc: "Performance is recorded comprehensively and reflected in your overall progress dashboard.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
    },
    {
      id: 7,
      title: "Diagnostic Value",
      desc: "Identify your strengths and areas for improvement through detailed performance analysis.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
    },
    {
      id: 8,
      title: "Strategic Preparation",
      desc: "Use these results to fine-tune your preparation strategy and focus on weak areas.",
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
    }
  ];

  return (
    <>
      <div className="min-h-screen flex flex-col" style={{ background: `linear-gradient(160deg, ${B.iceBlue} 0%, ${B.iceMid} 100%)` }}>
        {/* Hero Section */}
        <div className="relative overflow-hidden pt-16 pb-20 px-4" style={{ background: `linear-gradient(135deg, ${B.navyDeep}, ${B.navyDark})` }}>
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 0 L100 0 L100 100 Z" fill="white" />
            </svg>
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Knowledge Assessment · Comprehensive</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Ten Question <span className="text-cyan-300">Quiz</span>
            </h1>
            <p className="text-lg font-medium max-w-2xl mx-auto" style={{ color: 'rgba(190,227,248,0.7)' }}>
              Comprehensive assessment with ten questions spanning multiple domains. Evaluate your knowledge thoroughly and identify areas for improvement in your preparation journey.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 -mt-10 px-4 pb-16 relative z-20">
          <div className="max-w-5xl mx-auto">
            {/* Instructions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
              <div className="rounded-2xl p-6 flex items-center gap-5" style={{ background: 'rgba(37,99,235,0.05)', border: '1.5px solid rgba(37,99,235,0.15)' }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(37,99,235,0.1)', color: '#2563EB' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#2563EB] mb-1">Format</p>
                  <p className="text-2xl font-black" style={{ color: B.textDark }}>Extended Round</p>
                </div>
              </div>
              <div className="rounded-2xl p-6 flex items-center gap-5" style={{ background: 'rgba(21,128,61,0.05)', border: '1.5px solid rgba(21,128,61,0.15)' }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(21,128,61,0.1)', color: '#15803D' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#15803D] mb-1">Scope</p>
                  <p className="text-2xl font-black" style={{ color: B.textDark }}>10 Questions</p>
                </div>
              </div>
            </div>

            {/* Final Call to Action */}
            <div className="rounded-2xl p-8 text-center"
              style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)', border: '1.5px dashed rgba(18,77,150,0.25)' }}>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="text-left md:max-w-md">
                  <h3 className="text-xl font-black mb-2" style={{ color: B.textDark }}>Ready to begin the quiz?</h3>
                  <p className="text-sm font-medium" style={{ color: B.textMuted }}>
                    Click start to begin the ten-question comprehensive assessment. Manage your time carefully, attempt all questions, and focus on achieving your best performance.
                  </p>
                </div>
                <Link
                  href="/tenquestion/displaytenquestion"
                  className="group relative flex items-center gap-3 px-10 py-4 rounded-xl font-black text-lg text-white transition-all overflow-hidden shadow-2xl active:scale-95"
                  style={{ background: `linear-gradient(90deg, ${B.navyDark}, ${B.navy})` }}
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  Start Quiz
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
