'use client';

const B = {
  navy: '#124D96',
  navyDark: '#0D3A72',
  navyDeep: '#0A2A55',
  blue: '#1E5799',
  blueMid: '#2563EB',
  iceBlue: '#EDF9FF',
  iceMid: '#D7F1FF',
  textDark: '#0F172A',
  textMuted: '#475569',
  textLight: '#94A3B8',
};

interface SmallCardHomeProps {
  name: string;
  title: string;
  text: string;
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ opacity: 0.12 }}>
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}

export default function SmallCardHome({ name, title, text }: SmallCardHomeProps) {
  return (
    <div
      className="group relative flex flex-col justify-between rounded-2xl p-7 transition-all duration-300 cursor-default"
      style={{
        width: '320px',
        minHeight: '280px',
        background: 'rgba(255,255,255,0.72)',
        border: '1.5px solid rgba(18,77,150,0.13)',
        boxShadow: '0 2px 12px rgba(18,77,150,0.07)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 36px rgba(18,77,150,0.16)';
        (e.currentTarget as HTMLDivElement).style.borderColor = `rgba(18,77,150,0.28)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(18,77,150,0.07)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(18,77,150,0.13)';
      }}
    >
      {/* Accent bar at top */}
      <div className="absolute top-0 left-6 right-6 h-0.5 rounded-full" style={{ background: `linear-gradient(90deg,${B.navy},${B.blueMid})` }} />

      {/* Large decorative quote mark */}
      <div className="absolute top-4 right-6" style={{ color: B.navy }}>
        <QuoteIcon />
      </div>

      {/* Review text */}
      <p className="text-sm leading-relaxed flex-1 mb-6 relative z-10" style={{ color: B.textMuted }}>
        &ldquo;{text}&rdquo;
      </p>

      {/* Reviewer info */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{ background: `linear-gradient(135deg,${B.iceBlue},${B.iceMid})`, border: `1.5px solid rgba(18,77,150,0.18)`, color: B.navy }}
        >
          <UserIcon />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-sm font-bold leading-none" style={{ color: B.textDark }}>{name}</p>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#2563EB" className="shrink-0">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <p className="text-[10px] font-black uppercase tracking-wider opacity-60" style={{ color: B.navy }}>{title}</p>
        </div>
      </div>
    </div>
  );
}
