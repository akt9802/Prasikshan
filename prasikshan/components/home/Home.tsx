'use client';

import { useRouter } from 'next/navigation';
import { Typewriter } from 'react-simple-typewriter';
import SmallCardHome from './SmallCardHome';
import Footer from '../footer/Footer';

const B = {
  navy: '#124D96',
  navyDark: '#0D3A72',
  navyDeep: '#0A2A55',
  blue: '#1E5799',
  blueMid: '#2563EB',
  blueLight: '#60A5FA',
  iceBlue: '#EDF9FF',
  iceMid: '#D7F1FF',
  textDark: '#0F172A',
  textMuted: '#475569',
  textLight: '#94A3B8',
};

const TESTIMONIALS = [
  {
    name: 'Ananya Sharma',
    title: 'NDA Aspirant',
    text: 'The structured approach and mentorship provided here truly made a difference. I was able to identify my weak areas early and improve steadily. The one-on-one feedback sessions felt just like real SSB interviews!',
  },
  {
    name: 'Rohan Thapa',
    title: 'CDS Aspirant',
    text: 'This platform is exactly what I needed. The mock tests and interview tips gave me real insight into the SSB process, and I felt confident walking into the screening round. Highly recommended.',
  },
  {
    name: 'Vikram Singh',
    title: 'AFCAT Candidate',
    text: 'I had attempted the SSB before, but this platform helped me understand what I was missing. The mock GTO tasks and psychology practice gave me a new level of confidence and clarity.',
  },
];

const STATS = [
  { value: '7', label: 'Test Modules' },
  { value: '2000+', label: 'Questions' },
  { value: '100%', label: 'Free Access' },
];

export default function Home() {
  const router = useRouter();

  return (
    <>
      {/* ── Hero Banner ── */}
      <div
        className="relative w-full h-[600px] md:h-[700px] lg:h-[750px] overflow-hidden"
        style={{
          backgroundImage: `url('/home-image-logo.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(10,42,85,0.75) 0%, rgba(18,77,150,0.50) 60%, rgba(0,0,0,0.35) 100%)' }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-evenly gap-8 w-full h-full px-6 md:px-16">
          <div className="flex flex-col items-start justify-center flex-1 text-left">
            {/* Eyebrow badge */}
            <span
              className="inline-block text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#BEE3F8', border: '1px solid rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)' }}
            >
              SSB Preparation Platform
            </span>

            {['PREPARE WITH PURPOSE', 'PERFORM WITH PRIDE', 'SERVE WITH COURAGE'].map((line) => (
              <h1
                key={line}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black drop-shadow-lg leading-tight mb-2"
                style={{ color: '#FFFFFF', fontFamily: 'Montserrat, sans-serif', textShadow: '2px 2px 12px rgba(0,0,0,0.6)' }}
              >
                {line}
              </h1>
            ))}

            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mt-3"
              style={{ color: '#BEE3F8', fontFamily: 'Montserrat, sans-serif', minHeight: '80px', textShadow: '2px 2px 12px rgba(0,0,0,0.5)' }}
            >
              <Typewriter
                words={['STAND WITH STRIDE..']}
                loop={true}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1500}
              />
            </h1>


          </div>

          {/* Quick stats — right side on desktop */}
          <div className="hidden md:flex flex-col gap-4">
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className="px-6 py-4 rounded-2xl text-center min-w-[130px]"
                style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)' }}
              >
                <p className="text-3xl font-black text-white leading-none">{value}</p>
                <p className="text-xs font-medium mt-1.5" style={{ color: '#BEE3F8' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div
        className="flex flex-col items-center px-6 md:px-10 py-16"
        style={{ background: `linear-gradient(160deg,${B.iceBlue} 0%,${B.iceMid} 100%)` }}
      >
        {/* Section header */}
        <div className="text-center mb-12">
          <span
            className="inline-block text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full mb-4"
            style={{ background: `rgba(18,77,150,0.10)`, color: B.navy, border: `1px solid rgba(18,77,150,0.18)` }}
          >
            Stories from Aspirants
          </span>
          <h2
            className="text-3xl md:text-4xl font-black"
            style={{ background: `linear-gradient(to right,${B.navyDeep},${B.navy})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Montserrat, sans-serif' }}
          >
            Why Prasikshan?
          </h2>
          <p className="mt-3 text-sm font-medium max-w-md mx-auto" style={{ color: B.textMuted }}>
            Hundreds of aspirants have sharpened their SSB readiness with our platform.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-stretch justify-center flex-wrap">
          {TESTIMONIALS.map((t) => (
            <SmallCardHome key={t.name} name={t.name} title={t.title} text={t.text} />
          ))}
        </div>
      </div>

      {/* ── Quick Quiz ── */}
      <div
        className="relative overflow-hidden py-16 px-6 md:px-16"
        style={{ background: `linear-gradient(135deg,${B.navyDeep} 0%,${B.navyDark} 50%,${B.navy} 100%)` }}
      >
        {/* Decorative glow blobs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'rgba(37,99,235,0.18)', filter: 'blur(40px)' }} />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: 'rgba(18,77,150,0.22)', filter: 'blur(32px)' }} />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex flex-col gap-3 text-center lg:text-left max-w-lg">
            <span
              className="inline-block self-center lg:self-start text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.10)', color: B.blueLight, border: '1px solid rgba(255,255,255,0.18)' }}
            >
              Rapid Fire Round
            </span>
            <h2
              className="text-3xl md:text-4xl font-black text-white"
              style={{ fontFamily: 'Montserrat, sans-serif', textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
            >
              Quick Quiz
            </h2>
            <p className="font-semibold text-lg" style={{ color: '#BEE3F8' }}>
              Show Us You&apos;re SSB-Ready.
            </p>
            <p className="text-sm font-medium" style={{ color: 'rgba(191,219,254,0.70)' }}>
              Every question brings you one step closer to the uniform.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              className="px-8 py-4 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background: '#fff', color: B.navy, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
              onClick={() => router.push('/fivequestion')}
            >
              5 Questions
            </button>
            <button
              className="px-8 py-4 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.30)', backdropFilter: 'blur(8px)' }}
              onClick={() => router.push('/tenquestion')}
            >
              10 Questions
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
