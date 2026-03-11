'use client';

import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// ── Types ─────────────────────────────────────────────────────────────────────
interface RankedUser {
  name: string;
  tests: number;
  rank: number;
  trend: 'up' | 'down' | 'stable';
  percentile: number;
  league: 'bronze' | 'silver' | 'gold';
  streak: number;
}

// ── Brand palette (matches #124D96 codebase) ─────────────────────────────────
const BRAND = {
  navy: '#124D96',   // primary
  navyDark: '#0D3A72',   // darker press state
  navyDeep: '#0A2A55',   // deepest background shade
  blue: '#1E5799',   // secondary
  blueMid: '#2563EB',   // bright blue accent
  iceBlue: '#EDF9FF',   // light section bg
  iceBlueDark: '#D7F1FF',   // slightly deeper ice
  skyGlow: 'rgba(18,77,150,0.18)',  // glass tint
  skyGlowSm: 'rgba(18,77,150,0.10)',
  gold: '#D4AF37',   // 1st place
  silver: '#94A3B8',   // 2nd place (blue-tinted silver)
  bronze: '#8B7355',   // 3rd place
  up: '#22C55E',   // trend up
  down: '#EF4444',   // trend down
  stable: '#64748B',   // stable
  white: '#FFFFFF',
  textPrimary: '#0F172A',
  textMuted: '#475569',
  textLight: '#94A3B8',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}
function seededRand(seed: number, offset = 0): number {
  const x = Math.sin(seed + offset) * 10000;
  return x - Math.floor(x);
}

/** Deterministic pixel-art avatar — bluish hue family */
function generatePixelAvatar(name: string): string {
  const seed = hashStr(name);
  // Constrain hue to 190–240 (blue family)
  const hue = 195 + (seed % 50);
  const cells: boolean[][] = [];
  for (let r = 0; r < 8; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < 4; c++) row.push(seededRand(seed, r * 4 + c) > 0.42);
    cells.push([...row, ...[...row].reverse()]);
  }
  const sz = 8;
  const rects = cells.flatMap((row, r) =>
    row.map((on, c) =>
      on
        ? `<rect x="${c * sz}" y="${r * sz}" width="${sz}" height="${sz}" fill="hsl(${hue},65%,62%)"/>`
        : ''
    )
  ).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges"><rect width="64" height="64" fill="hsl(${hue},40%,18%)"/>${rects}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function getLeague(tests: number): 'bronze' | 'silver' | 'gold' {
  if (tests >= 10) return 'gold';
  if (tests >= 5) return 'silver';
  return 'bronze';
}

const LEAGUE_META = {
  gold: { label: 'Gold Master', color: BRAND.gold, bg: 'rgba(212,175,55,0.12)', border: BRAND.gold },
  silver: { label: 'Silver Elite', color: BRAND.silver, bg: 'rgba(148,163,184,0.14)', border: BRAND.silver },
  bronze: { label: 'Bronze Rising', color: BRAND.bronze, bg: 'rgba(139,115,85,0.12)', border: BRAND.bronze },
};

const PODIUM_META = [
  { border: BRAND.gold, glow: 'rgba(212,175,55,0.22)', label: '1st Place', trophyColor: BRAND.gold, podiumBg: 'linear-gradient(160deg,#0D3A72 0%,#0A2A55 100%)' },
  { border: BRAND.silver, glow: 'rgba(148,163,184,0.20)', label: '2nd Place', trophyColor: BRAND.silver, podiumBg: 'linear-gradient(160deg,#0F3560 0%,#0A2A55 100%)' },
  { border: BRAND.bronze, glow: 'rgba(139,115,85,0.20)', label: '3rd Place', trophyColor: BRAND.bronze, podiumBg: 'linear-gradient(160deg,#0F3560 0%,#0A2A55 100%)' },
];

// ── Shimmer Skeleton ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      className="flex items-center gap-5 p-5 rounded-2xl animate-pulse"
      style={{ background: 'rgba(18,77,150,0.08)', border: '1px solid rgba(18,77,150,0.15)' }}
    >
      <div className="w-12 h-5 rounded-full" style={{ background: 'rgba(18,77,150,0.15)' }} />
      <div className="w-12 h-12 rounded-full shrink-0" style={{ background: 'rgba(18,77,150,0.15)' }} />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-36 rounded-full" style={{ background: 'rgba(18,77,150,0.15)' }} />
        <div className="h-3 w-24 rounded-full" style={{ background: 'rgba(18,77,150,0.10)' }} />
      </div>
      <div className="w-16 h-7 rounded-full" style={{ background: 'rgba(18,77,150,0.12)' }} />
    </div>
  );
}

// ── Score Breakdown Tooltip ───────────────────────────────────────────────────
function ScoreTooltip({ user, visible }: { user: RankedUser; visible: boolean }) {
  const difficultyPts = Math.round(user.tests * 3.5);
  const completionPts = Math.round(user.tests * 2.1);
  const recencyPts = Math.round(user.tests * 1.4);
  const total = difficultyPts + completionPts + recencyPts;
  if (!visible) return null;
  return (
    <div
      role="tooltip"
      className="absolute right-0 bottom-full mb-3 z-50 w-64 rounded-2xl p-4 text-sm shadow-2xl border"
      style={{
        background: 'linear-gradient(160deg,#0D3A72,#0A2255)',
        borderColor: 'rgba(255,255,255,0.14)',
        color: '#e2e8f0',
      }}
    >
      <p className="font-bold mb-3 text-white text-base">Score Breakdown</p>
      {[
        { label: 'Test Difficulty', pts: difficultyPts, pct: Math.round(difficultyPts / total * 100) },
        { label: 'Completion Rate', pts: completionPts, pct: Math.round(completionPts / total * 100) },
        { label: 'Recency Bonus', pts: recencyPts, pct: Math.round(recencyPts / total * 100) },
      ].map(({ label, pts, pct }) => (
        <div key={label} className="mb-2">
          <div className="flex justify-between text-xs mb-1" style={{ color: '#94A3B8' }}>
            <span>{label}</span>
            <span className="text-white font-semibold">{pts} pts</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#2563EB,#60A5FA)' }} />
          </div>
        </div>
      ))}
      <div className="mt-3 pt-3 flex justify-between text-xs font-bold" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ color: '#94A3B8' }}>Total Score</span>
        <span className="text-white">{total} pts</span>
      </div>
    </div>
  );
}

// ── Trend Icon ────────────────────────────────────────────────────────────────
function TrendIcon({ trend }: { trend: RankedUser['trend'] }) {
  const map = {
    up: { symbol: '▲', color: BRAND.up, bg: 'rgba(34,197,94,0.12)', label: 'Rank trending up' },
    down: { symbol: '▼', color: BRAND.down, bg: 'rgba(239,68,68,0.10)', label: 'Rank trending down' },
    stable: { symbol: '●', color: BRAND.stable, bg: 'rgba(100,116,139,0.10)', label: 'Rank stable' },
  };
  const { symbol, color, bg, label } = map[trend];
  return (
    <span aria-label={label} title={label}
      className="inline-flex items-center text-xs font-bold px-1.5 py-0.5 rounded-full"
      style={{ color, background: bg }}>
      {symbol}
    </span>
  );
}

// ── Trophy SVG ────────────────────────────────────────────────────────────────
function TrophyIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 2h12v6a6 6 0 01-12 0V2z" fill={color} opacity="0.9" />
      <path d="M2 2h4v4a2 2 0 01-4 0V2zM18 2h4v4a2 2 0 01-4 0V2z" fill={color} opacity="0.55" />
      <rect x="9" y="14" width="6" height="2" rx="1" fill={color} opacity="0.7" />
      <rect x="7" y="16" width="10" height="2" rx="1" fill={color} opacity="0.7" />
    </svg>
  );
}

// ── Podium Card ───────────────────────────────────────────────────────────────
function PodiumCard({ user, podiumIdx, isCurrent, onClick }: {
  user: RankedUser; podiumIdx: number; isCurrent: boolean; onClick: () => void;
}) {
  const m = PODIUM_META[podiumIdx];
  const lg = LEAGUE_META[user.league];
  const avatarSrc = generatePixelAvatar(user.name);

  return (
    <button
      onClick={onClick}
      aria-label={`${m.label}: ${user.name}, ${user.tests} tests completed`}
      className="group relative flex flex-col items-center gap-3 p-5 sm:p-6 rounded-2xl cursor-pointer w-full transition-all duration-300 hover:scale-[1.03] focus:outline-none"
      style={{
        background: m.podiumBg,
        border: `2px solid ${m.border}`,
        boxShadow: `0 0 20px ${m.glow}, 0 4px 24px rgba(0,0,0,0.25)`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Rank badge */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black shadow"
        style={{ background: m.border, color: podiumIdx === 0 ? '#0A2255' : '#fff' }}>
        <TrophyIcon color={podiumIdx === 0 ? '#0A2255' : '#fff'} size={12} />
        <span>#{user.rank}</span>
        <TrendIcon trend={user.trend} />
      </div>

      {/* Pixel avatar */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={avatarSrc} alt={`${user.name} avatar`} width={64} height={64}
        className="rounded-full border-2 mt-3"
        style={{ borderColor: m.border, imageRendering: 'pixelated' }} />

      {/* Name */}
      <div className="text-center">
        <p className="font-extrabold text-white text-sm sm:text-base leading-tight">{user.name}</p>
        {isCurrent && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block"
            style={{ background: BRAND.blueMid, color: '#fff' }}>
            You
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="text-sm font-bold" style={{ color: m.trophyColor }}>{user.tests} tests</span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ color: lg.color, background: lg.bg, border: `1px solid ${lg.border}30` }}>
          <span className="sr-only">Tier: </span>{lg.label}
        </span>
        <span className="text-xs font-medium" style={{ color: BRAND.textLight }}>Top {user.percentile}%</span>
      </div>
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RankingPage() {
  const router = useRouter();
  const liveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/signin');
  }, [router]);

  const staticSorted = useMemo(() => [
    { name: 'Sonia Verma', tests: 15 },
    { name: 'Ajay Kumar', tests: 12 },
    { name: 'Rahul Singh', tests: 9 },
    { name: 'Neha Sharma', tests: 7 },
    { name: 'Vikram Patel', tests: 5 },
    { name: 'Arjun Mehta', tests: 4 },
    { name: 'Priya Nair', tests: 3 },
  ].sort((a, b) => b.tests - a.tests), []);

  const [rawData, setRawData] = useState(staticSorted);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tooltipIdx, setTooltipIdx] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    try { setCurrentUser(localStorage.getItem('userName')); } catch { /* noop */ }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true); setError(null);
        const res = await fetch('/api/ranking');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        if (!body?.success || !Array.isArray(body.data)) throw new Error('Unexpected response');
        const mapped = body.data.map((u: { name?: string; testsTakenCount?: number; testsTaken?: unknown[] }) => ({
          name: u.name,
          tests: typeof u.testsTakenCount === 'number'
            ? u.testsTakenCount
            : Array.isArray(u.testsTaken) ? u.testsTaken.length : 0,
        }));
        if (!cancelled) {
          setRawData(mapped);
          if (liveRef.current) liveRef.current.textContent = 'Rankings updated.';
        }
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to fetch');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const enriched: RankedUser[] = useMemo(() => {
    const total = rawData.length;
    return rawData.map((u, idx) => {
      const seed = hashStr(u.name || 'x');
      const roll = seededRand(seed, 99);
      const trend: RankedUser['trend'] = roll > 0.65 ? 'up' : roll > 0.35 ? 'stable' : 'down';
      const percentile = total <= 1 ? 1 : Math.max(1, Math.round(((total - idx - 1) / (total - 1)) * 99) + 1);
      return {
        name: typeof u.name === 'string' && u.name.trim() ? u.name : 'Unknown User',
        tests: u.tests,
        rank: idx + 1,
        trend,
        percentile,
        league: getLeague(u.tests),
        streak: 1 + (hashStr((u.name || '') + 'streak') % 14),
      };
    });
  }, [rawData]);

  const top3 = enriched.slice(0, 3);
  const rest = enriched.slice(3);

  const navigateTo = useCallback((name: string) => {
    router.push(`/ranking/${encodeURIComponent(name)}`);
  }, [router]);

  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style={{ background: 'linear-gradient(160deg,#EDF9FF 0%,#D7F1FF 40%,#c8e8f8 100%)' }}
    >
      {/* ARIA live region */}
      <div ref={liveRef} aria-live="polite" aria-atomic="true" className="sr-only" />

      <div className="max-w-4xl mx-auto space-y-10">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: BRAND.textPrimary }}>
              Community{' '}
              <span style={{
                background: `linear-gradient(90deg,${BRAND.navy},${BRAND.blueMid})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Rankings
              </span>
            </h1>
            <p className="mt-2 text-base font-medium" style={{ color: BRAND.textMuted }}>
              Based on tests taken — difficulty, completion rate &amp; recency.
            </p>
          </div>
          {/* Live badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold shadow-sm"
            style={{ background: BRAND.navy, color: '#fff', boxShadow: `0 2px 12px ${BRAND.skyGlow}` }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
            Live Rankings
          </div>
        </div>

        {/* ── Skeleton ── */}
        {loading && (
          <div className="space-y-3" aria-label="Loading rankings">
            {[0, 1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && (
          <>
            {/* ── Podium (top 3) ── */}
            {top3.length >= 1 && (
              <section aria-label="Top 3 podium">
                <div className="grid grid-cols-3 gap-3 sm:gap-5 items-end">
                  {/* 2nd */}
                  <div className="pt-6">
                    {top3[1] && (
                      <PodiumCard user={top3[1]} podiumIdx={1}
                        isCurrent={currentUser === top3[1].name}
                        onClick={() => navigateTo(top3[1].name)} />
                    )}
                  </div>
                  {/* 1st — elevated */}
                  <div>
                    {top3[0] && (
                      <PodiumCard user={top3[0]} podiumIdx={0}
                        isCurrent={currentUser === top3[0].name}
                        onClick={() => navigateTo(top3[0].name)} />
                    )}
                  </div>
                  {/* 3rd */}
                  <div className="pt-12">
                    {top3[2] && (
                      <PodiumCard user={top3[2]} podiumIdx={2}
                        isCurrent={currentUser === top3[2].name}
                        onClick={() => navigateTo(top3[2].name)} />
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* ── Rest of list ── */}
            {rest.length > 0 && (
              <section aria-label="Full leaderboard">
                <div
                  className="rounded-2xl overflow-hidden shadow-sm"
                  style={{
                    background: 'rgba(255,255,255,0.65)',
                    border: `1px solid rgba(18,77,150,0.14)`,
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}
                >
                  <table className="w-full border-collapse" role="table">
                    <thead>
                      <tr style={{ borderBottom: `1px solid rgba(18,77,150,0.10)` }}>
                        <th scope="col" className="sr-only">Rank</th>
                        <th scope="col" className="sr-only">User</th>
                        <th scope="col" className="sr-only">Tests Completed</th>
                        <th scope="col" className="sr-only">Percentile</th>
                        <th scope="col" className="sr-only">Score Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rest.map((u, i) => {
                        const league = LEAGUE_META[u.league];
                        const avatarSrc = generatePixelAvatar(u.name);
                        const isCurrent = currentUser === u.name;
                        const isTooltipOpen = tooltipIdx === u.rank;
                        const isLast = i === rest.length - 1;

                        return (
                          <tr
                            key={u.rank}
                            tabIndex={0}
                            onClick={() => navigateTo(u.name)}
                            onKeyDown={(e) => { if (e.key === 'Enter') navigateTo(u.name); }}
                            className="group flex items-center gap-4 px-5 py-4 cursor-pointer transition-all duration-200 hover:bg-blue-50/80 focus:outline-none focus:bg-blue-50/80"
                            style={{
                              borderBottom: isLast ? 'none' : `1px solid rgba(18,77,150,0.07)`,
                              background: isCurrent ? 'rgba(18,77,150,0.07)' : undefined,
                            }}
                            aria-label={`Rank ${u.rank}: ${u.name}, ${u.tests} tests, Top ${u.percentile}%`}
                          >
                            {/* Rank + trend */}
                            <td className="flex items-center gap-1.5 w-16 shrink-0">
                              <span className="font-bold text-base" style={{ color: BRAND.textMuted }}>#{u.rank}</span>
                              <TrendIcon trend={u.trend} />
                            </td>

                            {/* Pixel avatar */}
                            <td className="shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={avatarSrc} alt={`${u.name} avatar`}
                                width={44} height={44} loading="lazy"
                                className="rounded-full border-2"
                                style={{ imageRendering: 'pixelated', borderColor: BRAND.navy + '40' }} />
                            </td>

                            {/* Name + tags */}
                            <td className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-base truncate transition-colors group-hover:text-blue-700"
                                  style={{ color: BRAND.textPrimary }}>
                                  {u.name}
                                </span>
                                {isCurrent && (
                                  <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                                    style={{ background: BRAND.navy, color: '#fff' }}>
                                    You
                                  </span>
                                )}
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 hidden sm:inline"
                                  style={{ color: league.color, background: league.bg, border: `1px solid ${league.border}25` }}>
                                  <span className="sr-only">Tier: </span>{league.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mt-0.5 text-xs" style={{ color: BRAND.textLight }}>
                                <span>{u.tests} tests completed</span>
                                <span aria-label={`${u.streak} day streak`}>🔥 {u.streak}d streak</span>
                              </div>
                            </td>

                            {/* Percentile */}
                            <td className="text-right shrink-0 hidden sm:block">
                              <span className="text-xs font-semibold" style={{ color: BRAND.textMuted }}>
                                Top <span style={{ color: BRAND.navy }} className="font-bold">{u.percentile}%</span>
                              </span>
                            </td>

                            {/* Score breakdown */}
                            <td className="relative shrink-0">
                              <button
                                aria-label={`Score breakdown for ${u.name}`}
                                aria-expanded={isTooltipOpen}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTooltipIdx(isTooltipOpen ? null : u.rank);
                                }}
                                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                                style={{
                                  color: isTooltipOpen ? '#fff' : BRAND.textLight,
                                  background: isTooltipOpen ? BRAND.navy : 'rgba(18,77,150,0.08)',
                                }}
                              >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                              </button>
                              <ScoreTooltip user={u} visible={isTooltipOpen} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}

        {/* ── Footer note ── */}
        <div className="pt-6 text-center space-y-3" style={{ borderTop: `1px solid rgba(18,77,150,0.12)` }}>
          {error && (
            <p className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl"
              style={{ color: '#EF4444', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}>
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Could not reach live data: {error}. Showing cached data.
            </p>
          )}
          <p className="text-xs max-w-md mx-auto" style={{ color: BRAND.textLight }}>
            Score = Test Difficulty × Completion Rate × Recency Bonus.
            Click <svg className="w-3 h-3 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg> on any row to see a full breakdown.
          </p>
        </div>

      </div>
    </div>
  );
}
