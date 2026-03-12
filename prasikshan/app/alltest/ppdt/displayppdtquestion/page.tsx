"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/components/footer/Footer";
import { getAuthToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

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

interface Story { title: string; narration: string; }
interface PPDTQuestion { _id: number; image: string; stories: Story[]; }

type Stage = "loading" | "viewImage" | "waitStory" | "showStories";

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

// ── Stage steps ───────────────────────────────────────────────────────────────
const STEPS = [
  { key: "viewImage", label: "Observe Image" },
  { key: "waitStory", label: "Write Story" },
  { key: "showStories", label: "Results" },
];

export default function DisplayPPDTQuestion() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("loading");
  const [timeLeft, setTimeLeft] = useState(30);
  const [question, setQuestion] = useState<PPDTQuestion | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [overallTimeLeft, setOverallTimeLeft] = useState(270);
  const [userStory, setUserStory] = useState("");
  const [wordCount, setWordCount] = useState(0);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch("/api/ppdtquestions");
        if (!response.ok) throw new Error("Failed to fetch PPDT question");
        const result = await response.json();
        if (result.success) setQuestion(result.data);
        else throw new Error(result.error || "Failed to fetch PPDT question");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch question");
      }
    };
    fetchQuestion();
  }, []);

  // ── Overall timer ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (stage === "loading" || stage === "showStories") return;
    if (overallTimeLeft > 0) {
      const t = setTimeout(() => setOverallTimeLeft(v => v - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setStage("showStories");
      handleSubmitPPDT();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overallTimeLeft, stage]);

  // ── Stage timer ────────────────────────────────────────────────────────────
  useEffect(() => {
    let t: NodeJS.Timeout;
    if (stage === "viewImage" && timeLeft > 0 && imageLoaded) {
      t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
    } else if (stage === "viewImage" && timeLeft === 0) {
      setStage("waitStory"); setTimeLeft(240);
    } else if (stage === "waitStory" && timeLeft > 0) {
      t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
    } else if (stage === "waitStory" && timeLeft === 0) {
      setStage("showStories"); handleSubmitPPDT();
    }
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, stage, imageLoaded]);

  const handleSubmitPPDT = async () => {
    if (submitted) return;
    setSubmitted(true);
    const token = getAuthToken();
    if (!token) return;
    try {
      await fetch("/api/ppdtquestions/result", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          testName: "PPDT Test", score: 1, timeTaken: 270,
          dateTaken: new Date().toISOString(), responses: [{ story: userStory }],
        }),
      });
    } catch { /* silent */ }
  };

  const handleStoryChange = (v: string) => {
    setUserStory(v);
    setWordCount(v.trim() === "" ? 0 : v.trim().split(/\s+/).length);
  };

  const isTimeCritical = stage === "viewImage" ? timeLeft <= 10 : timeLeft <= 60;
  const stageIndex = stage === "viewImage" ? 0 : stage === "waitStory" ? 1 : 2;
  const overallPct = Math.round((270 - overallTimeLeft) / 270 * 100);

  // ── Loading / Error states ─────────────────────────────────────────────────
  const Centered = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center min-h-screen"
      style={{ background: `linear-gradient(160deg,${B.iceBlue},${B.iceMid})` }}>
      {children}
    </div>
  );

  if (error) return (
    <Centered>
      <div className="max-w-md w-full p-8 rounded-2xl text-center"
        style={{ background: 'rgba(255,255,255,0.82)', border: '1.5px solid rgba(220,38,38,0.22)', backdropFilter: 'blur(12px)' }}>
        <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(220,38,38,0.10)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        </div>
        <p className="font-semibold mb-5" style={{ color: '#DC2626' }}>{error}</p>
        <button onClick={() => router.push("/alltest")}
          className="px-6 py-2.5 rounded-xl font-bold text-sm text-white"
          style={{ background: `linear-gradient(90deg,${B.navyDark},${B.navy})` }}>
          Go to All Tests
        </button>
      </div>
    </Centered>
  );

  if (!question) return (
    <Centered>
      <div className="flex flex-col items-center gap-4 p-10 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.78)', border: '1.5px solid rgba(18,77,150,0.13)', backdropFilter: 'blur(12px)' }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin"
          style={{ borderColor: B.iceMid, borderTopColor: B.navy }} />
        <p className="text-sm font-semibold" style={{ color: B.textMuted }}>Loading PPDT question…</p>
      </div>
    </Centered>
  );

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-40 px-4 py-3"
        style={{ background: `linear-gradient(135deg,${B.navyDeep},${B.navy})`, boxShadow: '0 4px 20px rgba(10,42,85,0.35)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          {/* Title */}
          <div>
            <p className="text-xs font-black tracking-widest uppercase" style={{ color: 'rgba(190,227,248,0.65)' }}>Psychology Test</p>
            <h1 className="text-lg font-black text-white leading-tight">Picture Perception & Discussion</h1>
          </div>

          {/* Step progress (hidden on small) */}
          <div className="hidden md:flex items-center gap-1">
            {STEPS.map((s, i) => {
              const done = i < stageIndex;
              const active = i === stageIndex;
              return (
                <React.Fragment key={s.key}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                      style={{ background: done ? '#4ADE80' : active ? '#fff' : 'rgba(255,255,255,0.18)', color: done ? '#fff' : active ? B.navy : 'rgba(190,227,248,0.5)' }}>
                      {done ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> : i + 1}
                    </div>
                    <span className="text-xs font-bold" style={{ color: active ? '#fff' : done ? '#4ADE80' : 'rgba(190,227,248,0.5)' }}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className="w-8 h-px mx-1" style={{ background: done ? '#4ADE80' : 'rgba(255,255,255,0.20)' }} />}
                </React.Fragment>
              );
            })}
          </div>

          {/* Timer + overall */}
          <div className="flex items-center gap-3 shrink-0">
            {stage !== "showStories" && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xl ${isTimeCritical ? 'animate-pulse' : ''}`}
                style={{ background: isTimeCritical ? 'rgba(220,38,38,0.25)' : 'rgba(255,255,255,0.12)', color: isTimeCritical ? '#F87171' : '#fff', border: isTimeCritical ? '1.5px solid rgba(220,38,38,0.40)' : '1.5px solid rgba(255,255,255,0.15)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                {stage === "viewImage" ? `${timeLeft}s` : fmtTime(timeLeft)}
              </div>
            )}
          </div>
        </div>

        {/* Overall progress bar */}
        {stage !== "showStories" && (
          <div className="max-w-7xl mx-auto mt-2">
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${overallPct}%`, background: 'linear-gradient(90deg,#60A5FA,#4ADE80)' }} />
            </div>
          </div>
        )}
      </div>

      <div className="min-h-screen" style={{ background: `linear-gradient(160deg,${B.iceBlue},${B.iceMid},#c8e8f8)` }}>
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-5">

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* ─ Stage: View Image ─ */}
            {(stage === "loading" || stage === "viewImage") && (
              <div className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(14px)', border: '1.5px solid rgba(18,77,150,0.13)', boxShadow: '0 4px 20px rgba(18,77,150,0.09)' }}>

                {/* image stage header */}
                <div className="px-6 pt-6 pb-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(18,77,150,0.08)' }}>
                  <div>
                    <span className="text-xs font-black tracking-widest uppercase px-2.5 py-1 rounded-full" style={{ background: `rgba(18,77,150,0.08)`, color: B.navy }}>
                      Stage 1 · Image Observation
                    </span>
                    <p className="text-xs mt-2 font-medium" style={{ color: B.textMuted }}>Observe closely — image disappears when timer ends</p>
                  </div>
                  {stage === "viewImage" && (
                    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-2xl ${isTimeCritical ? 'animate-pulse' : ''}`}
                      style={{ background: isTimeCritical ? 'rgba(220,38,38,0.10)' : `rgba(18,77,150,0.08)`, color: isTimeCritical ? '#DC2626' : B.navy }}>
                      {timeLeft}s
                    </div>
                  )}
                </div>

                {/* image + countdown bar */}
                <div className="p-6">
                  {stage === "viewImage" && (
                    <div className="h-1.5 rounded-full mb-5 overflow-hidden" style={{ background: B.iceMid }}>
                      <div className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${(timeLeft / 30) * 100}%`, background: isTimeCritical ? '#DC2626' : `linear-gradient(90deg,${B.navy},${B.blueMid})` }} />
                    </div>
                  )}

                  <div className="flex justify-center relative min-h-[300px]">
                    {!imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl" style={{ background: B.iceMid }}>
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: B.iceMid, borderTopColor: B.navy }} />
                          <p className="text-xs font-semibold" style={{ color: B.textMuted }}>Loading image…</p>
                        </div>
                      </div>
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={question.image} alt="PPDT Scene"
                      className={`rounded-2xl max-w-full max-h-[500px] object-contain transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                      style={{ border: '2px solid rgba(18,77,150,0.15)', boxShadow: '0 8px 30px rgba(18,77,150,0.14)' }}
                      onLoad={() => { setImageLoaded(true); if (stage === "loading") setStage("viewImage"); }}
                      onError={e => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x400?text=Image+Not+Available";
                        setImageLoaded(true); if (stage === "loading") setStage("viewImage");
                      }} />
                  </div>
                </div>


              </div>
            )}

            {/* ─ Stage: Write Story ─ */}
            {stage === "waitStory" && (
              <div className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(14px)', border: '1.5px solid rgba(18,77,150,0.13)', boxShadow: '0 4px 20px rgba(18,77,150,0.09)' }}>

                <div className="px-6 pt-6 pb-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(18,77,150,0.08)' }}>
                  <div>
                    <span className="text-xs font-black tracking-widest uppercase px-2.5 py-1 rounded-full" style={{ background: 'rgba(5,150,105,0.10)', color: '#059669' }}>
                      Stage 2 · Story Writing
                    </span>
                    <p className="text-xs mt-2 font-medium" style={{ color: B.textMuted }}>Write a creative & positive story based on the image</p>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xl ${isTimeCritical ? 'animate-pulse' : ''}`}
                    style={{ background: isTimeCritical ? 'rgba(220,38,38,0.10)' : 'rgba(5,150,105,0.08)', color: isTimeCritical ? '#DC2626' : '#059669' }}>
                    {fmtTime(timeLeft)}
                  </div>
                </div>

                {/* timer bar */}
                <div className="px-6 pt-4">
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: B.iceMid }}>
                    <div className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${(timeLeft / 240) * 100}%`, background: isTimeCritical ? '#DC2626' : 'linear-gradient(90deg,#059669,#047857)' }} />
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <textarea value={userStory} onChange={e => handleStoryChange(e.target.value)}
                    placeholder="Begin your story here… Set the scene, introduce the characters, describe what's happening and how it resolves. Aim for a positive, officer-like narrative."
                    className="w-full h-72 px-5 py-4 rounded-xl resize-none text-sm leading-relaxed transition-all duration-200 focus:outline-none"
                    style={{ background: 'rgba(237,249,255,0.70)', border: '2px solid rgba(18,77,150,0.14)', color: B.textDark, fontFamily: 'inherit' }}
                    onFocus={e => (e.target.style.borderColor = B.navy)}
                    onBlur={e => (e.target.style.borderColor = 'rgba(18,77,150,0.14)')} />

                  {/* word / char stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-xs font-semibold" style={{ color: B.textMuted }}>
                      <span>{wordCount} <span style={{ color: B.textLight }}>words</span></span>
                      <span>{userStory.length} <span style={{ color: B.textLight }}>chars</span></span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: wordCount < 30 ? 'rgba(217,119,6,0.10)' : 'rgba(5,150,105,0.10)', color: wordCount < 30 ? '#D97706' : '#059669' }}>
                      {wordCount < 30 ? 'Keep writing…' : 'Good progress'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ─ Stage: Results ─ */}
            {stage === "showStories" && (
              <div className="space-y-5">
                {/* hero */}
                <div className="rounded-2xl p-8 relative overflow-hidden text-center"
                  style={{ background: `linear-gradient(135deg,${B.navyDeep},${B.navy})`, boxShadow: '0 12px 40px rgba(18,77,150,0.28)' }}>
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
                    style={{ background: 'rgba(37,99,235,0.18)', filter: 'blur(30px)' }} />
                  <p className="text-xs font-black tracking-widest uppercase mb-2" style={{ color: 'rgba(190,227,248,0.65)' }}>PPDT — Picture Perception & Discussion</p>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ background: 'rgba(74,222,128,0.20)', border: '2px solid rgba(74,222,128,0.40)' }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <h2 className="text-2xl font-black text-white mb-1">Test Completed!</h2>
                  <p className="text-sm font-medium" style={{ color: 'rgba(190,227,248,0.70)' }}>
                    Completed in <span className="text-white font-black">{fmtTime(270 - overallTimeLeft)}</span>
                  </p>
                </div>

                {/* your story */}
                <div className="rounded-2xl p-6"
                  style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(18,77,150,0.13)' }}>
                  <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid rgba(18,77,150,0.08)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(5,150,105,0.12)', border: '1.5px solid rgba(5,150,105,0.25)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </div>
                    <h3 className="font-extrabold" style={{ color: B.textDark }}>Your Story</h3>
                  </div>
                  <div className="rounded-xl p-4 text-sm leading-relaxed" style={{ background: 'rgba(5,150,105,0.05)', border: '1.5px solid rgba(5,150,105,0.18)', color: B.textDark, whiteSpace: 'pre-wrap' }}>
                    {userStory || <span className="italic" style={{ color: B.textLight }}>No story was written.</span>}
                  </div>
                  {userStory && (
                    <p className="text-xs font-semibold mt-2" style={{ color: B.textLight }}>
                      {userStory.trim().split(/\s+/).length} words · {userStory.length} characters
                    </p>
                  )}
                </div>

                {/* sample stories */}
                <div className="rounded-2xl p-6"
                  style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(18,77,150,0.13)' }}>
                  <h3 className="font-extrabold mb-5 pb-4" style={{ color: B.textDark, borderBottom: '1px solid rgba(18,77,150,0.08)' }}>
                    Sample Stories — for comparison
                  </h3>
                  <div className="flex flex-col gap-4">
                    {question.stories.map((story, i) => (
                      <div key={i} className="rounded-xl p-5"
                        style={{ background: 'rgba(18,77,150,0.04)', border: '1.5px solid rgba(18,77,150,0.12)' }}>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white"
                            style={{ background: `linear-gradient(135deg,${B.navyDark},${B.navy})` }}>{i + 1}</span>
                          <h4 className="font-extrabold text-sm" style={{ color: B.navy }}>{story.title}</h4>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: B.textMid }}>{story.narration}</p>
                      </div>
                    ))}
                  </div>
                </div>



                {/* actions */}
                <div className="flex gap-3">
                  <button onClick={() => router.push("/alltest/ppdt")}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                    style={{ background: `linear-gradient(90deg,${B.navyDark},${B.navy})`, color: '#fff', boxShadow: '0 4px 16px rgba(18,77,150,0.28)' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.52" /></svg>
                    Retake Test
                  </button>
                  <button onClick={() => router.push("/alltest")}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                    style={{ background: 'rgba(255,255,255,0.78)', color: B.textMid, border: '1.5px solid rgba(18,77,150,0.18)', backdropFilter: 'blur(8px)' }}>
                    All Tests
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          {stage !== "showStories" && (
            <div className="lg:w-64 shrink-0 flex flex-col gap-4">

              {/* Stage progress */}
              <div className="rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(18,77,150,0.12)' }}>
                <p className="text-xs font-black tracking-widest uppercase mb-4" style={{ color: B.textLight }}>Progress</p>
                <div className="flex flex-col gap-3">
                  {STEPS.map((s, i) => {
                    const done = i < stageIndex;
                    const active = i === stageIndex;
                    return (
                      <div key={s.key} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                          style={{ background: done ? 'linear-gradient(135deg,#15803D,#047857)' : active ? `linear-gradient(135deg,${B.navyDark},${B.navy})` : B.iceMid, color: done || active ? '#fff' : B.textLight }}>
                          {done ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> : i + 1}
                        </div>
                        <span className="text-sm font-bold" style={{ color: active ? B.textDark : done ? '#15803D' : B.textLight }}>{s.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Time stats */}
              <div className="rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(18,77,150,0.12)' }}>
                <p className="text-xs font-black tracking-widest uppercase mb-4" style={{ color: B.textLight }}>Time</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color: B.textMuted }}>Overall remaining</span>
                    <span className="text-sm font-black" style={{ color: B.navy }}>{fmtTime(overallTimeLeft)}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: B.iceMid }}>
                    <div className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${(overallTimeLeft / 270) * 100}%`, background: `linear-gradient(90deg,${B.navy},${B.blueMid})` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color: B.textMuted }}>Elapsed</span>
                    <span className="text-xs font-black" style={{ color: B.textMuted }}>{fmtTime(270 - overallTimeLeft)}</span>
                  </div>
                </div>
              </div>

              {/* Word count (only in story stage) */}
              {stage === "waitStory" && (
                <div className="rounded-2xl p-5"
                  style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(18,77,150,0.12)' }}>
                  <p className="text-xs font-black tracking-widest uppercase mb-4" style={{ color: B.textLight }}>Story stats</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(18,77,150,0.06)' }}>
                      <p className="text-xl font-black" style={{ color: B.navy }}>{wordCount}</p>
                      <p className="text-xs font-semibold mt-0.5" style={{ color: B.textLight }}>Words</p>
                    </div>
                    <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(18,77,150,0.06)' }}>
                      <p className="text-xl font-black" style={{ color: B.navy }}>{userStory.length}</p>
                      <p className="text-xs font-semibold mt-0.5" style={{ color: B.textLight }}>Chars</p>
                    </div>
                  </div>
                </div>
              )}



              {/* Submit (story stage) */}
              {stage === "waitStory" && (
                <button onClick={() => { setStage("showStories"); handleSubmitPPDT(); }}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ background: 'linear-gradient(90deg,#15803D,#047857)', color: '#fff', boxShadow: '0 6px 20px rgba(21,128,61,0.30)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Finish & Submit Story
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
