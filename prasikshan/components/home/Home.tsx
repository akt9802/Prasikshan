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
  {
    name: 'Kartik Aryan',
    title: 'TES Aspirant',
    text: 'The psychological test analysis is extremely precise. it helped me refine my TAT stories and SRT responses significantly. The feedback system is world-class.',
  },
  {
    name: 'Simran Kaur',
    title: 'AFCAT Candidate',
    text: "Prasikshan's interface is so intuitive. Practicing OIR tests daily gave me the speed and accuracy I needed to clear the actual exam with ease.",
  },
  {
    name: 'Rahul Verma',
    title: 'CDS Aspirant',
    text: 'The GTO task simulations are a game-changer. Seeing the 3D layouts and preparation tips made the ground tasks feel completely familiar on the actual day.',
  },
  {
    name: 'Priya Sharma',
    title: 'NCC Entry',
    text: 'One of the best platforms for SSB prep. The PI mock questions cover every possible angle of the personal interview, helping me prepare for tough cross-questioning.',
  },
  {
    name: 'Amit Kumar',
    title: 'Navy Executive',
    text: "I love the focus on 'Officer Like Qualities'. This platform isn't just about passing tests; it's about developing the true mindset of a leader.",
  },
  {
    name: 'Sneha Reddy',
    title: 'MNS Aspirant',
    text: 'The community and peer feedback loop is amazing. Learning from others experiences and sharing my own helped me stay motivated throughout my journey.',
  },
  {
    name: 'Deepak Gupta',
    title: 'Technical Entry',
    text: 'I was struggling with PPDT story narration, but the timed practices and playback features here helped me master my delivery and confidence.',
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

        {/* Infinite Scroll Marquee */}
        <div className="w-full relative overflow-hidden flex flex-col gap-6">


          <div className="marquee-container py-4">
            {/* Double the list for seamless loop */}
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => (
              <div key={`${t.name}-${idx}`} className="shrink-0">
                <SmallCardHome name={t.name} title={t.title} text={t.text} />
              </div>
            ))}
          </div>

          {/* Masking overlays for soft edges */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#EDF9FF] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#D7F1FF] to-transparent z-10 pointer-events-none" />
        </div>
      </div>

      {/* ── Quick Quiz ── */}
      <div
        className="px-6 md:px-10 py-24"
        style={{ background: `linear-gradient(160deg,${B.iceMid} 0%,${B.iceBlue} 100%)` }}
      >
        <div
          className="relative overflow-hidden py-16 px-6 md:px-16 max-w-7xl mx-auto rounded-[3.5rem] shadow-[0_32px_80px_rgba(10,42,85,0.3)] border border-white/10"
          style={{ background: `linear-gradient(135deg,${B.navyDeep} 0%,${B.navyDark} 100%)` }}
        >
          {/* Decorative glow blobs */}
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: 'rgba(37,99,235,0.22)', filter: 'blur(60px)' }} />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'rgba(18,77,150,0.28)', filter: 'blur(50px)' }} />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex flex-col gap-3 text-center lg:text-left max-w-lg">
              <span
                className="inline-block self-center lg:self-start text-[10px] font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-2"
                style={{ background: 'rgba(18,77,150,0.4)', color: B.blueLight, border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
              >
                Rapid Fire Training
              </span>
              <h2
                className="text-4xl md:text-5xl font-black text-white leading-tight"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Intelligence <span className="text-blue-400">Blitz</span>
              </h2>
              <p className="font-bold text-lg" style={{ color: '#BEE3F8' }}>
                Validate Your Readiness Levels.
              </p>
              <p className="text-sm font-medium leading-relaxed" style={{ color: 'rgba(191,219,254,0.60)' }}>
                Every correct response mirrors the split-second decision making required for the uniform. Challenge yourself against the clock.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                className="group relative px-10 py-5 rounded-2xl font-black text-sm transition-all duration-300 hover:scale-[1.05] active:scale-95 overflow-hidden"
                style={{ background: '#fff', color: B.navyDeep, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                onClick={() => router.push('/fivequestion')}
              >
                <div className="absolute inset-0 bg-blue-50/50 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative z-10">5 Questions Challenge</span>
              </button>
              <button
                className="group relative px-10 py-5 rounded-2xl font-black text-sm transition-all duration-300 hover:scale-[1.05] active:scale-95 border-2 border-white/20 hover:border-white/40"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', backdropFilter: 'blur(10px)' }}
                onClick={() => router.push('/tenquestion')}
              >
                <span className="relative z-10">10 Questions Sprint</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
