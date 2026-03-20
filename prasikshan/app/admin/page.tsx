"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OirSetBuilder from "@/components/admin/OirSetBuilder";
import WatSetBuilder from "@/components/admin/WatSetBuilder";
import SrtSetBuilder from "@/components/admin/SrtSetBuilder";
import PpdtSetBuilder from "@/components/admin/PpdtSetBuilder";

// ── Brand palette ─────────────────────────────────────────────────────────────
const B = {
  navy: '#124D96', navyDark: '#0D3A72', navyDeep: '#0A2A55',
  blueMid: '#2563EB', blueLight: '#60A5FA',
  iceBlue: '#EDF9FF', iceMid: '#D7F1FF',
  textDark: '#0F172A', textMid: '#334155', textMuted: '#475569', textLight: '#94A3B8',
};

const TEST_COLORS: Record<string, string> = {
  OIR: '#124D96', PPDT: '#0891B2', TAT: '#7C3AED',
  WAT: '#059669', SRT: '#DC2626', LECTURETTE: '#D97706', PI: '#9333EA',
};
type Tab = 'OIR' | 'PPDT' | 'TAT' | 'WAT' | 'SRT' | 'LECTURETTE' | 'PI';
const TABS: Tab[] = ['OIR', 'PPDT', 'TAT', 'WAT', 'SRT', 'LECTURETTE', 'PI'];

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const BrainIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-2.5-2.5V2z" /><path d="M9.5 2A4.5 4.5 0 005 6.5c0 1.33.58 2.52 1.5 3.35" /><path d="M9.5 7a4.5 4.5 0 00-3 8.45" /><path d="M14.5 2A2.5 2.5 0 0112 4.5" /><path d="M14.5 2A4.5 4.5 0 0119 6.5c0 1.33-.58 2.52-1.5 3.35" /><path d="M14.5 7a4.5 4.5 0 013 8.45" /></svg>;
const ImageIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>;
const BookIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>;
const MsgIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>;
const ZapIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
const MicIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10a7 7 0 0014 0" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>;
const UserIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;

const TAB_ICONS: Record<Tab, React.ReactNode> = {
  OIR: <BrainIcon />, PPDT: <ImageIcon />, TAT: <BookIcon />,
  WAT: <MsgIcon />, SRT: <ZapIcon />, LECTURETTE: <MicIcon />, PI: <UserIcon />,
};

const TAB_DESCRIPTIONS: Record<Tab, string> = {
  OIR: 'Create sets of 40 MCQ questions for the OIR test',
  WAT: 'Create sets of 60 words with example sentences for the WAT test',
  PPDT: 'Manage PPDT content',
  TAT: 'Manage TAT content',
  SRT: 'Create sets of 60 situations with optional reference reactions',
  LECTURETTE: 'Manage Lecturette content',
  PI: 'Manage PI content',
};

// ── Placeholder for unimplemented tabs ────────────────────────────────────────
function ComingSoon({ tab }: { tab: Tab }) {
  return (
    <div className="rounded-2xl p-12 text-center" style={{ background: 'rgba(255,255,255,0.78)', border: '1.5px solid rgba(18,77,150,0.13)', backdropFilter: 'blur(12px)' }}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ background: `${TEST_COLORS[tab]}15`, color: TEST_COLORS[tab], border: `1.5px solid ${TEST_COLORS[tab]}30` }}>
        {TAB_ICONS[tab]}
      </div>
      <h3 className="text-lg font-extrabold mb-2" style={{ color: B.textDark }}>{tab} Manager</h3>
      <p className="text-sm" style={{ color: B.textLight }}>Full question management for {tab} coming soon.</p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('OIR');
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const t = localStorage.getItem('token');
        if (!t) { router.push('/signin'); return; }

        const res = await fetch('/api/auth/userdetails', { headers: { Authorization: `Bearer ${t}` } });
        const data = await res.json();

        if (data.success && data.user?.role === 'admin') {
          setAuthorized(true);
          setToken(t);
        }
      } catch {/* access denied */} finally { setLoading(false); }
    };
    checkAdmin();
  }, [router]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: `linear-gradient(160deg,${B.iceBlue},${B.iceMid})` }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: B.iceMid, borderTopColor: B.navy }} />
        <p className="text-sm font-semibold" style={{ color: B.textMuted }}>Verifying access…</p>
      </div>
    </div>
  );

  if (!authorized) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: `linear-gradient(160deg,${B.iceBlue},${B.iceMid})` }}>
      <div className="flex flex-col items-center gap-6 text-center p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.78)' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        <div>
          <p className="text-lg font-semibold" style={{ color: B.textDark }}>Access Denied</p>
          <p className="text-sm mt-1" style={{ color: B.textLight }}>You don{"'"}t have permission to access this page</p>
        </div>
        <button onClick={() => router.push('/')} className="px-6 py-2.5 rounded-lg font-semibold text-sm" style={{ background: B.navy, color: '#fff' }}>
          Go Back Home
        </button>
      </div>
    </div>
  );

  const tc = TEST_COLORS[activeTab];

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(160deg,${B.iceBlue} 0%,${B.iceMid} 40%,#c8e8f8 100%)` }}>
      {/* ── Hero header ── */}
      <div className="py-10 px-6 md:px-12" style={{ background: `linear-gradient(135deg,${B.navyDeep} 0%,${B.navyDark} 50%,${B.navy} 100%)` }}>
        <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between gap-6">
          <div>
            <span className="inline-block text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full mb-3"
              style={{ background: 'rgba(255,255,255,0.10)', color: B.blueLight, border: '1px solid rgba(255,255,255,0.15)' }}>
              Admin Panel
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Test Content Manager</h1>
            <p className="text-sm font-medium mt-2" style={{ color: 'rgba(191,219,254,0.75)' }}>
              Upload and manage questions &amp; sets for all SSB test modules
            </p>
          </div>
          <Link href="/" className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ background: 'rgba(255,255,255,0.10)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.20)' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back to Site
          </Link>
        </div>
      </div>

      <div className="w-full max-w-[1800px] mx-auto px-6 md:px-12 py-10">
        {/* ── Tab bar ── */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 mb-8">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="rounded-xl p-3 text-center transition-all duration-200 hover:scale-105"
              style={{
                background: activeTab === tab ? `${TEST_COLORS[tab]}18` : 'rgba(255,255,255,0.65)',
                border: activeTab === tab ? `2px solid ${TEST_COLORS[tab]}55` : '1.5px solid rgba(18,77,150,0.12)',
                boxShadow: activeTab === tab ? `0 4px 16px ${TEST_COLORS[tab]}25` : '0 2px 8px rgba(18,77,150,0.06)',
                backdropFilter: 'blur(8px)',
              }}>
              <div className="flex justify-center mb-1.5" style={{ color: TEST_COLORS[tab] }}>{TAB_ICONS[tab]}</div>
              <p className="text-xs font-black" style={{ color: activeTab === tab ? TEST_COLORS[tab] : B.textMuted }}>{tab}</p>
            </button>
          ))}
        </div>

        {/* ── Active tab label ── */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${tc}15`, color: tc, border: `1.5px solid ${tc}30` }}>
            {TAB_ICONS[activeTab]}
          </div>
          <div>
            <h2 className="text-lg font-extrabold" style={{ color: B.textDark }}>{activeTab} Manager</h2>
            <p className="text-xs" style={{ color: B.textLight }}>{TAB_DESCRIPTIONS[activeTab]}</p>
          </div>
        </div>

        {/* ── Content ── */}
        {activeTab === 'OIR' && <OirSetBuilder token={token} />}
        {activeTab === 'WAT' && <WatSetBuilder token={token} />}
        {activeTab === 'SRT' && <SrtSetBuilder token={token} />}
        {activeTab === 'PPDT' && <PpdtSetBuilder token={token} />}
        {activeTab !== 'OIR' && activeTab !== 'WAT' && activeTab !== 'SRT' && activeTab !== 'PPDT' && <ComingSoon tab={activeTab} />}
      </div>
    </div>
  );
}
