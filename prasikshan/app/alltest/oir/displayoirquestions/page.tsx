"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/footer/Footer";

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

interface Question {
  _id: string;
  question: string;
  options: string[];
  answer: string;
}

export default function DisplayOirQuestion() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/oirquestions");
        const data = await res.json();
        if (data.success && data.data?.length > 0) {
          setQuestions(data.data);
          setAnswers(new Array(data.data.length).fill(null));
        } else {
          setError(data.message || "Failed to fetch questions");
        }
      } catch (err) {
        setError("Error fetching questions: " + (err instanceof Error ? err.message : "Unknown error"));
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // ── Timer ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (showResults) return;
    const t = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setShowResults(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(t);
  }, [showResults]);

  // ── Auto-submit ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!showResults || submitted || questions.length === 0) return;
    const performSubmit = async () => {
      try {
        setSubmitting(true);
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
          const score = calcScore();
          const timeTaken = 40 * 60 - timeLeft;
          const responses = questions.map((q, i) => ({
            _id: q._id, question: q.question,
            selectedAnswer: answers[i] || null,
            correctAnswer: q.answer,
            isCorrect: answers[i] === q.answer,
          }));
          await fetch("/api/oirquestions/result", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ testName: "OIR", score, timeTaken, dateTaken: new Date().toISOString(), responses }),
          });
        }
        setSubmitted(true);
      } catch { setSubmitted(true); }
      finally { setSubmitting(false); }
    };
    performSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResults, submitted]);

  const calcScore = () => questions.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0);

  const fmtTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const toggleReview = () => {
    const s = new Set(markedForReview);
    s.has(currentQ) ? s.delete(currentQ) : s.add(currentQ);
    setMarkedForReview(s);
  };

  const answeredCount = answers.filter(a => a !== null).length;
  const isTimeCritical = timeLeft < 300; // last 5 min

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen"
      style={{ background: `linear-gradient(160deg,${B.iceBlue},${B.iceMid})` }}>
      <div className="flex flex-col items-center gap-4 p-10 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.78)', border: '1.5px solid rgba(18,77,150,0.13)', backdropFilter: 'blur(12px)' }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin"
          style={{ borderColor: B.iceMid, borderTopColor: B.navy }} />
        <p className="text-sm font-semibold" style={{ color: B.textMuted }}>Loading OIR questions…</p>
      </div>
    </div>
  );

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error) return (
    <div className="flex items-center justify-center min-h-screen"
      style={{ background: `linear-gradient(160deg,${B.iceBlue},${B.iceMid})` }}>
      <div className="max-w-md w-full p-8 rounded-2xl text-center"
        style={{ background: 'rgba(255,255,255,0.80)', border: '1.5px solid rgba(220,38,38,0.22)', backdropFilter: 'blur(12px)' }}>
        <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(220,38,38,0.10)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        </div>
        <p className="font-semibold text-base" style={{ color: '#DC2626' }}>{error}</p>
      </div>
    </div>
  );

  // ── Results ──────────────────────────────────────────────────────────────────
  if (showResults) {
    const score = calcScore();
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 60;
    const timeTaken = 40 * 60 - timeLeft;
    const mins = Math.floor(timeTaken / 60);
    const secs = timeTaken % 60;

    return (
      <>
        <div className="min-h-screen px-4 py-10"
          style={{ background: `linear-gradient(160deg,${B.iceBlue},${B.iceMid},#c8e8f8)` }}>
          <div className="max-w-3xl mx-auto space-y-5">

            {/* Score hero */}
            <div className="rounded-2xl p-8 relative overflow-hidden text-center"
              style={{ background: `linear-gradient(135deg,${B.navyDeep},${B.navy})`, boxShadow: '0 12px 40px rgba(18,77,150,0.28)' }}>
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: 'rgba(37,99,235,0.18)', filter: 'blur(30px)' }} />
              <p className="text-xs font-black tracking-widest uppercase mb-2" style={{ color: 'rgba(190,227,248,0.65)' }}>OIR — Officer Intelligence Rating</p>
              <p className="text-6xl font-black text-white mb-1">{score}<span className="text-3xl opacity-50">/{questions.length}</span></p>
              <p className="text-2xl font-black mb-3" style={{ color: passed ? '#4ADE80' : '#F87171' }}>{pct}%</p>
              <div className="flex justify-center gap-6 mt-4">
                <div className="text-center">
                  <p className="text-xs font-bold" style={{ color: 'rgba(190,227,248,0.65)' }}>Time Taken</p>
                  <p className="text-lg font-black text-white">{mins}m {secs}s</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold" style={{ color: 'rgba(190,227,248,0.65)' }}>Marked</p>
                  <p className="text-lg font-black text-white">{markedForReview.size}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold" style={{ color: 'rgba(190,227,248,0.65)' }}>Skipped</p>
                  <p className="text-lg font-black text-white">{questions.length - answeredCount}</p>
                </div>
              </div>
            </div>

            {/* Answer review */}
            <div className="rounded-2xl p-6"
              style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(18,77,150,0.13)' }}>
              <h2 className="text-base font-extrabold mb-5 pb-4" style={{ color: B.textDark, borderBottom: '1px solid rgba(18,77,150,0.08)' }}>
                Answer Review
              </h2>
              <div className="flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-1">
                {questions.map((q, i) => {
                  const correct = answers[i] === q.answer;
                  return (
                    <div key={q._id} className="rounded-xl p-4"
                      style={{ background: correct ? 'rgba(21,128,61,0.05)' : 'rgba(220,38,38,0.05)', border: `1.5px solid ${correct ? 'rgba(21,128,61,0.20)' : 'rgba(220,38,38,0.18)'}` }}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-bold mb-1.5" style={{ color: B.textDark }}>Q{i + 1}. {q.question}</p>
                          <p className="text-xs font-medium" style={{ color: correct ? '#15803D' : '#B91C1C' }}>
                            Your answer: <span className="font-bold">{answers[i] || 'Not answered'}</span>
                          </p>
                          {!correct && (
                            <p className="text-xs font-medium mt-0.5" style={{ color: '#15803D' }}>
                              Correct: <span className="font-bold">{q.answer}</span>
                            </p>
                          )}
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: correct ? 'rgba(21,128,61,0.12)' : 'rgba(220,38,38,0.10)' }}>
                          {correct
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

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={() => window.location.href = '/alltest/oir'}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: `linear-gradient(90deg,${B.navyDark},${B.navy})`, color: '#fff', boxShadow: '0 4px 16px rgba(18,77,150,0.28)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.52" /></svg>
                Retake Test
              </button>
              <button onClick={() => window.location.href = '/alltest'}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'rgba(255,255,255,0.75)', color: B.textMid, border: `1.5px solid rgba(18,77,150,0.18)`, backdropFilter: 'blur(8px)' }}>
                All Tests
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const q = questions[currentQ];
  if (!q) return null;

  // dot colours for navigator
  const dotStyle = (idx: number) => {
    const isCur = idx === currentQ;
    const isAns = answers[idx] !== null;
    const isMark = markedForReview.has(idx);
    if (isCur) return { background: `linear-gradient(135deg,${B.navyDark},${B.navy})`, color: '#fff', boxShadow: '0 2px 8px rgba(18,77,150,0.30)' };
    if (isMark && isAns) return { background: 'linear-gradient(135deg,#D97706,#B45309)', color: '#fff' };
    if (isMark) return { background: 'linear-gradient(135deg,#F59E0B,#D97706)', color: '#fff' };
    if (isAns) return { background: 'linear-gradient(135deg,#15803D,#047857)', color: '#fff' };
    return { background: B.iceMid, color: B.textMuted };
  };

  // ── Quiz UI ───────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-40 px-4 py-3"
        style={{ background: `linear-gradient(135deg,${B.navyDeep},${B.navy})`, boxShadow: '0 4px 20px rgba(10,42,85,0.35)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black tracking-widest uppercase" style={{ color: 'rgba(190,227,248,0.65)' }}>Intelligence Test</p>
            <h1 className="text-lg font-black text-white leading-tight">Officer Intelligence Rating</h1>
          </div>

          {/* Progress micro-bar */}
          <div className="hidden sm:flex flex-col items-center gap-1 flex-1 max-w-xs">
            <div className="flex justify-between w-full text-xs font-bold" style={{ color: 'rgba(190,227,248,0.70)' }}>
              <span>{answeredCount} answered</span>
              <span>{questions.length - answeredCount} remaining</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(answeredCount / questions.length) * 100}%`, background: '#4ADE80' }} />
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-3 shrink-0">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xl ${isTimeCritical ? 'animate-pulse' : ''}`}
              style={{ background: isTimeCritical ? 'rgba(220,38,38,0.25)' : 'rgba(255,255,255,0.12)', color: isTimeCritical ? '#F87171' : '#fff', border: isTimeCritical ? '1.5px solid rgba(220,38,38,0.40)' : '1.5px solid rgba(255,255,255,0.15)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              {fmtTime(timeLeft)}
            </div>
          </div>
        </div>
      </div>

      {/* ── Layout ── */}
      <div className="min-h-screen" style={{ background: `linear-gradient(160deg,${B.iceBlue},${B.iceMid},#c8e8f8)` }}>
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-5">

          {/* ── Question panel ── */}
          <div className="flex-1 min-w-0 rounded-2xl p-6 sm:p-8"
            style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(14px)', border: '1.5px solid rgba(18,77,150,0.13)', boxShadow: '0 4px 20px rgba(18,77,150,0.09)' }}>

            {/* Question header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black tracking-widest uppercase px-2.5 py-1 rounded-full"
                style={{ background: `rgba(18,77,150,0.08)`, color: B.navy }}>
                Q {currentQ + 1} / {questions.length}
              </span>
              <span className="text-xs font-bold" style={{ color: B.textLight }}>MCQ · Single correct</span>
            </div>

            {/* Progress bar under header */}
            <div className="h-1 rounded-full mb-6 overflow-hidden" style={{ background: B.iceMid }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${((currentQ + 1) / questions.length) * 100}%`, background: `linear-gradient(90deg,${B.navy},${B.blueMid})` }} />
            </div>

            {/* Question text */}
            <h2 className="text-xl font-extrabold leading-snug mb-7" style={{ color: B.textDark }}>
              {q.question}
            </h2>

            {/* Options */}
            <div className="flex flex-col gap-3 mb-8">
              {q.options.map((opt, idx) => {
                const sel = answers[currentQ] === opt;
                return (
                  <button key={idx} onClick={() => { const a = [...answers]; a[currentQ] = opt; setAnswers(a); }}
                    className="w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl font-semibold text-sm transition-all duration-200"
                    style={{
                      background: sel ? `rgba(18,77,150,0.07)` : 'rgba(237,249,255,0.75)',
                      border: sel ? `2px solid ${B.navy}` : '2px solid rgba(18,77,150,0.12)',
                      color: sel ? B.navy : B.textMid,
                      transform: sel ? 'scale(1.01)' : 'scale(1)',
                      boxShadow: sel ? `0 4px 14px rgba(18,77,150,0.14)` : 'none',
                    }}>
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all duration-200"
                      style={{ background: sel ? B.navy : 'rgba(18,77,150,0.10)', color: sel ? '#fff' : B.navy }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Navigation row */}
            <div className="flex items-center justify-between pt-5" style={{ borderTop: '1px solid rgba(18,77,150,0.08)' }}>
              <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed"
                style={{ background: 'rgba(18,77,150,0.07)', color: B.textMid, border: '1.5px solid rgba(18,77,150,0.14)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Previous
              </button>

              <button onClick={toggleReview}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs transition-all hover:opacity-90"
                style={{
                  background: markedForReview.has(currentQ) ? 'rgba(217,119,6,0.12)' : 'rgba(18,77,150,0.06)',
                  color: markedForReview.has(currentQ) ? '#D97706' : B.textMuted,
                  border: markedForReview.has(currentQ) ? '1.5px solid rgba(217,119,6,0.35)' : '1.5px solid rgba(18,77,150,0.12)',
                }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill={markedForReview.has(currentQ) ? '#D97706' : 'none'} stroke={markedForReview.has(currentQ) ? '#D97706' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                {markedForReview.has(currentQ) ? 'Marked' : 'Mark for review'}
              </button>

              <button onClick={() => setCurrentQ(Math.min(questions.length - 1, currentQ + 1))} disabled={currentQ === questions.length - 1}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed"
                style={{ background: `linear-gradient(90deg,${B.navyDark},${B.navy})`, color: '#fff', boxShadow: '0 4px 14px rgba(18,77,150,0.25)' }}>
                Next
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:w-72 shrink-0 flex flex-col gap-4">

            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Answered', val: answeredCount, color: '#15803D', bg: 'rgba(21,128,61,0.08)', border: 'rgba(21,128,61,0.22)' },
                { label: 'Skipped', val: questions.length - answeredCount, color: B.textMuted, bg: 'rgba(18,77,150,0.05)', border: 'rgba(18,77,150,0.14)' },
                { label: 'Flagged', val: markedForReview.size, color: '#D97706', bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.22)' },
              ].map(({ label, val, color, bg, border }) => (
                <div key={label} className="rounded-xl p-3 text-center" style={{ background: bg, border: `1.5px solid ${border}`, backdropFilter: 'blur(8px)' }}>
                  <p className="text-xl font-black" style={{ color }}>{val}</p>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: B.textLight }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="rounded-2xl p-4"
              style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(18,77,150,0.12)' }}>
              <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: B.textLight }}>Legend</p>
              <div className="flex flex-col gap-2">
                {[
                  { color: `linear-gradient(135deg,${B.navyDark},${B.navy})`, label: 'Current' },
                  { color: 'linear-gradient(135deg,#15803D,#047857)', label: 'Answered' },
                  { color: 'linear-gradient(135deg,#F59E0B,#D97706)', label: 'Flagged' },
                  { color: B.iceMid, label: 'Not visited', text: B.textMuted },
                ].map(({ color, label, text }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-md shrink-0" style={{ background: color }} />
                    <span className="text-xs font-semibold" style={{ color: text || B.textMid }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Question navigator */}
            <div className="rounded-2xl p-4 flex-1"
              style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(18,77,150,0.12)' }}>
              <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: B.textLight }}>Questions</p>
              <div className="grid grid-cols-5 gap-1.5 max-h-72 overflow-y-auto">
                {questions.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentQ(idx)}
                    className="w-10 h-10 rounded-lg text-xs font-black transition-all duration-200 hover:scale-110"
                    style={dotStyle(idx)}>
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button onClick={() => setShowResults(true)} disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
              style={{ background: 'linear-gradient(90deg,#15803D,#047857)', color: '#fff', boxShadow: '0 6px 20px rgba(21,128,61,0.30)' }}>
              {submitting
                ? <><div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.4)', borderTopColor: '#fff' }} /> Submitting…</>
                : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> Submit Test</>
              }
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
