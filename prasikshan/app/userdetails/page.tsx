"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/footer/Footer";
import {
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer,
} from "recharts";

// ── Brand palette ──────────────────────────────────────────────────────────────
const B = {
  navy: '#124D96',
  navyDark: '#0D3A72',
  navyDeep: '#0A2A55',
  blue: '#1E5799',
  blueMid: '#2563EB',
  blueLight: '#60A5FA',
  iceBlue: '#EDF9FF',
  iceMid: '#D7F1FF',
  iceDeep: '#BEE3F8',
  textDark: '#0F172A',
  textMid: '#334155',
  textMuted: '#475569',
  textLight: '#94A3B8',
  white: '#FFFFFF',
};

// Distinct per-test color — used in pie chart, selector, stat tiles
const TEST_COLORS: Record<string, string> = {
  OIR: '#124D96', // brand navy   — Intelligence
  PPDT: '#0891B2', // cyan          — Visual Perception
  TAT: '#7C3AED', // violet        — Psychology / Stories
  WAT: '#059669', // emerald       — Words / Language
  SRT: '#DC2626', // red           — Urgency / Reaction
  LECTURETTE: '#D97706', // amber         — Speaking / Delivery
};
const PIE_COLORS = Object.values(TEST_COLORS);

interface UserDetails {
  name: string;
  email: string;
  testsTaken?: { testName: string; score: number; timeTaken: number; dateTaken: string }[];
}

const mockUserDetails: UserDetails = {
  name: "Aman Kumar",
  email: "aman@example.com",
  testsTaken: [
    { testName: "OIR", score: 28, timeTaken: 2400, dateTaken: new Date(Date.now() - 25 * 86400000).toISOString() },
    { testName: "OIR", score: 32, timeTaken: 2200, dateTaken: new Date(Date.now() - 20 * 86400000).toISOString() },
    { testName: "OIR", score: 35, timeTaken: 2100, dateTaken: new Date(Date.now() - 15 * 86400000).toISOString() },
    { testName: "OIR", score: 38, timeTaken: 2050, dateTaken: new Date(Date.now() - 10 * 86400000).toISOString() },
    { testName: "OIR", score: 35, timeTaken: 2150, dateTaken: new Date(Date.now() - 5 * 86400000).toISOString() },
    { testName: "PPDT", score: 30, timeTaken: 1800, dateTaken: new Date(Date.now() - 23 * 86400000).toISOString() },
    { testName: "PPDT", score: 32, timeTaken: 1750, dateTaken: new Date(Date.now() - 18 * 86400000).toISOString() },
    { testName: "PPDT", score: 35, timeTaken: 1700, dateTaken: new Date(Date.now() - 12 * 86400000).toISOString() },
    { testName: "TAT", score: 25, timeTaken: 2200, dateTaken: new Date(Date.now() - 22 * 86400000).toISOString() },
    { testName: "TAT", score: 28, timeTaken: 2100, dateTaken: new Date(Date.now() - 17 * 86400000).toISOString() },
    { testName: "WAT", score: 26, timeTaken: 1500, dateTaken: new Date(Date.now() - 21 * 86400000).toISOString() },
    { testName: "WAT", score: 28, timeTaken: 1450, dateTaken: new Date(Date.now() - 14 * 86400000).toISOString() },
    { testName: "SRT", score: 22, timeTaken: 1800, dateTaken: new Date(Date.now() - 19 * 86400000).toISOString() },
    { testName: "SRT", score: 25, timeTaken: 1750, dateTaken: new Date(Date.now() - 13 * 86400000).toISOString() },
    { testName: "LECTURETTE", score: 24, timeTaken: 1900, dateTaken: new Date(Date.now() - 16 * 86400000).toISOString() },
  ],
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmtTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

function StatTile({ value, label, accent = B.navy }: { value: string | number; label: string; accent?: string }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col"
      style={{ background: 'rgba(255,255,255,0.72)', border: '1.5px solid rgba(18,77,150,0.13)', backdropFilter: 'blur(8px)', boxShadow: '0 2px 12px rgba(18,77,150,0.07)' }}>
      <span className="text-3xl font-black mb-1" style={{ color: accent }}>{value}</span>
      <span className="text-xs font-semibold" style={{ color: B.textLight }}>{label}</span>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.72)', border: '1.5px solid rgba(18,77,150,0.13)', backdropFilter: 'blur(10px)', boxShadow: '0 2px 12px rgba(18,77,150,0.07)' }}>
      <h3 className="text-base font-extrabold mb-5 pb-4" style={{ color: B.textDark, borderBottom: '1px solid rgba(18,77,150,0.08)' }}>{title}</h3>
      {children}
    </div>
  );
}

// ── Distribution Pie ───────────────────────────────────────────────────────────
function TotalTestChart({ userDetails }: { userDetails: UserDetails }) {
  const data = (() => {
    const counts: Record<string, number> = {};
    userDetails.testsTaken?.forEach(t => { const n = t.testName.toUpperCase(); counts[n] = (counts[n] || 0) + 1; });
    return Object.entries(counts).map(([testName, count]) => ({ testName, count }));
  })();

  return (
    <ChartCard title="Test Distribution">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="testName" cx="50%" cy="50%" outerRadius={90} label>
              {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 16px rgba(18,77,150,0.15)', fontSize: 13 }} />
            <Legend wrapperStyle={{ paddingTop: 16, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="py-16 text-center text-sm font-medium" style={{ color: B.textLight }}>Start taking tests to see your distribution</div>
      )}
    </ChartCard>
  );
}

// ── Activity Line ──────────────────────────────────────────────────────────────
function MonthlyTestChart({ userDetails }: { userDetails: UserDetails }) {
  const data = (() => {
    const today = new Date();
    const ago30 = new Date(today); ago30.setDate(today.getDate() - 30);
    const counts: Record<string, number> = {};
    userDetails.testsTaken?.forEach(t => {
      if (!t.dateTaken) return;
      const d = new Date(t.dateTaken);
      if (d >= ago30 && d <= today) {
        const key = d.toISOString().split('T')[0];
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([date, tests]) => ({ date, tests })).sort((a, b) => a.date.localeCompare(b.date));
  })();

  const total = data.reduce((s, d) => s + d.tests, 0);

  return (
    <ChartCard title="Activity — Last 30 Days">
      {data.length > 0 ? (
        <>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="rounded-xl p-3 text-center" style={{ background: 'linear-gradient(135deg,#124D96,#0D3A72)', color: '#fff' }}>
              <p className="text-2xl font-black">{total}</p>
              <p className="text-xs opacity-80 mt-0.5">Total Tests</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: 'linear-gradient(135deg,#059669,#047857)', color: '#fff' }}>
              <p className="text-2xl font-black">{data.length}</p>
              <p className="text-xs opacity-80 mt-0.5">Active Days</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: 'linear-gradient(135deg,#D97706,#B45309)', color: '#fff' }}>
              <p className="text-2xl font-black">{(total / data.length).toFixed(1)}</p>
              <p className="text-xs opacity-80 mt-0.5">Daily Avg</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(18,77,150,0.08)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke={B.textLight} />
              <YAxis stroke={B.textLight} />
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 16px rgba(18,77,150,0.15)', fontSize: 13 }} />
              <Line type="monotone" dataKey="tests" stroke={B.navy} strokeWidth={2.5} name="Tests" dot={{ fill: B.navy, r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </>
      ) : (
        <div className="py-16 text-center text-sm font-medium" style={{ color: B.textLight }}>No activity in the last 30 days</div>
      )}
    </ChartCard>
  );
}

// ── Score Trend Area ───────────────────────────────────────────────────────────
function TestScoreChart({ userDetails, testName }: { userDetails: UserDetails; testName: string }) {
  const data = (userDetails.testsTaken || [])
    .filter(t => t.testName.toUpperCase() === testName)
    .sort((a, b) => new Date(a.dateTaken).getTime() - new Date(b.dateTaken).getTime())
    .map((t, i) => ({ attempt: `Attempt ${i + 1}`, score: t.score, timeInSeconds: t.timeTaken }));

  const latest = data.at(-1)?.score ?? 0;
  const best = data.length ? Math.max(...data.map(d => d.score)) : 0;
  const testColor = TEST_COLORS[testName] ?? B.navy;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Latest Score', value: latest, bg: `linear-gradient(135deg,${testColor},${testColor}cc)` },
          { label: 'Best Score', value: best, bg: 'linear-gradient(135deg,#059669,#047857)' },
          { label: 'Attempts', value: data.length, bg: 'linear-gradient(135deg,#0891B2,#0E7490)' },
          { label: 'Last Time', value: data.at(-1) ? fmtTime(data.at(-1)!.timeInSeconds) : '—', bg: 'linear-gradient(135deg,#D97706,#B45309)' },
        ].map(({ label, value, bg }) => (
          <div key={label} className="rounded-xl p-4 text-center" style={{ background: bg, color: '#fff' }}>
            <p className="text-2xl font-black">{value}</p>
            <p className="text-xs opacity-80 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {data.length > 0 ? (
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.90)', border: `1.5px solid ${testColor}25` }}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 50 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={testColor} stopOpacity={0.22} />
                  <stop offset="95%" stopColor={testColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(18,77,150,0.08)" />
              <XAxis dataKey="attempt" fontSize={11} stroke={B.textLight} angle={-30} textAnchor="end" height={55} />
              <YAxis domain={[0, 50]} fontSize={11} stroke={B.textLight} />
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 16px rgba(18,77,150,0.15)', fontSize: 13 }} formatter={(v) => [v, 'Score']} />
              <Area type="monotone" dataKey="score" stroke={testColor} strokeWidth={2.5} fillOpacity={1} fill="url(#scoreGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="rounded-2xl py-16 text-center text-sm font-medium" style={{ background: 'rgba(237,249,255,0.6)', color: B.textLight }}>
          No attempts for this test yet
        </div>
      )}
    </div>
  );
}

// ── Test selector buttons ──────────────────────────────────────────────────────
const TEST_TABS = ['OIR', 'PPDT', 'TAT', 'WAT', 'SRT', 'LECTURETTE'];

// ── Page ───────────────────────────────────────────────────────────────────────
export default function UserDetails() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [selectedTest, setSelectedTest] = useState('OIR');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => { setUserDetails(mockUserDetails); setLoading(false); }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/';
  };

  /* derived stats */
  const totalAttempts = userDetails?.testsTaken?.length ?? 0;
  const scores = userDetails?.testsTaken?.map(t => t.score) ?? [];
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10 : 0;
  const testTypesDone = new Set(userDetails?.testsTaken?.map(t => t.testName)).size;

  /* initials from name */
  const initials = userDetails?.name
    ? userDetails.name.split(' ').map(n => n[0] || '').slice(0, 2).join('').toUpperCase()
    : '?';

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: `linear-gradient(160deg,${B.iceBlue},${B.iceMid})` }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: B.iceMid, borderTopColor: B.navy }} />
        <p className="text-sm font-semibold" style={{ color: B.textMuted }}>Loading your profile…</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(160deg,${B.iceBlue} 0%,${B.iceMid} 40%,#c8e8f8 100%)` }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {userDetails ? (
          <>
            {/* ── Hero card ── */}
            <div
              className="relative rounded-2xl overflow-hidden px-8 py-10"
              style={{ background: `linear-gradient(135deg,${B.navyDeep} 0%,${B.navyDark} 50%,${B.navy} 100%)`, boxShadow: '0 12px 40px rgba(18,77,150,0.28)' }}
            >
              {/* Glow blobs */}
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
                style={{ background: 'rgba(37,99,235,0.20)', filter: 'blur(40px)' }} />
              <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full pointer-events-none"
                style={{ background: 'rgba(18,77,150,0.25)', filter: 'blur(32px)' }} />

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>

              <div className="relative z-10 flex items-center gap-5">
                {/* Avatar initials */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black shrink-0"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.30)', color: '#fff' }}>
                  {initials}
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: B.iceDeep, opacity: 0.7 }}>SSB Aspirant</p>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Welcome back, {userDetails.name}
                  </h1>
                  <p className="text-sm mt-1 font-medium" style={{ color: 'rgba(191,219,254,0.80)' }}>
                    Track your performance and monitor your progress toward SSB success
                  </p>
                </div>
              </div>
            </div>

            {/* ── Overview stats ── */}
            <div className="grid grid-cols-3 gap-4">
              <StatTile value={totalAttempts} label="Total Attempts" accent={B.navy} />
              <StatTile value={avgScore} label="Average Score" accent={B.blueMid} />
              <StatTile value={testTypesDone} label="Test Types Done" accent={B.blue} />
            </div>

            {/* ── Overview charts ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TotalTestChart userDetails={userDetails} />
              <MonthlyTestChart userDetails={userDetails} />
            </div>

            {/* ── Detailed analysis ── */}
            <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'rgba(255,255,255,0.72)', border: '1.5px solid rgba(18,77,150,0.13)', backdropFilter: 'blur(10px)', boxShadow: '0 2px 12px rgba(18,77,150,0.07)' }}>
              <div className="mb-7 pb-5" style={{ borderBottom: '1px solid rgba(18,77,150,0.08)' }}>
                <p className="text-xs font-black tracking-widest uppercase mb-1" style={{ color: B.textLight }}>Performance</p>
                <h2 className="text-xl font-extrabold" style={{ color: B.textDark }}>Detailed Score Analysis</h2>
                <p className="text-sm mt-1" style={{ color: B.textMuted }}>Select a test type to explore your score trend</p>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Test selector */}
                <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 lg:w-44 shrink-0">
                  {TEST_TABS.map(name => {
                    const active = selectedTest === name;
                    const tc = TEST_COLORS[name] ?? B.navy;
                    return (
                      <button
                        key={name}
                        onClick={() => setSelectedTest(name)}
                        className="shrink-0 lg:w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-2.5"
                        style={{
                          background: active ? `${tc}18` : 'transparent',
                          color: active ? tc : B.textMuted,
                          border: active ? `1.5px solid ${tc}40` : '1.5px solid rgba(18,77,150,0.10)',
                          boxShadow: active ? `0 2px 12px ${tc}25` : 'none',
                        }}
                      >
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: tc }} />
                        {name}
                      </button>
                    );
                  })}
                </div>

                {/* Chart */}
                <div className="flex-1 min-w-0">
                  <TestScoreChart userDetails={userDetails} testName={selectedTest} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-base font-medium" style={{ color: B.textMuted }}>Unable to load user details</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
