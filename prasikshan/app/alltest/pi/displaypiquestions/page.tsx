"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/axios";

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
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#F43F5E',
};

interface PiQuestion {
  _id: string;
  question_id: number;
  question: string;
  expectation: string;
}

type Stage = "loading" | "questions" | "review" | "results";

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

export default function DisplayPiQuestion() {
  const router = useRouter();

  const [questions, setQuestions] = useState<PiQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("loading");

  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [overallTimeElapsed, setOverallTimeElapsed] = useState(0);
  
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [aiReview, setAiReview] = useState<string | null>(null);
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [questionReviews, setQuestionReviews] = useState<{ question_id: number; review: string }[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/piquestions');
        if (!response.ok) throw new Error('Failed to fetch PI questions');
        const result = await response.json();

        if (result.data && result.data.length > 0) {
          setQuestions(result.data);
          setStage("questions");
        } else {
          throw new Error('No questions received');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch questions');
      }
    };
    fetchQuestions();
  }, []);

  // ── Overall time tracker ──────────────────────────────────────────────────
  useEffect(() => {
    if (stage === "loading" || stage === "results" || stage === "review") return;
    const t = setInterval(() => setOverallTimeElapsed(v => v + 1), 1000);
    return () => clearInterval(t);
  }, [stage]);

  const handleAnswerChange = (v: string) => {
    const questionId = questions[currentIndex].question_id;
    setAnswers({
      ...answers,
      [questionId]: v,
    });
  };

  const goToNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setStage("review");
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const stopTest = () => {
    setStage("review");
  };

  const fetchAiReview = async (formattedAnswers: any[]) => {
    const attempted = formattedAnswers.filter(r => r.answer.trim().length > 0);
    if (attempted.length === 0) return 0;

    setReviewLoading(true);
    setReviewError(null);
    setQuotaExceeded(false);
    try {
      const res = await fetch("/api/pi-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: formattedAnswers, timeTaken: overallTimeElapsed }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAiReview(data.review);
        setAiScore(data.score);
        setQuestionReviews(data.question_reviews || []);
        return data.score as number;
      } else if (data.quota_exceeded) {
        setQuotaExceeded(true);
      } else {
        setReviewError(data.error || "Could not get AI review.");
      }
    } catch {
      setReviewError("Failed to connect to AI review service.");
    } finally {
      setReviewLoading(false);
    }
    return 0;
  };

  // ── Submit result ──────────────────────────────────────────────────────────
  const submitResult = async () => {
    try {
      setSubmitting(true);
      setStage("results"); // Update view immediately to show submitting state
      
      const formattedAnswers = questions.map((q) => ({
        question_id: q.question_id,
        question: q.question,
        answer: answers[q.question_id] || "",
        expectation: q.expectation
      }));

      let aiCalculatedScore = 0;
      if (questions.length > 0) {
        aiCalculatedScore = await fetchAiReview(formattedAnswers) || 0;
      }

      await apiClient.post("/piquestions/result", {
        testName: "PI",
        score: aiCalculatedScore,
        timeTaken: overallTimeElapsed,
        dateTaken: new Date().toISOString(),
      });
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to submit result");
    } finally {
      setSubmitting(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const progressPct = ((currentIndex) / (questions.length || 1)) * 100;
  const answeredCount = Object.keys(answers).length;
  const currentAnswer = currentQuestion ? (answers[currentQuestion.question_id] || "") : "";
  const wordCount = currentAnswer.trim() === "" ? 0 : currentAnswer.trim().split(/\s+/).length;

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
        <p className="text-sm font-semibold" style={{ color: B.textMuted }}>Loading Interview Questions…</p>
      </div>
    </Centered>
  );

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <>
      <div className="sticky top-0 z-40 px-4 py-3"
        style={{ background: `linear-gradient(135deg,${B.navyDeep},${B.navy})`, boxShadow: '0 4px 20px rgba(10,42,85,0.35)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black tracking-widest uppercase" style={{ color: 'rgba(190,227,248,0.65)' }}>Evaluation Module</p>
            <h1 className="text-lg font-black text-white leading-tight">PI</h1>
          </div>

          <div className="hidden sm:flex flex-col items-center gap-1 flex-1 max-w-xs">
            <div className="flex justify-between w-full text-xs font-bold" style={{ color: 'rgba(190,227,248,0.70)' }}>
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>{Math.round(progressPct)}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%`, background: '#4ADE80' }} />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right mr-2">
              <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'rgba(190,227,248,0.6)' }}>Total Elapsed</p>
              <p className="text-sm font-black text-white">{fmtTime(overallTimeElapsed)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen px-4 py-6" style={{ background: `linear-gradient(160deg,${B.iceBlue},${B.iceMid},#c8e8f8)` }}>
        {(stage === "review" || stage === "results") ? (
          <div className="max-w-7xl mx-auto space-y-5">
            {/* Hero score card */}
            <div className="rounded-2xl p-8 relative overflow-hidden text-center"
              style={{ background: `linear-gradient(135deg,${B.navyDeep},${B.navy})`, boxShadow: '0 12px 40px rgba(18,77,150,0.28)' }}>
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: 'rgba(37,99,235,0.18)', filter: 'blur(30px)' }} />
              <p className="text-xs font-black tracking-widest uppercase mb-2" style={{ color: 'rgba(190,227,248,0.65)' }}>PI</p>
              
              {stage === "results" ? (
                <>
                  <div className="py-4">
                    {aiScore !== null ? (
                      <>
                        <p className="text-6xl font-black text-white mb-1">{aiScore}<span className="text-3xl opacity-50">/10</span></p>
                        <p className="text-base font-bold mb-3" style={{ color: 'rgba(190,227,248,0.80)' }}>AI Score</p>
                      </>
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                          style={{ background: 'rgba(74,222,128,0.20)', border: '2px solid rgba(74,222,128,0.40)' }}>
                          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                        <h2 className="text-2xl font-black text-white mb-1">Interview Completed!</h2>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="py-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ background: 'rgba(255,255,255,0.20)', border: '2px solid rgba(255,255,255,0.40)' }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                  </div>
                  <h2 className="text-2xl font-black text-white mb-1">Preview Responses</h2>
                </div>
              )}

              <p className="text-sm font-medium" style={{ color: 'rgba(190,227,248,0.70)' }}>
                Total Time: <span className="text-white font-black">{fmtTime(overallTimeElapsed)}</span>
                <span className="mx-3 opacity-30">|</span>
                Questions Answered: <span className="text-white font-black">{answeredCount} / {questions.length}</span>
              </p>
            </div>

            {stage === "review" && (
              <div className="flex flex-col sm:flex-row gap-4 pt-2 pb-2">
                <button onClick={() => setStage("questions")} className="flex-1 py-4 px-8 rounded-xl bg-white border border-slate-300 text-slate-700 font-black text-sm transition-all hover:bg-slate-50 active:scale-95 group flex items-center justify-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                  Edit Responses
                </button>
                <button onClick={submitResult} disabled={submitting} className="flex-[1.5] py-4 px-8 rounded-xl text-white font-black text-sm shadow-xl hover:opacity-90 disabled:opacity-50 transition-all active:scale-95 group flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(90deg,${B.navyDark},${B.navy})`, boxShadow: '0 6px 20px rgba(18,77,150,0.25)' }}>
                  {submitting ? "Submitting..." : "Submit to AI Review"}
                  {!submitting && <svg className="transition-transform group-hover:translate-x-1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>}
                </button>
              </div>
            )}

            {/* AI Review Card (Only in Result Stage) */}
            {stage === "results" && (
              <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(245,158,11,0.22)' }}>
                <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid rgba(18,77,150,0.08)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(245,158,11,0.12)', border: '1.5px solid rgba(245,158,11,0.30)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 8v4l3 3"/><path d="M18 2l4 4-4 4"/><path d="M22 2l-4 4"/></svg>
                  </div>
                  <h3 className="font-extrabold" style={{ color: B.textDark }}>
                    {reviewLoading ? "AI is Reviewing Interview..." : "Psychological Assessment"}
                  </h3>

                  {aiScore !== null && (
                    <span className="ml-auto px-3 py-1 rounded-full text-sm font-black"
                      style={{
                        background: aiScore >= 7 ? 'rgba(5,150,105,0.12)' : aiScore >= 4 ? 'rgba(217,119,6,0.12)' : 'rgba(220,38,38,0.12)',
                        color: aiScore >= 7 ? '#059669' : aiScore >= 4 ? '#D97706' : '#DC2626',
                        border: `1.5px solid ${aiScore >= 7 ? 'rgba(5,150,105,0.30)' : aiScore >= 4 ? 'rgba(217,119,6,0.30)' : 'rgba(220,38,38,0.30)'}`
                      }}>
                      ⭐ {aiScore} / 10
                    </span>
                  )}
                </div>

                {reviewLoading && (
                  <div className="rounded-xl px-5 py-4 flex flex-col gap-2 mb-2" style={{ background: 'linear-gradient(135deg, rgba(217,119,6,0.06), rgba(217,119,6,0.02))', border: '1.5px dashed rgba(217,119,6,0.40)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 rounded-full animate-spin shrink-0" style={{ borderColor: 'rgba(217,119,6,0.20)', borderTopColor: '#D97706' }} />
                      <p className="text-sm font-black text-[#D97706]">Analysing your interview with AI…</p>
                    </div>
                  </div>
                )}

                {quotaExceeded && !reviewLoading && (
                  <div className="rounded-xl px-5 py-4 flex items-start gap-4" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(18,77,150,0.04))', border: '1.5px dashed rgba(37,99,235,0.25)' }}>
                    <div>
                      <p className="text-sm font-black mb-1" style={{ color: B.navy }}>AI Review Capacity Reached</p>
                      <p className="text-xs font-medium leading-relaxed" style={{ color: B.textMuted }}>Our AI quota exceeded. Responses saved.</p>
                    </div>
                  </div>
                )}

                {reviewError && !reviewLoading && !quotaExceeded && (
                  <div className="rounded-xl p-4 text-sm font-medium" style={{ background: 'rgba(220,38,38,0.06)', border: '1.5px solid rgba(220,38,38,0.18)', color: '#DC2626' }}>{reviewError}</div>
                )}

                {aiReview && !reviewLoading && (
                  <div className="rounded-xl p-4 text-sm leading-relaxed" style={{ background: 'rgba(245,158,11,0.04)', border: '1.5px solid rgba(245,158,11,0.18)', color: B.textDark, whiteSpace: 'pre-wrap' }}>
                    {aiReview}
                  </div>
                )}
              </div>
            )}

            {/* Per-question review */}
            <div className="space-y-5">
              {questions.map((q, idx) => {
                const isAnswered = answers[q.question_id]?.trim().length > 0;
                const specificReview = questionReviews.find(r => r.question_id === q.question_id)?.review;
                return (
                  <div key={idx} className="rounded-2xl p-6"
                    style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(18,77,150,0.13)' }}>
                    <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: '1px solid rgba(18,77,150,0.08)' }}>
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                        style={{ background: B.navy }}>{idx + 1}</span>
                      <h3 className="font-extrabold text-sm md:text-base" style={{ color: B.textDark }}>{q.question}</h3>
                      {specificReview && (
                        <span className="ml-auto text-xs font-bold px-2 py-1 rounded-lg" style={{ background: 'rgba(139,92,246,0.08)', color: '#8B5CF6' }}>
                          AI Note ✓
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="text-xs font-black uppercase mb-2 tracking-widest" style={{ color: B.textLight }}>Your Answer</p>
                        <div className="rounded-xl p-4 text-sm leading-relaxed" style={{ background: 'rgba(18,77,150,0.04)', border: '1px solid rgba(18,77,150,0.15)', color: B.textDark, whiteSpace: 'pre-wrap' }}>
                          {answers[q.question_id] || <span className="italic text-gray-400">No answer provided.</span>}
                        </div>
                      </div>

                      {specificReview && (
                        <div className="rounded-xl p-3 flex items-start gap-2" style={{ background: 'rgba(139,92,246,0.05)', border: '1.5px solid rgba(139,92,246,0.18)' }}>
                          <span className="text-[#8B5CF6] mt-0.5 shrink-0">💡</span>
                          <p className="text-sm font-medium leading-relaxed" style={{ color: B.textDark }}>{specificReview}</p>
                        </div>
                      )}

                      {(stage === "review" || stage === "results") && (
                        <div>
                          <p className="text-xs font-black uppercase mb-2 tracking-widest text-emerald-600">Expected Guidance</p>
                          <div className="rounded-xl p-4 text-sm leading-relaxed" style={{ background: 'rgba(5,150,105,0.05)', border: '1px solid rgba(5,150,105,0.2)', color: B.textDark }}>
                            {q.expectation}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {stage === "review" && (
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button onClick={() => setStage("questions")} className="flex-1 py-4 px-8 rounded-xl bg-white border border-slate-300 text-slate-700 font-black text-sm transition-all hover:bg-slate-50 active:scale-95 group flex items-center justify-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                  Edit Responses
                </button>
                <button onClick={submitResult} disabled={submitting} className="flex-[1.5] py-4 px-8 rounded-xl text-white font-black text-sm shadow-xl hover:opacity-90 disabled:opacity-50 transition-all active:scale-95 group flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(90deg,${B.navyDark},${B.navy})`, boxShadow: '0 6px 20px rgba(18,77,150,0.25)' }}>
                  {submitting ? "Submitting..." : "Submit to AI Review"}
                  {!submitting && <svg className="transition-transform group-hover:translate-x-1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>}
                </button>
              </div>
            )}
            
            {stage === "results" && !reviewLoading && (
              <button
                onClick={() => router.push("/alltest")}
                className="w-full py-4 px-8 rounded-xl bg-slate-100/50 text-slate-600 font-bold text-sm transition-all hover:bg-slate-200 active:scale-95 text-center mt-4 border"
              >
                Back to All Tests
              </button>
            )}
          </div>
        ) : (
          /* ── Flex + Sidebar Layout for Active Test phase ── */
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-5">
            {/* Main content */}
            <div className="flex-1 min-w-0 space-y-5">
              <div className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(14px)', border: '1.5px solid rgba(18,77,150,0.13)', boxShadow: '0 4px 20px rgba(18,77,150,0.09)' }}>

                <div className="px-6 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2" style={{ borderBottom: '1px solid rgba(18,77,150,0.08)' }}>
                  <div>
                    <span className="text-xs font-black tracking-widest uppercase px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(18,77,150,0.08)', color: B.navy }}>
                      Question Response
                    </span>
                  </div>
                  <p className="text-xs font-bold" style={{ color: B.textLight }}>Question {currentIndex + 1} / {questions.length}</p>
                </div>

                <div className="p-6">
                  <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight leading-relaxed mb-6">
                    {currentQuestion?.question}
                  </h2>
                  
                  <div className="space-y-4">
                    <textarea value={currentAnswer} onChange={e => handleAnswerChange(e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full h-80 px-5 py-4 rounded-xl resize-none text-sm leading-relaxed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 border-2"
                      style={{ background: 'rgba(237,249,255,0.70)', borderColor: 'rgba(18,77,150,0.14)', color: B.textDark, fontFamily: 'inherit' }} />

                    <div className="pt-4 mt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                        <h3 className="text-xs font-black tracking-widest uppercase text-emerald-600">Expected Guidance</h3>
                      </div>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100">
                        <p className="text-slate-700 font-medium text-sm leading-relaxed">{currentQuestion?.expectation}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="flex gap-4 text-xs font-semibold" style={{ color: B.textMuted }}>
                        <span>{wordCount} <span style={{ color: B.textLight }}>words</span></span>
                        <span>{currentAnswer.length} <span style={{ color: B.textLight }}>chars</span></span>
                      </div>
                      <button onClick={goToNext}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm text-white transition-all hover:opacity-90 active:scale-95 shadow-lg"
                        style={{ background: `linear-gradient(90deg,${B.navyDark},${B.navy})`, boxShadow: '0 4px 14px rgba(18,77,150,0.25)' }}>
                        {currentIndex + 1 === questions.length ? "Finish & Preview" : "Next Question"}
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-64 shrink-0 flex flex-col gap-4">
              <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(18,77,150,0.12)' }}>
                <p className="text-xs font-black tracking-widest uppercase mb-4" style={{ color: B.textLight }}>Question Progress</p>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                    <span>Answered</span>
                    <span>{answeredCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
                    <span>Remaining</span>
                    <span>{questions.length - answeredCount}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(18,77,150,0.12)' }}>
                <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: B.textLight }}>Navigation Matrix</p>
                <div className="grid grid-cols-4 gap-2">
                  {questions.map((q, i) => {
                    const active = i === currentIndex;
                    const done = answers[q.question_id]?.trim().length > 0;
                    return (
                      <button key={i} onClick={() => setCurrentIndex(i)}
                        className={`aspect-square rounded-lg flex items-center justify-center text-xs font-black transition-all ${
                          active 
                            ? 'bg-slate-900 text-white shadow-md scale-110' 
                            : done 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={goToPrevious} disabled={currentIndex === 0}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:bg-white bg-white/50 border disabled:opacity-30"
                  style={{ color: B.textMid, borderColor: 'rgba(18,77,150,0.15)' }}>
                  ← Previous
                </button>
                <button onClick={stopTest}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:bg-emerald-50 group"
                  style={{ color: '#059669', background: 'rgba(5,150,105,0.05)', border: '1.5px solid rgba(5,150,105,0.15)' }}>
                  Finish & Preview <span className="group-hover:translate-x-1 inline-block transition-transform">→</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
