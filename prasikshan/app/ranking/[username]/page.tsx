'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MonthlyTest from "@/components/charts/MonthlyTest.jsx";
import TotalTest from "@/components/charts/TotalTest.jsx";

// ── Skeleton Loader components ────────────────────────────────────────────────
function SkeletonHero() {
  return (
    <div className="bg-white/80 rounded-2xl p-6 sm:p-10 border border-white/60 animate-pulse">
      <div className="w-24 h-5 bg-slate-200 rounded mb-8"></div>
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <div className="w-24 h-24 rounded-full bg-slate-200"></div>
        <div className="space-y-4 flex-1">
          <div className="h-8 bg-slate-200 rounded w-48"></div>
          <div className="flex gap-3">
            <div className="h-6 bg-slate-200 rounded-full w-24"></div>
            <div className="h-6 bg-slate-200 rounded-full w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonChart() {
  return <div className="h-64 bg-slate-100 rounded-xl animate-pulse"></div>;
}

export default function RankingUserPage() {
  const params = useParams();
  const rawUsername = params.username;
  const username = Array.isArray(rawUsername) ? rawUsername[0] : rawUsername;

  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!username) return;
      try {
        setLoading(true);
        setError(null);
        
        const decoded = decodeURIComponent(username);
        // Fetch specific user data from the new public-profile endpoint
        const res = await fetch(`/api/ranking/user?name=${encodeURIComponent(decoded)}`);
        
        if (!res.ok) {
          if (res.status === 404) throw new Error('User not found');
          throw new Error(`HTTP ${res.status}`);
        }
        
        const body = await res.json();
        if (!body || !body.success) throw new Error(body.message || 'Failed to load user');

        if (!cancelled) {
          setUser(body.user);
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error("Error loading user:", err);
          setError(err.message || 'Failed to load');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [username]);

  const initials = useMemo(() => {
    if (!user?.name) return '?';
    return user.name.split(' ').map((n: string) => n[0] || '').slice(0, 2).join('').toUpperCase();
  }, [user]);

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border text-center space-y-4">
        <div className="text-rose-500 font-black text-xl">User Not Found</div>
        <p className="text-slate-500">Could not retrieve detailed stats for "{decodeURIComponent(username as string)}"</p>
        <button onClick={() => router.push('/ranking')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold">Back to Rankings</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Card */}
        {loading ? <SkeletonHero /> : (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 -mt-10 -mr-10 bg-gradient-to-br from-indigo-100/50 flex rounded-full blur-3xl w-64 h-64 pointer-events-none"></div>

            <button
              onClick={() => router.push('/ranking')}
              className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-8"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to rankings
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start relative z-10">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-blue-50 flex items-center justify-center text-3xl font-extrabold text-indigo-900 shadow-inner border border-white uppercase">
                  {initials}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className="text-center sm:text-left mt-2">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{user?.name}</h2>
                <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
                   <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-sm border border-indigo-100 shadow-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Rank #{user?.rank}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-sm border border-indigo-100">
                    {user?.testsTakenCount} tests taken
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-medium text-sm border border-slate-200">
                    Active Member
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overview Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
            <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Test Mix</h3>
            {loading ? <SkeletonChart /> : <TotalTest userDetails={user} />}
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
            <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Activity Timeline</h3>
            {loading ? <SkeletonChart /> : <MonthlyTest userDetails={user} />}
          </div>
        </div>


      </div>
    </div>
  );
}
