"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ── Brand palette ─────────────────────────────────────────────────────────────
const B = {
  navy: '#124D96',
  navyDark: '#0D3A72',
  navyDeep: '#0A2A55',
  blueMid: '#2563EB',
  blueLight: '#60A5FA',
  iceBlue: '#EDF9FF',
  iceMid: '#D7F1FF',
  textDark: '#0F172A',
  textMid: '#334155',
  textMuted: '#475569',
  textLight: '#94A3B8',
};

interface WatQuestion {
  word: string;
  sentences: string[];
}

export default function DisplayWATQuestion() {
  const router = useRouter();
  const [questions, setQuestions] = useState<WatQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [currentResponse, setCurrentResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [overallTimeLeft, setOverallTimeLeft] = useState(15 * 60);
  const [testStarted, setTestStarted] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [setName, setSetName] = useState<string>("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/watquestions");
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          setQuestions(data.data);
          setResponses(new Array(data.data.length).fill(""));
          setSetName(data.setName || "");
          setTestStarted(true);
        } else {
          setError(data.error || "Failed to fetch WAT questions");
        }
      } catch (err) {
        setError("Error fetching questions: " + (err instanceof Error ? err.message : "Unknown error"));
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // 15 seconds per word timer
  useEffect(() => {
    if (!testStarted || showResults || !questions.length) return;
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      moveToNextWord();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, testStarted, showResults, questions.length]);

  // Overall timer
  useEffect(() => {
    if (!testStarted || showResults) return;
    if (overallTimeLeft > 0) {
      const timer = setTimeout(() => setOverallTimeLeft(overallTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      submitTest();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overallTimeLeft, testStarted, showResults]);

  const fmtTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const saveCurrentResponse = () => {
    const newResponses = [...responses];
    newResponses[currentIndex] = currentResponse;
    setResponses(newResponses);
    return newResponses;
  };

  const moveToNextWord = () => {
    saveCurrentResponse();
    setCurrentResponse("");
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(15);
    } else {
      setShowResults(true);
      submitTest();
    }
  };

  const moveToPreviousWord = () => {
    saveCurrentResponse();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentResponse(responses[currentIndex - 1]);
      setTimeLeft(15);
    }
  };

  const jumpToWord = (idx: number) => {
    saveCurrentResponse();
    setCurrentIndex(idx);
    setCurrentResponse(responses[idx]);
    setTimeLeft(15);
  };

  const submitTest = async () => {
    try {
      setSubmitting(true);
      const newResponses = saveCurrentResponse();
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token && questions.length > 0) {
        const testData = {
          testName: "WAT",
          score: newResponses.filter((r) => r.trim().length > 0).length,
          timeTaken: 15 * 60 - overallTimeLeft,
          dateTaken: new Date().toISOString(),
          responses: questions.map((q, idx) => ({ word: q.word, response: newResponses[idx] || "" })),
        };
        await fetch("/api/watquestions/result", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(testData),
        });
      }
      setShowResults(true);
    } catch (err) { } finally { setSubmitting(false); }
  };

  const answeredCount = responses.filter((r) => r && r.trim().length > 0).length;
  const isTimeCritical = overallTimeLeft < 180; // last 3 minutes

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: `linear-gradient(160deg,${B.iceBlue},${B.iceMid})` }}>
      <div className="flex flex-col items-center gap-4 p-10 rounded-2xl" style={{ background: 'rgba(255,255,255,0.78)', border: '1.5px solid rgba(18,77,150,0.13)', backdropFilter: 'blur(12px)' }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: B.iceMid, borderTopColor: B.navy }} />
        <p className="text-sm font-semibold" style={{ color: B.textMuted }}>Loading WAT questions…</p>
      </div>
    </div>
  );

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: `linear-gradient(160deg,${B.iceBlue},${B.iceMid})` }}>
      <div className="max-w-md w-full p-8 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.80)', border: '1.5px solid rgba(220,38,38,0.22)', backdropFilter: 'blur(12px)' }}>
        <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(220,38,38,0.10)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        </div>
        <p className="font-semibold text-base" style={{ color: '#DC2626' }}>{error}</p>
        <button onClick={() => router.push("/alltest")} className="mt-5 px-5 py-2 rounded-lg font-bold text-sm text-white" style={{ background: B.navy }}>Back to All Tests</button>
      </div>
    </div>
  );

  // ── Results ──────────────────────────────────────────────────────────────────
  if (showResults) {
    const timeTaken = 15 * 60 - overallTimeLeft;
    const mins = Math.floor(timeTaken / 60);
    const secs = timeTaken % 60;
    const pct = Math.round((answeredCount / questions.length) * 100);

    return (
      <div className="min-h-screen px-4 py-10" style={{ background: `linear-gradient(160deg,${B.iceBlue},${B.iceMid},#c8e8f8)` }}>
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Score hero */}
          <div className="rounded-2xl p-8 relative overflow-hidden text-center" style={{ background: `linear-gradient(135deg,${B.navyDeep},${B.navy})`, boxShadow: '0 12px 40px rgba(18,77,150,0.28)' }}>
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'rgba(37,99,235,0.18)', filter: 'blur(30px)' }} />
            <p className="text-xs font-black tracking-widest uppercase mb-2" style={{ color: 'rgba(190,227,248,0.65)' }}>WAT — Word Association Test</p>
            <p className="text-6xl font-black text-white mb-1">{answeredCount}<span className="text-3xl opacity-50">/{questions.length}</span></p>
            <p className="text-xl font-bold mb-3" style={{ color: 'rgba(190,227,248,0.85)' }}>Words Attempted</p>
            <div className="flex justify-center gap-6 mt-4">
              <div className="text-center">
                <p className="text-xs font-bold" style={{ color: 'rgba(190,227,248,0.65)' }}>Time Taken</p>
                <p className="text-lg font-black text-white">{mins}m {secs}s</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold" style={{ color: 'rgba(190,227,248,0.65)' }}>Completion %</p>
                <p className="text-lg font-black text-white">{pct}%</p>
              </div>
            </div>
          </div>

          {/* Answer review */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(18,77,150,0.13)' }}>
            <h2 className="text-base font-extrabold mb-5 pb-4" style={{ color: B.textDark, borderBottom: '1px solid rgba(18,77,150,0.08)' }}>Response Review</h2>
            <div className="flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-1">
              {questions.map((q, i) => {
                const ans = responses[i] || '';
                const answered = ans.trim().length > 0;
                return (
                  <div key={i} className="rounded-xl p-4" style={{ background: answered ? 'rgba(21,128,61,0.05)' : 'rgba(220,38,38,0.05)', border: `1.5px solid ${answered ? 'rgba(21,128,61,0.20)' : 'rgba(220,38,38,0.18)'}` }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 w-full">
                        <p className="text-sm font-bold mb-1.5" style={{ color: B.textDark }}>Word {i + 1}. <span className="text-xl font-black" style={{ color: B.navy }}>{q.word}</span></p>
                        <p className="text-sm font-medium p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.6)', border: '1.5px solid rgba(18,77,150,0.10)', color: answered ? B.textDark : '#B91C1C', wordBreak: 'break-word' }}>
                          {answered ? ans : <span className="italic text-sm">No response provided</span>}
                        </p>
                        
                        {q.sentences && q.sentences.length > 0 && q.sentences[0].trim() && (
                           <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(18,77,150,0.05)', border: '1.5px dashed rgba(18,77,150,0.15)' }}>
                             <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: B.navy }}>Example Sentences</p>
                             <ul className="list-disc pl-5 text-sm space-y-1" style={{ color: B.textMid }}>
                               {q.sentences.map((s, sidx) => s.trim() ? <li key={sidx}>{s}</li> : null)}
                             </ul>
                           </div>
                        )}
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: answered ? 'rgba(21,128,61,0.12)' : 'rgba(220,38,38,0.10)' }}>
                        {answered
                          ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                          : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        }
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => window.location.href = '/alltest/wat'} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95" style={{ background: `linear-gradient(90deg,${B.navyDark},${B.navy})`, color: '#fff', boxShadow: '0 4px 16px rgba(18,77,150,0.28)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.52" /></svg> Retake Test
            </button>
            <button onClick={() => window.location.href = '/alltest'} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95" style={{ background: 'rgba(255,255,255,0.75)', color: B.textMid, border: `1.5px solid rgba(18,77,150,0.18)`, backdropFilter: 'blur(8px)' }}>
              All Tests
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];
  if (!q) return null;

  // Dot color logic for the navigator
  const dotStyle = (idx: number) => {
    const isCur = idx === currentIndex;
    const isAns = responses[idx] && responses[idx].trim().length > 0;
    if (isCur) return { background: `linear-gradient(135deg,${B.navyDark},${B.navy})`, color: '#fff', boxShadow: '0 2px 8px rgba(18,77,150,0.30)' };
    if (isAns) return { background: 'linear-gradient(135deg,#15803D,#047857)', color: '#fff' };
    return { background: B.iceMid, color: B.textMuted };
  };

  return (
    <>
      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-40 px-4 py-3" style={{ background: `linear-gradient(135deg,${B.navyDeep},${B.navy})`, boxShadow: '0 4px 20px rgba(10,42,85,0.35)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black tracking-widest uppercase" style={{ color: 'rgba(190,227,248,0.65)' }}>Word Association Test {setName ? `— ${setName}` : ''}</p>
            <h1 className="text-lg font-black text-white leading-tight">WAT Assessment</h1>
          </div>
          <div className="hidden sm:flex flex-col items-center gap-1 flex-1 max-w-xs">
            <div className="flex justify-between w-full text-xs font-bold" style={{ color: 'rgba(190,227,248,0.70)' }}>
              <span>{answeredCount} answered</span>
              <span>{questions.length - answeredCount} remaining</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(answeredCount / questions.length) * 100}%`, background: '#4ADE80' }} />
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xl ${isTimeCritical ? 'animate-pulse' : ''}`} style={{ background: isTimeCritical ? 'rgba(220,38,38,0.25)' : 'rgba(255,255,255,0.12)', color: isTimeCritical ? '#F87171' : '#fff', border: isTimeCritical ? '1.5px solid rgba(220,38,38,0.40)' : '1.5px solid rgba(255,255,255,0.15)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              {fmtTime(overallTimeLeft)}
            </div>
          </div>
        </div>
      </div>

      {/* ── Layout ── */}
      <div className="min-h-screen" style={{ background: `linear-gradient(160deg,${B.iceBlue},${B.iceMid},#c8e8f8)` }}>
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-5">
          {/* Main Panel */}
          <div className="flex-1 min-w-0 rounded-2xl p-6 sm:p-8 flex flex-col" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(14px)', border: '1.5px solid rgba(18,77,150,0.13)', boxShadow: '0 4px 20px rgba(18,77,150,0.09)' }}>
            <div className="flex items-center justify-between mb-8">
              <span className="text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full" style={{ background: `rgba(18,77,150,0.08)`, color: B.navy }}>
                Word {currentIndex + 1} / {questions.length}
              </span>
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${timeLeft <= 5 ? 'animate-pulse' : ''}`} style={{ background: timeLeft <= 5 ? 'rgba(220,38,38,0.1)' : 'rgba(21,128,61,0.1)', color: timeLeft <= 5 ? '#DC2626' : '#15803D' }}>
                Word Timer: {timeLeft}s
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center mb-8">
              <p className="text-sm font-bold tracking-widest uppercase mb-4" style={{ color: B.textLight }}>CURRENT WORD</p>
              <h2 className="text-4xl sm:text-6xl font-black text-center" style={{ color: B.navy, wordBreak: 'break-word' }}>
                {q.word}
              </h2>
            </div>

            <div className="w-full mt-auto">
              <label className="block text-sm font-black tracking-widest uppercase mb-3" style={{ color: B.textMuted }}>Your Response</label>
              <textarea
                value={currentResponse}
                onChange={(e) => setCurrentResponse(e.target.value)}
                placeholder="Type your sentence here..."
                className="w-full px-5 py-4 border-2 rounded-xl focus:outline-none transition-all resize-none font-medium text-base sm:text-lg min-h-[140px]"
                style={{ borderColor: 'rgba(18,77,150,0.22)', background: '#fff', color: B.textDark, boxShadow: 'inset 0 2px 6px rgba(18,77,150,0.04)' }}
                autoFocus
                onFocus={(e) => e.target.style.borderColor = B.navy}
                onBlur={(e) => e.target.style.borderColor = 'rgba(18,77,150,0.22)'}
              />
              <div className="flex items-center justify-between mt-2 px-1">
                <span className="text-xs font-bold" style={{ color: B.textLight }}>{currentResponse.length} / 500 chars</span>
                {currentResponse.trim().length > 0 && <span className="text-xs font-bold" style={{ color: '#15803D' }}>Saved in buffer ✓</span>}
              </div>
            </div>

            {/* Navigation Buttons Row */}
            <div className="flex items-center justify-between pt-6 mt-4" style={{ borderTop: '1px solid rgba(18,77,150,0.08)' }}>
              <button onClick={moveToPreviousWord} disabled={currentIndex === 0}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed"
                style={{ background: 'rgba(18,77,150,0.07)', color: B.textMid, border: '1.5px solid rgba(18,77,150,0.14)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg> Previous
              </button>
              <button onClick={currentIndex === questions.length - 1 ? submitTest : moveToNextWord} disabled={submitting}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed"
                style={{ background: `linear-gradient(90deg,${B.navyDark},${B.navy})`, color: '#fff', boxShadow: '0 4px 14px rgba(18,77,150,0.25)' }}>
                {submitting ? 'Submitting...' : (currentIndex === questions.length - 1 ? 'Submit Test' : 'Next Word')}
                {!submitting && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-72 shrink-0 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(21,128,61,0.08)', border: '1.5px solid rgba(21,128,61,0.22)', backdropFilter: 'blur(8px)' }}>
                <p className="text-xl font-black text-green-700">{answeredCount}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: B.textLight }}>Answered</p>
              </div>
              <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(18,77,150,0.05)', border: '1.5px solid rgba(18,77,150,0.14)', backdropFilter: 'blur(8px)' }}>
                <p className="text-xl font-black" style={{ color: B.textMuted }}>{questions.length - answeredCount}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: B.textLight }}>Pending</p>
              </div>
            </div>

            <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(18,77,150,0.12)' }}>
              <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: B.textLight }}>Legend</p>
              <div className="flex flex-col gap-2">
                {[
                  { color: `linear-gradient(135deg,${B.navyDark},${B.navy})`, label: 'Current' },
                  { color: 'linear-gradient(135deg,#15803D,#047857)', label: 'Answered' },
                  { color: B.iceMid, label: 'Not visited', text: B.textMuted },
                ].map(({ color, label, text }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-md shrink-0" style={{ background: color }} />
                    <span className="text-xs font-semibold" style={{ color: text || B.textMid }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-4 flex-1" style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(18,77,150,0.12)' }}>
              <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: B.textLight }}>Navigator</p>
              <div className="grid grid-cols-5 gap-1.5 max-h-72 overflow-y-auto">
                {questions.map((_, idx) => (
                  <button key={idx} onClick={() => jumpToWord(idx)} className="w-10 h-10 rounded-lg text-xs font-black transition-all duration-200 hover:scale-110" style={dotStyle(idx)}>{idx + 1}</button>
                ))}
              </div>
            </div>

            <button onClick={submitTest} disabled={submitting} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-60" style={{ background: 'linear-gradient(90deg,#15803D,#047857)', color: '#fff', boxShadow: '0 6px 20px rgba(21,128,61,0.30)' }}>
              {submitting ? <><div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.4)', borderTopColor: '#fff' }} /> Submitting…</> : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> Submit WAT Test</>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
