"use client";

import React, { useState, useEffect } from "react";
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
interface TATQuestion { _id: number; image: string; stories: Story[]; }

type Stage = "loading" | "viewImage" | "waitStory" | "showStories";

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

const STEPS = [
  { key: "viewImage", label: "Observe" },
  { key: "waitStory", label: "Write" },
];

export default function DisplayTatQuestion() {
  const router = useRouter();

  const [questions, setQuestions] = useState<TATQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("loading");

  const [timeLeft, setTimeLeft] = useState(30);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userStories, setUserStories] = useState<string[]>([]);
  const [currentStory, setCurrentStory] = useState("");
  const [overallTimeElapsed, setOverallTimeElapsed] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/tatquestions');
        if (!response.ok) throw new Error('Failed to fetch TAT questions');
        const result = await response.json();

        if (result.success && result.data.length > 0) {
          setQuestions(result.data);
          setUserStories(new Array(result.data.length).fill(""));
          setStage("viewImage");
        } else {
          throw new Error(result.error || 'No questions received');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch questions');
      }
    };
    fetchQuestions();
  }, []);

  // ── Overall time tracker ──────────────────────────────────────────────────
  useEffect(() => {
    if (stage === "loading" || stage === "showStories") return;
    const t = setInterval(() => setOverallTimeElapsed(v => v + 1), 1000);
    return () => clearInterval(t);
  }, [stage]);

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
      goToNext();
    }
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, stage, imageLoaded, currentIndex, questions.length]);

  const goToNext = () => {
    const newStories = [...userStories];
    newStories[currentIndex] = currentStory;
    setUserStories(newStories);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      const nextStory = newStories[currentIndex + 1] || "";
      setCurrentStory(nextStory);
      setWordCount(nextStory.trim() === "" ? 0 : nextStory.trim().split(/\s+/).length);
      setStage("viewImage");
      setTimeLeft(30);
      setImageLoaded(false);
    } else {
      setStage("showStories");
      handleSubmitTAT(newStories);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const newStories = [...userStories];
      newStories[currentIndex] = currentStory;
      setUserStories(newStories);

      setCurrentIndex(currentIndex - 1);
      const prevStory = userStories[currentIndex - 1] || "";
      setCurrentStory(prevStory);
      setWordCount(prevStory.trim() === "" ? 0 : prevStory.trim().split(/\s+/).length);
      setStage("waitStory");
      setTimeLeft(240);
      setImageLoaded(true);
    }
  };

  const stopTest = () => {
    const newStories = [...userStories];
    newStories[currentIndex] = currentStory;
    setUserStories(newStories);
    setStage("showStories");
    handleSubmitTAT(newStories);
  };

  const handleSubmitTAT = async (finalStories: string[]) => {
    if (submitted) return;
    setSubmitted(true);
    const token = getAuthToken();
    if (!token) return;

    try {
      await fetch('/api/tatquestions/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          testName: "TAT Test",
          score: questions.length,
          timeTaken: overallTimeElapsed,
          dateTaken: new Date().toISOString(),
          responses: finalStories.map((story, i) => ({ questionId: questions[i]?._id, story }))
        }),
      });
    } catch { /* silent */ }
  };

  const handleStoryChange = (v: string) => {
    setCurrentStory(v);
    setWordCount(v.trim() === "" ? 0 : v.trim().split(/\s+/).length);
  };

  const isTimeCritical = stage === "viewImage" ? timeLeft <= 10 : timeLeft <= 60;
  const progressPct = ((currentIndex + (stage === "waitStory" ? 0.5 : 0)) / questions.length) * 100;

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
        <p className="font-semibold mb-5 text-red-600">{error}</p>
        <button onClick={() => router.push("/alltest")}
          className="px-6 py-2.5 rounded-xl font-bold text-sm text-white"
          style={{ background: `linear-gradient(90deg,${B.navyDark},${B.navy})` }}>
          Go to All Tests
        </button>
      </div>
    </Centered>
  );

  if (stage === "loading" || questions.length === 0) return (
    <Centered>
      <div className="flex flex-col items-center gap-4 p-10 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.78)', border: '1.5px solid rgba(18,77,150,0.13)', backdropFilter: 'blur(12px)' }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin"
          style={{ borderColor: B.iceMid, borderTopColor: B.navy }} />
        <p className="text-sm font-semibold" style={{ color: B.textMuted }}>Loading TAT questions…</p>
      </div>
    </Centered>
  );

  const q = questions[currentIndex];

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-40 px-4 py-3"
        style={{ background: `linear-gradient(135deg,${B.navyDeep},${B.navy})`, boxShadow: '0 4px 20px rgba(10,42,85,0.35)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black tracking-widest uppercase" style={{ color: 'rgba(190,227,248,0.65)' }}>Psychology Test</p>
            <h1 className="text-lg font-black text-white leading-tight">Thematic Apperception Test (TAT)</h1>
          </div>

          {/* Picture indicator */}
          <div className="hidden sm:flex flex-col items-center gap-1 flex-1 max-w-xs">
            <div className="flex justify-between w-full text-xs font-bold" style={{ color: 'rgba(190,227,248,0.70)' }}>
              <span>Picture {currentIndex + 1} of {questions.length}</span>
              <span>{Math.round(progressPct)}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%`, background: '#4ADE80' }} />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden md:block mr-2">
              <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'rgba(190,227,248,0.6)' }}>Total Elapsed</p>
              <p className="text-sm font-black text-white">{fmtTime(overallTimeElapsed)}</p>
            </div>
            {stage !== "showStories" && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xl ${isTimeCritical ? 'animate-pulse' : ''}`}
                style={{ background: isTimeCritical ? 'rgba(220,38,38,0.25)' : 'rgba(255,255,255,0.12)', color: isTimeCritical ? '#F87171' : '#fff', border: isTimeCritical ? '1.5px solid rgba(220,38,38,0.40)' : '1.5px solid rgba(255,255,255,0.15)' }}>
                {stage === "viewImage" ? `${timeLeft}s` : fmtTime(timeLeft)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-screen px-4 py-6" style={{ background: `linear-gradient(160deg,${B.iceBlue},${B.iceMid},#c8e8f8)` }}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-5">

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0 space-y-5">
            {stage !== "showStories" ? (
              <div className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(14px)', border: '1.5px solid rgba(18,77,150,0.13)', boxShadow: '0 4px 20px rgba(18,77,150,0.09)' }}>

                <div className="px-6 pt-6 pb-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(18,77,150,0.08)' }}>
                  <div>
                    <span className="text-xs font-black tracking-widest uppercase px-2.5 py-1 rounded-full"
                      style={{ background: stage === 'viewImage' ? 'rgba(18,77,150,0.08)' : 'rgba(5,150,105,0.10)', color: stage === 'viewImage' ? B.navy : '#059669' }}>
                      {stage === "viewImage" ? `Observe Picture ${currentIndex + 1}` : `Write Story for Pic ${currentIndex + 1}`}
                    </span>
                  </div>
                  <p className="text-xs font-bold" style={{ color: B.textLight }}>Picture {currentIndex + 1} / {questions.length}</p>
                </div>

                <div className="p-6">
                  {stage === "viewImage" && (
                    <div className="space-y-6">
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: B.iceMid }}>
                        <div className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${(timeLeft / 30) * 100}%`, background: isTimeCritical ? '#DC2626' : `linear-gradient(90deg,${B.navy},${B.blueMid})` }} />
                      </div>
                      <div className="flex justify-center relative min-h-[360px]">
                        {!imageLoaded && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-2xl" style={{ background: B.iceMid }}>
                            <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: B.iceMid, borderTopColor: B.navy }} />
                          </div>
                        )}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={q.image} alt={`Scene ${currentIndex + 1}`}
                          className={`rounded-2xl max-w-full max-h-[500px] object-contain transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                          style={{ border: '2px solid rgba(18,77,150,0.15)', boxShadow: '0 8px 30px rgba(18,77,150,0.14)' }}
                          onLoad={() => setImageLoaded(true)}
                          onError={e => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x400?text=Image+Not+Available"; setImageLoaded(true); }} />
                      </div>
                    </div>
                  )}

                  {stage === "waitStory" && (
                    <div className="space-y-4">
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: B.iceMid }}>
                        <div className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${(timeLeft / 240) * 100}%`, background: isTimeCritical ? '#DC2626' : 'linear-gradient(90deg,#059669,#047857)' }} />
                      </div>
                      <textarea value={currentStory} onChange={e => handleStoryChange(e.target.value)}
                        placeholder="Establish the characters, describe the current situation, explain what led up to this, and how it will resolve positively..."
                        className="w-full h-80 px-5 py-4 rounded-xl resize-none text-sm leading-relaxed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 border-2"
                        style={{ background: 'rgba(237,249,255,0.70)', borderColor: 'rgba(18,77,150,0.14)', color: B.textDark, fontFamily: 'inherit' }} />

                      <div className="flex items-center justify-between">
                        <div className="flex gap-4 text-xs font-semibold" style={{ color: B.textMuted }}>
                          <span>{wordCount} <span style={{ color: B.textLight }}>words</span></span>
                          <span>{currentStory.length} <span style={{ color: B.textLight }}>chars</span></span>
                        </div>
                        <button onClick={goToNext}
                          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm text-white transition-all hover:opacity-90 active:scale-95 shadow-lg"
                          style={{ background: `linear-gradient(90deg,${B.navyDark},${B.navy})`, boxShadow: '0 4px 14px rgba(18,77,150,0.25)' }}>
                          {currentIndex + 1 === questions.length ? "Finish Test" : "Next Picture"}
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Results display */
              <div className="space-y-6">
                <div className="rounded-2xl p-8 relative overflow-hidden text-center"
                  style={{ background: `linear-gradient(135deg,${B.navyDeep},${B.navy})`, boxShadow: '0 12px 40px rgba(18,77,150,0.28)' }}>
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
                    style={{ background: 'rgba(37,99,235,0.18)', filter: 'blur(30px)' }} />
                  <p className="text-xs font-black tracking-widest uppercase mb-2" style={{ color: 'rgba(190,227,248,0.65)' }}>TAT — Thematic Apperception Test</p>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ background: 'rgba(74,222,128,0.20)', border: '2px solid rgba(74,222,128,0.40)' }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" ><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <h2 className="text-2xl font-black text-white mb-1">Test Completed!</h2>
                  <p className="text-sm font-medium" style={{ color: 'rgba(190,227,248,0.70)' }}>
                    Total Time: <span className="text-white font-black">{fmtTime(overallTimeElapsed)}</span>
                  </p>
                </div>

                <div className="space-y-8">
                  {questions.map((ques, idx) => (
                    <div key={idx} className="rounded-2xl p-6"
                      style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(18,77,150,0.13)' }}>
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                          style={{ background: B.navy }}>{idx + 1}</span>
                        <h3 className="font-extrabold" style={{ color: B.textDark }}>Picture {idx + 1}</h3>
                      </div>

                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={ques.image} alt={`Scene ${idx + 1}`} className="rounded-xl border w-full max-h-48 object-contain bg-gray-50" />
                        </div>
                        <div className="flex-1 space-y-5">
                          <div>
                            <p className="text-xs font-black uppercase mb-2 tracking-widest" style={{ color: B.textLight }}>Your Story</p>
                            <div className="rounded-xl p-4 text-sm leading-relaxed" style={{ background: 'rgba(5,150,105,0.05)', border: '1px solid rgba(5,150,105,0.15)', color: B.textDark, whiteSpace: 'pre-wrap' }}>
                              {userStories[idx] || <span className="italic text-gray-400">No story submitted.</span>}
                            </div>
                          </div>

                          {ques.stories?.length > 0 && (
                            <div>
                              <p className="text-xs font-black uppercase mb-2 tracking-widest" style={{ color: B.textLight }}>Sample References</p>
                              <div className="space-y-3">
                                {ques.stories.map((s, i) => (
                                  <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(18,77,150,0.04)', border: '1px solid rgba(18,77,150,0.10)' }}>
                                    <p className="text-xs font-black uppercase mb-1" style={{ color: B.navy }}>{s.title}</p>
                                    <p className="text-sm leading-relaxed" style={{ color: B.textMid }}>{s.narration}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => router.push("/alltest")}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm text-white transition-all hover:opacity-90 shadow-xl"
                  style={{ background: `linear-gradient(90deg,${B.navyDark},${B.navy})`, boxShadow: '0 6px 20px rgba(18,77,150,0.25)' }}>
                  Back to All Tests
                </button>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:w-64 shrink-0 flex flex-col gap-4">
            {stage !== "showStories" && (
              <>
                <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(18,77,150,0.12)' }}>
                  <p className="text-xs font-black tracking-widest uppercase mb-4" style={{ color: B.textLight }}>Current Progress</p>
                  <div className="flex flex-col gap-3">
                    {/* observation / writing toggle indicators */}
                    {STEPS.map((s, i) => {
                      const active = s.key === stage;
                      const done = (stage === "waitStory" && i === 0);
                      return (
                        <div key={s.key} className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                            style={{ background: done ? '#15803D' : active ? B.navy : B.iceMid, color: done || active ? '#fff' : B.textLight }}>
                            {done ? '✓' : i + 1}
                          </div>
                          <span className="text-sm font-bold" style={{ color: active ? B.textDark : B.textLight }}>{s.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Pic selection grid / mini dots */}
                <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(18,77,150,0.12)' }}>
                  <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: B.textLight }}>Pictures</p>
                  <div className="grid grid-cols-4 gap-2">
                    {questions.map((_, i) => {
                      const active = i === currentIndex;
                      const done = userStories[i]?.length > 10;
                      return (
                        <div key={i} className="h-2 rounded-full"
                          style={{ background: active ? B.navy : done ? '#15803D' : B.iceMid }} />
                      )
                    })}
                  </div>
                  <p className="text-[10px] mt-3 font-bold text-center" style={{ color: B.textLight }}>
                    {userStories.filter(s => s.length > 10).length} of {questions.length} stories drafted
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button onClick={goToPrevious} disabled={currentIndex === 0}
                    className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:bg-white bg-white/50 border disabled:opacity-30"
                    style={{ color: B.textMid, borderColor: 'rgba(18,77,150,0.15)' }}>
                    ← Previous
                  </button>
                  <button onClick={stopTest}
                    className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:bg-red-50"
                    style={{ color: '#DC2626', background: 'rgba(220,38,38,0.05)', border: '1.5px solid rgba(220,38,38,0.15)' }}>
                    Stop Test Early
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

    </>
  );
}
