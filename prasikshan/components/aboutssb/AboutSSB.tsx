'use client';
import React from "react";
import Image from "next/image";
import { Montserrat } from 'next/font/google';
import Footer from "../footer/Footer";
import indiaMap from "@/assets/india-map.svg";

const montserrat = Montserrat({ subsets: ['latin'] });

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

// ── Timeline data ─────────────────────────────────────────────────────────────
const DAYS = [
  {
    day: 'Day 1',
    title: 'Screening Test',
    subtitle: 'OIR + PPDT',
    detail: (
      <>
        <strong>OIR:</strong> Officer Intelligence Rating Test<br />
        <strong>PPDT:</strong> Picture Perception and Discussion Test<br />
        Candidates are screened based on psychological and analytical performance.
      </>
    ),
    side: 'left' as const,
  },
  {
    day: 'Day 2',
    title: 'Psychological Tests',
    subtitle: 'TAT, WAT, SRT, SDT',
    detail: (
      <>
        <strong>TAT:</strong> Thematic Apperception Test<br />
        <strong>WAT:</strong> Word Association Test<br />
        <strong>SRT:</strong> Situation Reaction Test<br />
        <strong>SDT:</strong> Self Description Test
      </>
    ),
    side: 'right' as const,
  },
  {
    day: 'Day 3',
    title: 'Group Tasks – Part 1',
    subtitle: 'GD, GPE, PGT',
    detail: (
      <>
        <strong>GD:</strong> Group Discussion<br />
        <strong>GPE:</strong> Group Planning Exercise<br />
        <strong>PGT:</strong> Progressive Group Task
      </>
    ),
    side: 'left' as const,
  },
  {
    day: 'Day 4',
    title: 'Group Tasks – Part 2',
    subtitle: 'Lecturette, CT, IO',
    detail: (
      <>
        <strong>Lecturette:</strong> Short topic speech<br />
        <strong>CT:</strong> Command Task<br />
        <strong>IO:</strong> Individual Obstacles
      </>
    ),
    side: 'right' as const,
  },
  {
    day: 'Day 5',
    title: 'Final Conference',
    subtitle: 'Assessment Result',
    detail: (
      <>
        All assessors discuss the candidate&apos;s overall performance across all stages and arrive at the final recommended/not-recommended decision.
      </>
    ),
    side: 'left' as const,
  },
];

const SSB_CENTERS = [
  { name: "SSB Kolkata", top: "51%", left: "65%" },
  { name: "SSB Bhopal", top: "50%", left: "35%" },
  { name: "SSB Kapurthala", top: "27%", left: "30%" },
  { name: "SSB Guwahati", top: "40%", left: "76%" },
  { name: "SSB Dehradun", top: "29%", left: "38%" },
  { name: "SSB Visakhapatnam", top: "68%", left: "47%" },
  { name: "SSB Allahabad", top: "42%", left: "48%" },
  { name: "SSB Mysore", top: "80%", left: "32%" },
];

const IMAGES = [
  "https://res.cloudinary.com/dsi70dfkn/image/upload/v1774096524/pop_lsfrhr.jpg",
  "https://res.cloudinary.com/dsi70dfkn/image/upload/v1774096529/img2_xi3mob.jpg",
  "https://res.cloudinary.com/dsi70dfkn/image/upload/v1774096541/img3_mua3rz.jpg",
  "https://res.cloudinary.com/dsi70dfkn/image/upload/v1774096542/img4_ankygf.jpg",
  "https://res.cloudinary.com/dsi70dfkn/image/upload/v1774096495/img5_gceizm.jpg",
  "https://res.cloudinary.com/dsi70dfkn/image/upload/v1774096536/img6_qulhwp.jpg",
  "https://res.cloudinary.com/dsi70dfkn/image/upload/v1774096545/img7_xe3nxg.jpg",
  "https://res.cloudinary.com/dsi70dfkn/image/upload/v1774096511/img8_ktfhxn.jpg",
];

// ── Section header helper ─────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title, light = false }: { eyebrow: string; title: React.ReactNode; light?: boolean }) {
  return (
    <div className="text-center mb-12">
      <span
        className="inline-block text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full mb-4"
        style={{ background: light ? 'rgba(255,255,255,0.12)' : `rgba(18,77,150,0.10)`, color: light ? '#BEE3F8' : B.navy, border: `1px solid ${light ? 'rgba(255,255,255,0.18)' : 'rgba(18,77,150,0.18)'}` }}
      >
        {eyebrow}
      </span>
      <h2
        className={`${montserrat.className} text-3xl sm:text-4xl md:text-5xl font-black`}
        style={light
          ? { background: 'linear-gradient(to right,#fff,#BEE3F8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
          : { background: `linear-gradient(to right,${B.navyDeep},${B.navy})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }
        }
      >
        {title}
      </h2>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
function AboutSSB() {
  return (
    <>
      {/* ── Auto-scrolling carousel ── */}
      <div className="image-carousel">
        <div className="slider-track">
          {IMAGES.concat(IMAGES).map((img, index) => (
            <div className="slide" key={index}>
              <Image src={img} alt={`SSB atmosphere ${index + 1}`} width={380} height={220} />
            </div>
          ))}
        </div>
      </div>

      {/* ── What is SSB ── */}
      <div
        className="flex flex-col md:flex-row justify-around items-center px-6 md:px-16 py-16 gap-12 md:gap-20"
        style={{ background: `linear-gradient(160deg, ${B.iceBlue} 0%, ${B.iceMid} 100%)` }}
      >
        <div className="flex flex-col w-full md:w-[580px] gap-6">
          {/* Eyebrow */}
          <span
            className="inline-block self-start text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full"
            style={{ background: `rgba(18,77,150,0.10)`, color: B.navy, border: `1px solid rgba(18,77,150,0.18)` }}
          >
            Services Selection Board
          </span>

          <h1
            className={`${montserrat.className} text-4xl sm:text-5xl md:text-6xl font-black leading-tight`}
            style={{ background: `linear-gradient(to right,${B.navyDeep},${B.navy})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            What is SSB?
          </h1>

          <p className="text-base sm:text-lg font-medium leading-relaxed" style={{ color: B.textMuted }}>
            SSB stands for <strong style={{ color: B.navy }}>Services Selection Board</strong>. It is a 5-day assessment process conducted by the Indian Armed Forces to evaluate candidates on mental, physical, and psychological grounds for officer-level entry.
          </p>

          {/* Quick facts */}
          <div className="flex flex-wrap gap-4 mt-2">
            {[
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <text x="12" y="19" textAnchor="middle" fontSize="7" fontWeight="700" fill="currentColor" stroke="none">5</text>
                  </svg>
                ),
                label: '5-Day', sub: 'Process',
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                  </svg>
                ),
                label: 'Psych', sub: '+ Group Tasks',
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
                  </svg>
                ),
                label: 'Officer', sub: 'Level Entry',
              },
            ].map(({ icon, label, sub }) => (
              <div
                key={label}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.7)', border: `1px solid rgba(18,77,150,0.13)`, backdropFilter: 'blur(8px)', color: B.navy }}
              >
                {icon}
                <div>
                  <p className="text-sm font-black" style={{ color: B.navy }}>{label}</p>
                  <p className="text-xs" style={{ color: B.textLight }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-3xl overflow-hidden p-2 shadow-xl shrink-0"
          style={{ background: 'rgba(255,255,255,0.60)', border: `2px solid rgba(18,77,150,0.14)`, backdropFilter: 'blur(12px)' }}
        >
          <Image
            src="https://res.cloudinary.com/dsi70dfkn/image/upload/v1774096528/trio_x3jjyf.png"
            alt="Three branches of Indian Armed Forces"
            width={300}
            height={300}
            style={{ objectFit: "contain", borderRadius: '20px' }}
          />
        </div>
      </div>

      {/* ── 5-Day Timeline ── */}
      <div
        className="py-16 px-4"
        style={{ background: `linear-gradient(160deg, ${B.navyDeep} 0%, ${B.navy} 60%, #1E5799 100%)` }}
      >
        <SectionHeader eyebrow="Selection Process" title="SSB 5-Day Journey" light />

        <div className="ssb-timeline-v">
          {DAYS.map((d, i) => (
            <div key={d.day} className="ssb-step">
              {/* Left slot */}
              <div className="ssb-step-left">
                {d.side === 'left' && (
                  <div className="ssb-step-card">
                    <h3 className={montserrat.className}>{d.day}</h3>
                    <p className="card-title">{d.title}</p>
                    <p className="card-detail" style={{ color: B.blueMid, fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>{d.subtitle}</p>
                    <p className="card-detail">{d.detail}</p>
                  </div>
                )}
              </div>

              {/* Central dot */}
              <div className="ssb-step-dot">
                <div className="ssb-step-dot-inner">D{i + 1}</div>
              </div>

              {/* Right slot */}
              <div className="ssb-step-right">
                {d.side === 'right' && (
                  <div className="ssb-step-card">
                    <h3 className={montserrat.className}>{d.day}</h3>
                    <p className="card-title">{d.title}</p>
                    <p className="card-detail" style={{ color: B.blueMid, fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>{d.subtitle}</p>
                    <p className="card-detail">{d.detail}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SSB Centres Map ── */}
      <div
        className="pb-16 px-4 flex flex-col items-center"
        style={{ background: `linear-gradient(160deg, ${B.iceBlue} 0%, ${B.iceMid} 100%)` }}
      >
        <div className="pt-14 w-full max-w-4xl">
          <SectionHeader eyebrow="Locations" title="SSB Centres Across India" />

          {/* Info strip */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {SSB_CENTERS.map(c => (
              <span
                key={c.name}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.75)', border: `1px solid rgba(18,77,150,0.16)`, color: B.navy, backdropFilter: 'blur(6px)' }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                {c.name}
              </span>
            ))}
          </div>

          {/* Map */}
          <div
            className="relative w-full max-w-2xl mx-auto aspect-square rounded-3xl overflow-visible"
            style={{ background: 'rgba(255,255,255,0.55)', border: `2px solid rgba(18,77,150,0.14)`, backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(18,77,150,0.12)' }}
          >
            <Image
              src={indiaMap}
              alt="Map of India showing SSB Centres"
              fill
              className="object-contain p-6"
              sizes="(max-width: 768px) 100vw, 640px"
              priority
            />

            {SSB_CENTERS.map((center) => {
              const isMysore = center.name === "SSB Mysore";
              return (
                <button
                  key={center.name}
                  type="button"
                  aria-label={center.name}
                  className="group absolute flex flex-col items-center"
                  style={{ top: center.top, left: center.left, transform: "translate(-50%, -100%)" }}
                >
                  <span
                    className={`${isMysore ? 'order-last mt-1' : 'mb-1'} px-2 py-0.5 rounded-full text-[9px] sm:text-[11px] font-bold whitespace-nowrap shadow-md`}
                    style={{ background: B.navy, color: '#fff' }}
                  >
                    {center.name}
                  </span>
                  <span
                    className="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 shadow-lg transition-transform duration-150 group-hover:scale-125"
                    style={{ background: '#EF4444', borderColor: '#fff', boxShadow: '0 2px 8px rgba(239,68,68,0.5)' }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default AboutSSB;
