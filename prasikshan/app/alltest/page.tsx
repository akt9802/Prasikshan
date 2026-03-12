"use client";

import React, { useState } from "react";
import Link from "next/link";
import Footer from "@/components/footer/Footer";

// ── Brand palette ─────────────────────────────────────────────────────────────
const B = {
  navy: '#124D96',
  navyDark: '#0D3A72',
  navyDeep: '#0A2A55',
  blue: '#1E5799',
  blueMid: '#2563EB',
  blueLight: '#60A5FA',
  iceBlue: '#EDF9FF',
  iceMid: '#D7F1FF',
  white: '#FFFFFF',
  textDark: '#0F172A',
  textMid: '#334155',
  textMuted: '#64748B',
  textLight: '#94A3B8',
};

interface TestItem {
  id: string;
  title: string;
  description: string;
  route: string;
  label: string;
  duration: string;
  questions: number;
  icon: React.ReactNode;
  accentHue: string;
  difficulty: 'Moderate' | 'Challenging' | 'Intense';
  category: string;
}

// ── Inline SVG icon set ───────────────────────────────────────────────────────
function IconBrain() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-2.5-2.5V2z" />
      <path d="M9.5 2A4.5 4.5 0 005 6.5c0 1.33.58 2.52 1.5 3.35" />
      <path d="M9.5 7a4.5 4.5 0 00-3 8.45" />
      <path d="M14.5 2A2.5 2.5 0 0112 4.5" />
      <path d="M14.5 2A4.5 4.5 0 0119 6.5c0 1.33-.58 2.52-1.5 3.35" />
      <path d="M14.5 7a4.5 4.5 0 013 8.45" />
      <line x1="12" y1="4.5" x2="12" y2="19.5" />
    </svg>
  );
}

function IconImage() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      <line x1="9" y1="7" x2="15" y2="7" />
      <line x1="9" y1="11" x2="12" y2="11" />
    </svg>
  );
}

function IconMessageCircle() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      <line x1="9" y1="9" x2="15" y2="9" />
      <line x1="9" y1="13" x2="13" y2="13" />
    </svg>
  );
}

function IconZap() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconMic() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0014 0" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  );
}

// ── Test data ─────────────────────────────────────────────────────────────────
const TESTS: TestItem[] = [
  {
    id: "oir",
    label: "OIR",
    title: "Officer Intelligence Rating",
    description: "Assess your logical and analytical abilities with verbal and non-verbal reasoning questions designed to evaluate your problem-solving skills.",
    route: "/alltest/oir",
    duration: "40 min",
    questions: 40,
    icon: <IconBrain />,
    accentHue: B.navy,
    difficulty: "Moderate",
    category: "Intelligence",
  },
  {
    id: "ppdt",
    label: "PPDT",
    title: "Picture Perception & Discussion",
    description: "View images, write creative stories, and participate in group discussions to showcase your observation and communication abilities.",
    route: "/alltest/ppdt",
    duration: "35 min",
    questions: 5,
    icon: <IconImage />,
    accentHue: '#1D4ED8',
    difficulty: "Moderate",
    category: "Psychology",
  },
  {
    id: "tat",
    label: "TAT",
    title: "Thematic Apperception Test",
    description: "Interpret images and create meaningful stories that reflect your emotional understanding and psychological perspective.",
    route: "/alltest/tat",
    duration: "60 min",
    questions: 12,
    icon: <IconBook />,
    accentHue: '#1E40AF',
    difficulty: "Challenging",
    category: "Psychology",
  },
  {
    id: "wat",
    label: "WAT",
    title: "Word Association Test",
    description: "Respond spontaneously to word prompts and evaluate your subconscious thinking patterns and emotional maturity.",
    route: "/alltest/wat",
    duration: "15 min",
    questions: 60,
    icon: <IconMessageCircle />,
    accentHue: '#1E5799',
    difficulty: "Intense",
    category: "Psychology",
  },
  {
    id: "srt",
    label: "SRT",
    title: "Situation Reaction Test",
    description: "Make quick decisions on real-life scenarios to assess your presence of mind and practical decision-making abilities.",
    route: "/alltest/srt",
    duration: "30 min",
    questions: 60,
    icon: <IconZap />,
    accentHue: '#1D4ED8',
    difficulty: "Intense",
    category: "Personality",
  },
  {
    id: "lecturette",
    label: "LECTURETTE",
    title: "Lecturette",
    description: "Choose a topic, prepare your thoughts, and deliver a structured speech demonstrating clarity and confidence.",
    route: "/alltest/lecturette",
    duration: "3 min",
    questions: 1,
    icon: <IconMic />,
    accentHue: '#1E40AF',
    difficulty: "Moderate",
    category: "Group Task",
  },
  {
    id: "pi",
    label: "PI",
    title: "Personal Interview",
    description: "Engage in a comprehensive interview to evaluate your personality traits, adaptability, and Officer-Like Qualities.",
    route: "/alltest/pi",
    duration: "30 min",
    questions: 1,
    icon: <IconUser />,
    accentHue: B.navy,
    difficulty: "Challenging",
    category: "Interview",
  },
];

const DIFFICULTY_STYLE: Record<TestItem['difficulty'], { color: string; bg: string; border: string }> = {
  Moderate: { color: '#15803D', bg: 'rgba(21,128,61,0.09)', border: 'rgba(21,128,61,0.25)' },
  Challenging: { color: '#B45309', bg: 'rgba(180,83,9,0.09)', border: 'rgba(180,83,9,0.25)' },
  Intense: { color: '#B91C1C', bg: 'rgba(185,28,28,0.08)', border: 'rgba(185,28,28,0.22)' },
};

// ── Card ──────────────────────────────────────────────────────────────────────
function TestCard({ test, index }: { test: TestItem; index: number }) {
  const [hovered, setHovered] = useState(false);
  const diff = DIFFICULTY_STYLE[test.difficulty];

  return (
    <Link href={test.route} aria-label={`Start ${test.title} — ${test.duration}, ${test.questions} questions`}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex flex-col h-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.72)',
          border: hovered ? `1.5px solid ${test.accentHue}` : '1.5px solid rgba(18,77,150,0.13)',
          boxShadow: hovered
            ? `0 20px 40px rgba(18,77,150,0.16), 0 4px 12px rgba(18,77,150,0.10)`
            : '0 2px 12px rgba(18,77,150,0.06)',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        {/* Accent top bar */}
        <div
          className="h-1.5 w-full shrink-0 transition-all duration-300"
          style={{ background: `linear-gradient(90deg, ${test.accentHue}, ${B.blueLight})`, opacity: hovered ? 1 : 0.75 }}
        />

        {/* Watermark number */}
        <div
          className="absolute top-3 right-4 font-black select-none pointer-events-none"
          style={{ fontSize: '5rem', color: test.accentHue, opacity: hovered ? 0.04 : 0.025, lineHeight: 1 }}
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, '0')}
        </div>

        <div className="flex flex-col flex-1 p-6">
          {/* Icon + label row */}
          <div className="flex items-center justify-between mb-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-300"
              style={{
                background: `linear-gradient(135deg, ${B.iceBlue}, ${B.iceMid})`,
                border: `1px solid rgba(18,77,150,0.12)`,
                color: test.accentHue,
                transform: hovered ? 'scale(1.08)' : 'scale(1)',
              }}
            >
              {test.icon}
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span
                className="inline-block px-3 py-1 text-xs font-black rounded-full tracking-wider"
                style={{ background: test.accentHue, color: '#fff', letterSpacing: '0.08em' }}
              >
                {test.label}
              </span>
              <span
                className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border"
                style={{ color: diff.color, background: diff.bg, borderColor: diff.border }}
              >
                {test.difficulty}
              </span>
            </div>
          </div>

          {/* Category */}
          <span className="text-xs font-bold mb-1 tracking-widest uppercase" style={{ color: B.textLight }}>
            {test.category}
          </span>

          {/* Title */}
          <h3 className="text-lg font-extrabold mb-2 leading-snug" style={{ color: B.textDark }}>
            {test.title}
          </h3>

          {/* Description */}
          <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: B.textMuted }}>
            {test.description}
          </p>

          {/* Stats */}
          <div
            className="flex items-center gap-5 mb-5 pb-5"
            style={{ borderBottom: `1px solid rgba(18,77,150,0.08)` }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: B.iceBlue, border: `1px solid ${B.iceMid}`, color: B.navy }}
              >
                <IconClock />
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: B.textLight }}>Duration</p>
                <p className="text-sm font-bold" style={{ color: B.textDark }}>{test.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: B.iceBlue, border: `1px solid ${B.iceMid}`, color: B.navy }}
              >
                <IconClipboard />
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: B.textLight }}>Questions</p>
                <p className="text-sm font-bold" style={{ color: B.textDark }}>{test.questions}</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300"
            style={{
              background: hovered
                ? `linear-gradient(90deg, ${B.navyDark}, ${test.accentHue})`
                : `linear-gradient(90deg, ${B.navy}, ${B.blue})`,
              color: '#fff',
              boxShadow: hovered ? `0 4px 16px rgba(18,77,150,0.35)` : 'none',
            }}
          >
            Start Practice
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Alltest() {
  return (
    <>
      <div
        className="min-h-screen"
        style={{ background: `linear-gradient(160deg, ${B.iceBlue} 0%, ${B.iceMid} 40%, #c8e8f8 100%)` }}
      >
        {/* ── Hero header ── */}
        <div
          className="py-14 px-4 md:px-8"
          style={{
            background: `linear-gradient(135deg, ${B.navyDeep} 0%, ${B.navyDark} 50%, ${B.navy} 100%)`,
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.10)', color: B.blueLight, border: '1px solid rgba(255,255,255,0.12)' }}
              >
                SSB Preparation
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
            >
              All Practice{' '}
              <span style={{ background: `linear-gradient(90deg, ${B.blueLight}, #93C5FD)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Modules
              </span>
            </h1>

            <p className="text-blue-200/80 text-base sm:text-lg font-medium max-w-2xl mb-8">
              Choose any test below to begin your preparation. Each module provides practice questions with detailed feedback.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-4">
              {[
                { value: '7', label: 'Test Modules' },
                { value: '2000+', label: 'Questions' },
                { value: '100%', label: 'Free Forever' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="px-5 py-3 rounded-xl border"
                  style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
                >
                  <p className="text-2xl font-black text-white">{value}</p>
                  <p className="text-xs text-blue-200/70 mt-0.5 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Cards grid ── */}
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTS.map((test, index) => (
              <TestCard key={test.id} test={test} index={index} />
            ))}
          </div>

          {/* ── Info banner ── */}
          <div
            className="mt-14 rounded-2xl p-8 md:p-10 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${B.navyDeep}, ${B.navy})`,
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 8px 32px rgba(18,77,150,0.25)',
            }}
          >
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
              style={{ background: 'rgba(37,99,235,0.18)', filter: 'blur(32px)' }} />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: 'rgba(18,77,150,0.22)', filter: 'blur(24px)' }} />

            <div className="relative z-10 max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
                About SSB Testing
              </h2>
              <p className="leading-relaxed mb-8 text-base" style={{ color: 'rgba(191,219,254,0.85)' }}>
                The Services Selection Board (SSB) conducts comprehensive psychological evaluations for Indian Armed Forces recruitment. Our practice modules cover all major test components to help you prepare effectively and build confidence for the real boards.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: '7', label: 'Test Modules', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
                  { value: '2000+', label: 'Practice Questions', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg> },
                  { value: '100%', label: 'Free Forever', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg> },
                ].map(({ value, label, icon }) => (
                  <div
                    key={label}
                    className="rounded-xl p-4 border text-center"
                    style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
                  >
                    <div className="flex justify-center mb-2">{icon}</div>
                    <p className="text-2xl font-black text-white">{value}</p>
                    <p className="text-xs mt-1 font-medium" style={{ color: 'rgba(191,219,254,0.7)' }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
