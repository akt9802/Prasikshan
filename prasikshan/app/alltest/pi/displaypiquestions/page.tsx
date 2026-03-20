"use client";

import { useEffect, useRef, useState } from "react";
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

export default function DisplayPiQuestion() {
  const router = useRouter();
  const [stage, setStage] = useState<"loading" | "questions" | "review">("loading");
  const [questions, setQuestions] = useState<PiQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/api/piquestions");
        if (!response.ok) throw new Error("Failed to fetch questions");
        const data = await response.json();
        setQuestions(data.data);
        setStartTime(Date.now());
        setStage("questions");
      } catch (error) {
        setError("Failed to load questions. Please try again.");
        console.error(error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const questionId = questions[currentIndex].question_id;
    setAnswers({
      ...answers,
      [questionId]: e.target.value,
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFinish = () => {
    setStage("review");
  };

  const submitResult = async () => {
    if (!token) {
      setError("Authentication required");
      return;
    }

    try {
      setSubmitting(true);
      const timeTaken = Math.round((Date.now() - startTime) / 1000);
      const dateTaken = new Date().toISOString();

      const response = await fetch("/api/piquestions/result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questions: questions.map(q => ({ id: q.question_id, text: q.question })),
          answers,
          timeTaken,
          dateTaken,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit result");
      router.push("/alltest");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to submit result");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (stage === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: `linear-gradient(160deg,${B.iceBlue},${B.iceMid})` }}>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-10 text-center border border-white">
          <div className="w-12 h-12 border-4 rounded-full animate-spin border-[#124D9622] border-t-[#124D96] mx-auto mb-6"></div>
          <p className="text-lg font-black tracking-tight" style={{ color: B.textDark }}>Loading Interview Questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: `linear-gradient(160deg,${B.iceBlue},${B.iceMid})` }}>
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-10 text-center max-w-md border border-rose-100">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-100">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={B.rose} strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          </div>
          <h2 className="text-2xl font-black mb-4" style={{ color: B.rose }}>Access Denied</h2>
          <p className="text-slate-600 font-medium mb-8 leading-relaxed">{error}</p>
          <button
            onClick={() => router.push("/alltest")}
            className="w-full px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-xl active:scale-95"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (stage === "review") {
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const completedPct = Math.round((Object.keys(answers).length / questions.length) * 100);

    return (
      <div className="min-h-screen flex flex-col pt-10 pb-16 px-4" style={{ background: `linear-gradient(160deg,${B.iceBlue} 0%,${B.iceMid} 100%)` }}>
        <div className="max-w-4xl mx-auto w-full">
          {/* Score Hero */}
          <div className="rounded-[2.5rem] p-10 relative overflow-hidden mb-8 shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${B.navyDark}, ${B.navyDeep})` }}>
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M100 0 L0 100 L100 100 Z" fill="white" /></svg>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <span className="inline-block px-3 py-1 bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300 mb-4">Post-Interview Review</span>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">Interview <span className="text-cyan-400">Analysis</span></h1>
                <p className="text-slate-300 font-medium max-w-sm">Review your responses and compare with the expected guidance.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/20 text-center min-w-[180px]">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#BEE3F8] mb-1">Completion Rate</p>
                <div className="text-6xl font-black text-white">{completedPct}<span className="text-2xl opacity-40">%</span></div>
                <div className="mt-2 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 transition-all duration-1000" style={{ width: `${completedPct}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Time', val: formatTime(timeTaken), color: B.blueMid, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
              { label: 'Total Questions', val: questions.length, color: B.navy, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /></svg> },
              { label: 'Answered', val: Object.keys(answers).length, color: B.emerald, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg> },
              { label: 'Pending', val: questions.length - Object.keys(answers).length, color: B.amber, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg> }
            ].map((stat, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white shadow-lg">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-md" style={{ background: `${stat.color}15`, color: stat.color }}>
                  {stat.icon}
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                <p className="text-lg font-black text-slate-800 line-clamp-1">{stat.val}</p>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <h2 className="text-xl font-black text-slate-900 mb-2 pl-2">Your Responses</h2>
            {questions.map((q, idx) => (
              <div key={q.question_id} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    Q{idx + 1}/{questions.length}
                  </span>
                  <h3 className="text-lg font-black text-slate-900">{q.question}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Your Answer */}
                  <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 min-h-[120px]">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Your Answer</p>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {answers[q.question_id] || <span className="italic text-slate-400">No answer provided.</span>}
                    </p>
                  </div>
                  
                  {/* Expected Answer */}
                  <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 min-h-[120px]">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3">Expected Guidance</p>
                    <p className="text-slate-700 leading-relaxed font-medium">{q.expectation}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button onClick={() => setStage("questions")} className="flex-1 py-4 px-8 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 font-black text-sm transition-all hover:bg-slate-50 active:scale-95 group flex items-center justify-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                Edit Responses
              </button>
              <button onClick={submitResult} disabled={submitting} className="flex-[0.8] py-4 px-8 rounded-2xl bg-emerald-600 text-white font-black text-sm shadow-xl hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-95 group flex items-center justify-center gap-2">
                {submitting ? "Deploying Data..." : "Commit Results"}
                {!submitting && <svg className="transition-transform group-hover:translate-x-1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>}
              </button>
            </div>
            
            <button
              onClick={() => router.push("/alltest")}
              className="w-full py-4 px-8 rounded-2xl bg-slate-100 text-slate-600 font-black text-sm transition-all hover:bg-slate-200 active:scale-95 text-center mt-2"
            >
              Back to Tests
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  // Calculate time elapsed
  const timeElapsed = Math.round((Date.now() - startTime) / 1000);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/40 shadow-sm" style={{ background: `linear-gradient(135deg, ${B.navyDark}CC, ${B.navyDeep}CC)` }}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 bg-white/10 text-white rounded-xl transition-colors hover:bg-white/20"
              >
                {sidebarOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 block mb-0.5">Evaluation Module</span>
                <h1 className="text-xl md:text-2xl font-black text-white leading-none">Personal Interview</h1>
              </div>
            </div>

            <div className="flex items-center gap-6 text-white">
              <div className="hidden sm:block text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#BEE3F8] mb-1">Session Progress</p>
                <p className="text-2xl font-black tabular-nums leading-none tracking-tighter">{currentIndex + 1}/{questions.length}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/10 border border-white/20 shadow-inner">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M14 2H6a2 2 0 0 0-2 2v16h16v-8" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><circle cx="12" cy="13" r="2" /></svg>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white/70 backdrop-blur-2xl border-r border-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="h-full pt-20 lg:pt-8 p-6 space-y-6 overflow-y-auto">
              {/* Progress Bento */}
              <div className="rounded-3xl p-6 shadow-xl border border-white" style={{ background: `linear-gradient(135deg, ${B.iceBlue}, ${B.iceMid})` }}>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Completion Target</p>
                <div className="mb-6">
                  <p className="text-4xl font-black tracking-tighter text-[#124D96]">
                    {Math.round(((currentIndex + 1) / questions.length) * 100)}%
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Session Active</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/40">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-black uppercase text-slate-400">Answered</span>
                    <span className="text-xs font-black text-slate-900">{answeredCount}/{questions.length}</span>
                  </div>
                  <div className="h-2 w-full bg-white/40 rounded-full overflow-hidden">
                    <div className="h-full bg-[#124D96] transition-all duration-1000" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Status Card */}
              <div className="rounded-3xl p-6 bg-white/40 border border-white shadow-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Tracker Status</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 shadow-sm">
                    <span className="text-xs font-bold text-slate-500">Answered</span>
                    <span className="text-lg font-black text-emerald-600">{answeredCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-2xl bg-amber-50/50 border border-amber-100 shadow-sm">
                    <span className="text-xs font-bold text-slate-500">Remaining</span>
                    <span className="text-lg font-black text-amber-600">{questions.length - answeredCount}</span>
                  </div>
                </div>
              </div>

              {/* Navigator */}
              <div className="rounded-3xl p-6 bg-white/40 border border-white shadow-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Question Matrix</p>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {questions.map((q, idx) => {
                    const isCurrent = idx === currentIndex;
                    const isAnswered = answers[q.question_id];
                    let btnClass = "aspect-square rounded-xl text-xs font-black transition-all flex items-center justify-center shadow-sm";
                    
                    if (isCurrent) {
                      btnClass += " bg-slate-900 text-white shadow-md scale-110";
                    } else if (isAnswered) {
                      btnClass += " bg-emerald-500 text-white";
                    } else {
                      btnClass += " bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300";
                    }
                    
                    return (
                      <button
                        key={q.question_id}
                        onClick={() => setCurrentIndex(idx)}
                        className={btnClass}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Control Deck */}
              <div className="pt-2">
                <button
                  onClick={handleFinish}
                  className="w-full px-6 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black text-sm rounded-2xl shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 overflow-hidden relative group"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                  Execute Submission
                </button>
              </div>
            </div>
          </aside>

          {/* Main Workspace */}
          <main className="flex-1 overflow-y-auto relative z-10 px-6 py-8">
            <div className="max-w-4xl mx-auto space-y-8 pb-12">

              {/* Challenge Card */}
              <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-white">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-100">
                  <div className="w-full flex-1">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                      Question {currentIndex + 1} of {questions.length}
                    </span>
                    <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl">
                      {currentQuestion?.question || "Loading Question..."}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-col gap-10">
                  {/* Response Port */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Response Capture Engine</label>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                        {((answers[currentQuestion?.question_id] || "").length).toLocaleString()} Chars
                      </span>
                    </div>
                    <div className="relative group">
                      <textarea
                        value={answers[currentQuestion?.question_id] || ""}
                        onChange={handleAnswerChange}
                        placeholder="Establish your response here. Articulate clearly and concisely..."
                        className="w-full min-h-[240px] p-6 rounded-3xl bg-slate-50/80 border-2 border-slate-200 focus:border-[#124D96] focus:bg-white focus:ring-4 focus:ring-[#124D96]/10 outline-none resize-y text-slate-800 font-medium leading-relaxed transition-all shadow-inner"
                      />
                      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none text-[#124D96]">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </div>
                    </div>
                  </div>

                  {/* Expected Guidance Overlay */}
                  <div className="pt-8 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="w-6 h-[2px] bg-emerald-500 rounded-full" />
                      <h3 className="text-[10px] font-black tracking-widest uppercase text-slate-400">Expected Vector Guidelines</h3>
                    </div>
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                      </div>
                      <p className="text-slate-800 font-bold leading-relaxed relative z-10">{currentQuestion?.expectation}</p>
                    </div>
                  </div>

                  {/* Action Nav */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
                    <button
                      onClick={handlePrevious}
                      disabled={currentIndex === 0}
                      className="flex-1 py-4 px-8 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-black text-sm transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none group flex items-center justify-center gap-2"
                    >
                      <svg className="transition-transform group-hover:-translate-x-1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                      Previous Vector
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={currentIndex === questions.length - 1}
                      className="flex-[1.5] py-4 px-8 rounded-2xl bg-slate-900 text-white font-black text-sm shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none group flex items-center justify-center gap-2"
                    >
                      Next Vector
                      <svg className="transition-transform group-hover:translate-x-1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
