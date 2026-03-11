"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/footer/Footer";

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

interface Question {
  _id: string;
  question: string;
  options: string[];
  answer: string;
}

// ── Shared full-screen wrappers ────────────────────────────────────────────────
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: `linear-gradient(160deg,${B.iceBlue} 0%,${B.iceMid} 40%,#c8e8f8 100%)` }}>
      {children}
    </div>
  );
}

export default function DisplayFiveQuestion() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/questions/fivequestions");
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
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

  const handleAnswerSelect = (option: string) => {
    const a = [...answers]; a[currentQuestionIndex] = option; setAnswers(a);
  };
  const handleNext = () => currentQuestionIndex < questions.length - 1 && setCurrentQuestionIndex(i => i + 1);
  const handlePrevious = () => currentQuestionIndex > 0 && setCurrentQuestionIndex(i => i - 1);
  const handleSubmit = () => setShowResults(true);
  const calculateScore = () => questions.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) return (
    <PageShell>
      <div className="flex flex-col items-center gap-4 p-10 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(18,77,150,0.13)' }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin"
          style={{ borderColor: B.iceMid, borderTopColor: B.navy }} />
        <p className="text-sm font-semibold" style={{ color: B.textMuted }}>Loading questions…</p>
      </div>
    </PageShell>
  );

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error) return (
    <PageShell>
      <div className="max-w-md w-full p-8 rounded-2xl text-center"
        style={{ background: 'rgba(255,255,255,0.80)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(220,38,38,0.25)' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(220,38,38,0.10)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        </div>
        <p className="text-base font-semibold" style={{ color: '#DC2626' }}>{error}</p>
      </div>
    </PageShell>
  );

  // ── Results ──────────────────────────────────────────────────────────────────
  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 60;

    return (
      <>
        <PageShell>
          <div className="w-full max-w-2xl">
            {/* Score hero */}
            <div className="rounded-2xl p-8 mb-6 text-center relative overflow-hidden"
              style={{ background: `linear-gradient(135deg,${B.navyDeep},${B.navy})`, boxShadow: '0 12px 40px rgba(18,77,150,0.28)' }}>
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: 'rgba(37,99,235,0.18)', filter: 'blur(30px)' }} />
              <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: 'rgba(190,227,248,0.7)' }}>
                Quick Quiz — Results
              </p>
              <p className="text-6xl font-black text-white mb-1">{score}<span className="text-3xl opacity-60">/{questions.length}</span></p>
              <p className="text-2xl font-black mb-2" style={{ color: passed ? '#4ADE80' : '#F87171' }}>{percentage}%</p>
              <p className="text-sm font-medium" style={{ color: 'rgba(190,227,248,0.75)' }}>
                {passed ? 'Great work! Keep up the momentum.' : 'Keep practising to improve your score!'}
              </p>
            </div>

            {/* Answer breakdown */}
            <div className="rounded-2xl p-6 mb-5"
              style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(18,77,150,0.13)' }}>
              <h2 className="text-base font-extrabold mb-5 pb-4" style={{ color: B.textDark, borderBottom: '1px solid rgba(18,77,150,0.08)' }}>
                Answer Review
              </h2>
              <div className="flex flex-col gap-3">
                {questions.map((q, i) => {
                  const correct = answers[i] === q.answer;
                  return (
                    <div key={q._id} className="rounded-xl p-4"
                      style={{ background: correct ? 'rgba(21,128,61,0.06)' : 'rgba(220,38,38,0.05)', border: `1.5px solid ${correct ? 'rgba(21,128,61,0.20)' : 'rgba(220,38,38,0.18)'}` }}>
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
                            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                          }
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button onClick={() => window.location.href = '/fivequestion'}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: `linear-gradient(90deg,${B.navyDark},${B.navy})`, color: '#fff', boxShadow: '0 4px 16px rgba(18,77,150,0.28)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.52" /></svg>
                Retake Quiz
              </button>
              <button onClick={() => window.location.href = '/'}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'rgba(255,255,255,0.75)', color: B.textMid, border: `1.5px solid rgba(18,77,150,0.18)`, backdropFilter: 'blur(8px)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                Home
              </button>
            </div>
          </div>
        </PageShell>
        <Footer />
      </>
    );
  }

  // ── No questions guard ───────────────────────────────────────────────────────
  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return (
    <PageShell>
      <div className="p-8 rounded-2xl text-center"
        style={{ background: 'rgba(255,255,255,0.80)', color: B.textMuted }}>No questions available.</div>
    </PageShell>
  );

  const answeredCount = answers.filter(a => a !== null).length;
  const progressPct = ((currentQuestionIndex + 1) / questions.length) * 100;

  // ── Quiz ─────────────────────────────────────────────────────────────────────
  return (
    <>
      <PageShell>
        <div className="w-full max-w-2xl">
          {/* Header strip */}
          <div className="rounded-2xl px-6 py-4 mb-4 flex items-center justify-between"
            style={{ background: `linear-gradient(135deg,${B.navyDeep},${B.navy})` }}>
            <div>
              <p className="text-xs font-black tracking-widest uppercase" style={{ color: 'rgba(190,227,248,0.7)' }}>Quick Quiz</p>
              <p className="text-white font-black text-lg">5 Questions</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.12)', color: '#BEE3F8' }}>
                {answeredCount}/{questions.length} answered
              </span>
            </div>
          </div>

          {/* Question card */}
          <div className="rounded-2xl p-7"
            style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(14px)', border: '1.5px solid rgba(18,77,150,0.13)', boxShadow: '0 4px 20px rgba(18,77,150,0.09)' }}>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold" style={{ color: B.textMuted }}>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span className="text-xs font-bold" style={{ color: B.navy }}>{Math.round(progressPct)}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: B.iceMid }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%`, background: `linear-gradient(90deg,${B.navy},${B.blueMid})` }} />
              </div>
            </div>

            {/* Question bubble dots (navigator) */}
            <div className="flex flex-wrap gap-1.5 justify-center mb-6">
              {questions.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentQuestionIndex(idx)}
                  className="w-8 h-8 rounded-full text-xs font-black transition-all duration-200 hover:scale-110"
                  style={{
                    background: idx === currentQuestionIndex
                      ? `linear-gradient(135deg,${B.navyDark},${B.navy})`
                      : answers[idx] !== null
                        ? 'linear-gradient(135deg,#15803D,#047857)'
                        : B.iceMid,
                    color: idx === currentQuestionIndex || answers[idx] !== null ? '#fff' : B.textMuted,
                    boxShadow: idx === currentQuestionIndex ? '0 2px 8px rgba(18,77,150,0.30)' : 'none',
                  }}>
                  {idx + 1}
                </button>
              ))}
            </div>

            {/* Question text */}
            <h2 className="text-xl font-extrabold mb-6 leading-snug" style={{ color: B.textDark }}>
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="flex flex-col gap-3 mb-7">
              {currentQuestion.options.map((option, idx) => {
                const selected = answers[currentQuestionIndex] === option;
                return (
                  <button key={idx} onClick={() => handleAnswerSelect(option)}
                    className="w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl font-semibold text-sm transition-all duration-200"
                    style={{
                      background: selected ? `rgba(18,77,150,0.07)` : 'rgba(237,249,255,0.70)',
                      border: selected ? `2px solid ${B.navy}` : '2px solid rgba(18,77,150,0.12)',
                      color: selected ? B.navy : B.textMid,
                      transform: selected ? 'scale(1.01)' : 'scale(1)',
                      boxShadow: selected ? `0 4px 14px rgba(18,77,150,0.14)` : 'none',
                    }}>
                    {/* Option letter badge */}
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all duration-200"
                      style={{
                        background: selected ? B.navy : 'rgba(18,77,150,0.10)',
                        color: selected ? '#fff' : B.navy,
                      }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Nav buttons */}
            <div className="flex gap-3">
              <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'rgba(18,77,150,0.08)', color: B.textMid, border: '1.5px solid rgba(18,77,150,0.14)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Previous
              </button>

              <div className="flex-1" />

              {currentQuestionIndex === questions.length - 1 ? (
                <button onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ background: 'linear-gradient(90deg,#15803D,#047857)', color: '#fff', boxShadow: '0 4px 14px rgba(21,128,61,0.28)' }}>
                  Submit Quiz
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </button>
              ) : (
                <button onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ background: `linear-gradient(90deg,${B.navyDark},${B.navy})`, color: '#fff', boxShadow: '0 4px 14px rgba(18,77,150,0.28)' }}>
                  Next
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </PageShell>
      <Footer />
    </>
  );
}
