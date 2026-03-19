"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// ── Brand palette ─────────────────────────────────────────────────────────────
const B = {
  navy: '#124D96',
  navyDark: '#0D3A72',
  navyDeep: '#0A2A55',
  blueMid: '#2563EB',
  blueLight: '#60A5FA',
  iceBlue: '#EDF9FF',
  textLight: '#94A3B8',
  textMuted: '#64748B',
};

export default function Footer() {
  const [userCount, setUserCount] = useState<number>(0);

  useEffect(() => {
    fetch('/api/users/count')
      .then(res => res.json())
      .then(data => {
        if (data.success && typeof data.count === 'number') {
          // If you want to stack this count artificially for marketing, you could do: setUsers(5420 + data.count) 
          // For true metric, we set strictly what the DB returns:
          setUserCount(data.count);
        }
      })
      .catch(console.error);
  }, []);

  const links = {
    tests: [
      { name: "OIR Test", href: "/alltest/oir" },
      { name: "PPDT Phase", href: "/alltest/ppdt" },
      { name: "TAT (Psychology)", href: "/alltest/tat" },
      { name: "WAT / SRT", href: "/alltest" },
      { name: "Personal Interview", href: "/alltest/pi" },
    ],
    platform: [
      { name: "Home", href: "/" },
      { name: "About SSB", href: "/aboutssb" },
      { name: "Global Ranking", href: "/ranking" },
      { name: "Admin Console", href: "#", textOnly: true },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Honor Code", href: "#" },
    ]
  };

  return (
    <footer className="relative bg-[#0A2A55] pt-20 pb-10 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
      <div className="absolute -top-24 -left-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Column 1: Brand Identity */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
              <h2 className="text-2xl font-black text-white tracking-tighter">
                PRASIKSHAN<span className="text-blue-500">.</span>
              </h2>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed font-medium max-w-xs">
              Empowering the next generation of defense officers with high-precision mock tests and psychological analysis tailored for the Services Selection Board.
            </p>
            <div className="flex items-center gap-4">
              {/* Minimal social placeholders if needed */}
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </div>
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </div>
            </div>
          </div>

          {/* Column 2: Test Modules */}
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-[10px] mb-6">Test Modules</h3>
            <ul className="space-y-4">
              {links.tests.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-blue-400 text-sm font-semibold transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-blue-500/0 group-hover:bg-blue-500 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Navigation */}
          <div>
            <h3 className="text-white font-black uppercase tracking-widest text-[10px] mb-6">Resources</h3>
            <ul className="space-y-4">
              {links.platform.map((link) => (
                <li key={link.name}>
                  {link.textOnly ? (
                    <span className="text-slate-500 hover:text-slate-400 text-sm font-semibold transition-colors flex items-center gap-2 cursor-default">
                      <span className="w-1 h-1 rounded-full bg-slate-600/50 transition-all" />
                      {link.name}
                    </span>
                  ) : (
                    <Link href={link.href!} className="text-slate-400 hover:text-blue-400 text-sm font-semibold transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-blue-500/0 group-hover:bg-blue-500 transition-all" />
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Impact & Growth */}
          <div className="space-y-6">
            <h3 className="text-white font-black uppercase tracking-widest text-[10px] mb-6">User Community</h3>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter mb-1">Active Aspirants</p>
              <h4 className="text-3xl font-black text-white tracking-tighter mb-4">
                {userCount.toLocaleString()}<span className="text-blue-500">+</span>
              </h4>
              <Link href="/signup" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">
                Join the Rank
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">Server status: Operational</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap justify-center gap-8 order-2 md:order-1">
            {links.legal.map((link) => (
              <Link key={link.name} href={link.href} className="text-slate-500 hover:text-slate-300 text-[11px] font-bold uppercase tracking-widest transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest order-1 md:order-2">
            © {new Date().getFullYear()} Prasikshan. Crafted for Excellence.
          </p>
        </div>
      </div>
    </footer>
  );
}
