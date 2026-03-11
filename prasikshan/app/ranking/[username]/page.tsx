'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import OirScore from "@/components/charts/OirScore.jsx";
import MonthlyTest from "@/components/charts/MonthlyTest.jsx";
import PPDTScore from "@/components/charts/PPDTScore.jsx";
import TotalTest from "@/components/charts/TotalTest.jsx";
import TatScore from "@/components/charts/TatScore.jsx";
import WatScore from "@/components/charts/WatScore.jsx";
import SrtScore from "@/components/charts/SrtScore.jsx";
import LecturetteScore from "@/components/charts/LecturetteScore.jsx";

export default function RankingUserPage() {
  const params = useParams();
  const rawUsername = params.username;
  const username = Array.isArray(rawUsername) ? rawUsername[0] : rawUsername;

  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState('OIR');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/ranking');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        if (!body || !body.success || !Array.isArray(body.data)) throw new Error('Unexpected response');

        const decoded = decodeURIComponent(username || '');
        const found = body.data.find((u: any) => u.name === decoded || encodeURIComponent(u.name) === username);
        if (!cancelled) setUser(found || { name: decoded, testsTakenCount: 0, testsTaken: [] });
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [username]);

  if (loading) return <div className="p-6">Loading user…</div>;
  if (error) return <div className="p-6 text-rose-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Card */}
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
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-blue-50 flex items-center justify-center text-3xl font-extrabold text-indigo-900 shadow-inner border border-white">
                {user && user.name ? user.name.split(' ').map((n: string) => n[0] || '').slice(0, 2).join('').toUpperCase() : '?'}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div className="text-center sm:text-left mt-2">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{user?.name || 'Unknown User'}</h2>
              <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-sm border border-indigo-100">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {user?.testsTakenCount ?? (user?.testsTaken?.length ?? 0)} tests taken
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-medium text-sm border border-slate-200">
                  Active Member
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
            <TotalTest userDetails={user} />
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
            <MonthlyTest userDetails={user} />
          </div>
        </div>

        {/* Detailed Scores Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
          <div className="mb-8 text-center sm:text-left border-b border-gray-100 pb-6">
            <h2 className="text-2xl font-bold text-slate-900">Detailed Performance</h2>
            <p className="text-slate-500 mt-2">Select a test category to view specific scores over time</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-64 flex-shrink-0">
              <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
                {[
                  { id: 'OIR', name: 'OIR Test', color: 'indigo' },
                  { id: 'PPDT', name: 'PPDT Test', color: 'teal' },
                  { id: 'TAT', name: 'TAT Test', color: 'amber' },
                  { id: 'WAT', name: 'WAT Test', color: 'orange' },
                  { id: 'SRT', name: 'SRT Test', color: 'purple' },
                  { id: 'LECTURETTE', name: 'Lecturette', color: 'emerald' },
                ].map((test) => (
                  <button
                    key={test.id}
                    onClick={() => setSelectedTest(test.id)}
                    className={`
                      whitespace-nowrap flex-shrink-0 w-full text-left px-5 py-3.5 rounded-xl font-bold transition-all duration-200 border-2 
                      ${selectedTest === test.id
                        ? `bg-${test.color}-50 border-${test.color}-200 text-${test.color}-700 shadow-sm`
                        : 'bg-white border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-200'
                      }
                    `}
                  >
                    {test.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-grow min-h-[400px] w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-2 sm:p-6">
              {(() => {
                switch (selectedTest) {
                  case 'OIR': return <OirScore userDetails={user} />;
                  case 'PPDT': return <PPDTScore userDetails={user} />;
                  case 'TAT': return <TatScore userDetails={user} />;
                  case 'WAT': return <WatScore userDetails={user} />;
                  case 'SRT': return <SrtScore userDetails={user} />;
                  case 'LECTURETTE': return <LecturetteScore userDetails={user} />;
                  default: return <OirScore userDetails={user} />;
                }
              })()}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
