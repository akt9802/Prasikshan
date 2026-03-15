"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";

export default function LoginHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsAdminUser(isAdmin());
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const baseNavLinks = [
    { name: "Terminal", href: "/" },
    { name: "About SSB", href: "/aboutssb" },
    { name: "Ranking", href: "/ranking" },
  ];

  const navLinks = isAdminUser
    ? [...baseNavLinks, { name: "Governance", href: "/admin" }]
    : baseNavLinks;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled
          ? "bg-[#0A2A55EE] backdrop-blur-2xl border-b border-white/5 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
          : "bg-[#0A2A55] py-7"
        }`}
    >
      <div className="max-w-7xl mx-auto px-8 md:px-16 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="group flex flex-col">
          <span className="text-2xl font-black text-white tracking-[-0.04em] leading-none transition-all group-hover:text-emerald-400">
            PRASIKSHAN<span className="text-emerald-500">.</span>
          </span>
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500/80 mt-1 opacity-100 translate-y-0 transition-all">
            Command Center
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8 mr-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-xs font-black uppercase tracking-widest transition-all group py-2 ${pathname === link.href ? "text-emerald-400" : "text-slate-400 hover:text-white"
                  }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-emerald-500 transition-all duration-300 ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/alltest")}
              className="group relative px-8 py-3.5 bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(16,185,129,0.2)] active:scale-95 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative z-10 flex items-center gap-2">
                Execute Test
                <svg className="transition-transform group-hover:translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </span>
            </button>

            <button
              onClick={() => router.push("/userdetails")}
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all active:scale-90"
            >
              <FiUser size={22} />
            </button>
          </div>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={toggleMenu}
          className="md:hidden w-11 h-11 flex items-center justify-center text-white bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all"
        >
          {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`fixed inset-0 top-[80px] bg-[#0A2A55] z-[90] md:hidden transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
          }`}
      >
        <div className="p-8 flex flex-col gap-5">
          {navLinks.map((link, idx) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`group p-6 rounded-3xl border flex items-center justify-between transition-all active:scale-98 ${pathname === link.href ? "bg-emerald-500/10 border-emerald-500/20" : "bg-white/5 border-white/5 hover:bg-white/10"
                }`}
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              <span className={`text-sm font-black uppercase tracking-[0.2em] ${pathname === link.href ? "text-emerald-400" : "text-white"
                }`}>
                {link.name}
              </span>
              <svg className={`${pathname === link.href ? "text-emerald-400" : "text-emerald-500"} opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all lg:-translate-x-4 lg:group-hover:translate-x-0`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          ))}

          <button
            onClick={() => {
              router.push("/alltest");
              setIsOpen(false);
            }}
            className="w-full py-6 mt-4 rounded-3xl bg-emerald-600 text-white font-black uppercase tracking-[0.3em] text-xs shadow-2xl active:scale-95 flex items-center justify-center gap-3 transition-all"
          >
            Execute Test Round
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>

          <button
            onClick={() => {
              router.push("/userdetails");
              setIsOpen(false);
            }}
            className="w-full py-5 rounded-3xl bg-white/5 border border-white/5 text-slate-400 font-bold flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <FiUser size={18} />
            Commander Profile
          </button>
        </div>
      </div>
    </header>
  );
}
