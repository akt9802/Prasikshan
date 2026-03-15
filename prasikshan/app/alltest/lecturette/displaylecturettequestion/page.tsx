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

interface LecturetteQuestion {
  _id: string;
  topic_id: number;
  topic: string;
  speech: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  language: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export default function DisplayLecturetteQuestion() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const [stage, setStage] = useState<"loading" | "showTopic" | "showSpeech">("loading");
  const [question, setQuestion] = useState<LecturetteQuestion | null>(null);
  const [preparationTimeLeft, setPreparationTimeLeft] = useState(180);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [firstTranscript, setFirstTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [suggestion, setSuggestion] = useState("");
  const [prepStarted, setPrepStarted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch question on mount
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch("/api/lecturettequestions");
        if (!response.ok) throw new Error("Failed to fetch question");
        const data = await response.json();
        setQuestion(data.data);
        setStage("showTopic");
      } catch (error) {
        setError("Failed to load question. Please try again.");
        console.error(error);
      }
    };

    fetchQuestion();
  }, []);

  // Initialize media and speech recognition
  useEffect(() => {
    if (stage !== "showTopic") return;

    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.language = "en-US";

          let hasFirstTranscript = false;

          recognition.onstart = () => {
            setIsRecording(true);
          };

          recognition.onresult = (event: SpeechRecognitionEvent) => {
            for (let i = event.results.length - 1; i >= 0; i--) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                if (!hasFirstTranscript) {
                  setFirstTranscript(transcript);
                  hasFirstTranscript = true;
                }
              }
            }
            setLiveTranscript((prev) =>
              prev + " " + (event.results[event.results.length - 1][0].transcript || "")
            );
          };

          recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error("Speech recognition error:", event.error);
          };

          recognition.onend = () => {
            setIsRecording(false);
            if (stage === "showTopic" && prepStarted) {
              recognition.start();
            }
          };

          recognitionRef.current = recognition;
        }
      } catch (error: any) {
        setError(
          error instanceof Error ? error.message : "Failed to access camera/microphone"
        );
      }
    };

    initializeMedia();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stage, prepStarted]);

  // Preparation timer
  useEffect(() => {
    if (stage !== "showTopic" || !prepStarted || preparationTimeLeft <= 0) return;

    const timer = setInterval(() => {
      setPreparationTimeLeft((prev) => {
        if (prev <= 1) {
          setStage("showSpeech");
          recognitionRef.current?.stop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, prepStarted, preparationTimeLeft]);

  const startPreparation = () => {
    setPrepStarted(true);
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const resetPreparation = () => {
    setPrepStarted(false);
    setPreparationTimeLeft(180);
    setLiveTranscript("");
    setFirstTranscript("");
    setScore(null);
    setSuggestion("");
    recognitionRef.current?.abort();
  };

  const stopAndProceed = () => {
    setStage("showSpeech");
    recognitionRef.current?.stop();
  };

  const calculateScore = (): void => {
    const text = firstTranscript || liveTranscript;
    if (!text.trim()) {
      setScore(1);
      return;
    }

    const words = text.trim().split(/\s+/);
    const wordCount = words.length;
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / wordCount;
    const fillerWords = ["um", "uh", "like", "you know", "so", "basically", "actually"];
    const fillerCount = words.filter((word) =>
      fillerWords.some((filler) => word.toLowerCase().includes(filler))
    ).length;

    let baseScore = 50;
    baseScore += Math.min(wordCount / 10, 25);
    baseScore += Math.min(avgWordLength / 5, 10);
    baseScore -= Math.min(fillerCount * 7, 20);

    let finalScore = (baseScore / 100) * 10;
    finalScore = Math.max(1, Math.min(10, finalScore));

    setScore(Math.round(finalScore * 10) / 10);
  };

  const generateSuggestion = (): void => {
    const text = firstTranscript || liveTranscript;
    if (!text.trim()) {
      setSuggestion("Please speak something to get suggestions.");
      return;
    }

    const words = text.trim().split(/\s+/);
    const suggestions: string[] = [];

    if (words.length < 20) {
      suggestions.push("Increase depth. Structure: Context → 3 Key Points → Future Impact.");
    }
    if (words.length < 50) {
      suggestions.push("Inject specific examples to bolster your arguments.");
    }

    suggestions.push("Eliminate hesitation and fillers for an 'Officer Like' clarity.");
    suggestions.push("Maintain rhythmic pacing and confident articulation.");

    setSuggestion(suggestions.join(" | "));
  };

  const submitResult = async () => {
    if (!token || !question) {
      setError("Authentication required");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/lecturettequestions/result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic: question.topic,
          transcript: firstTranscript || liveTranscript,
          score: score || 0,
          duration: 180 - preparationTimeLeft,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit result");
      router.push("/alltest");
    } catch (error: any) {
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
          <p className="text-lg font-black tracking-tight" style={{ color: B.textDark }}>Calibrating Test Parameters...</p>
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

  if (stage === "showSpeech" && question) {
    const wordCount = (firstTranscript || liveTranscript).split(/\s+/).filter(w => w).length;
    const finalPct = score ? (score / 10) * 100 : 0;

    return (
      <>
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
                  <span className="inline-block px-3 py-1 bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300 mb-4">Post-Assessment Review</span>
                  <h1 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">Lecturette <span className="text-cyan-400">Analysis</span></h1>
                  <p className="text-slate-300 font-medium max-w-sm">Detailed feedback regarding your speech articulation, content depth, and delivery metrics.</p>
                </div>

                {score !== null && (
                  <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/20 text-center min-w-[180px]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#BEE3F8] mb-1">Efficiency Rating</p>
                    <div className="text-6xl font-black text-white">{score}<span className="text-2xl opacity-40">/10</span></div>
                    <div className="mt-2 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 transition-all duration-1000" style={{ width: `${finalPct}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Primary Topic', val: question.topic, color: B.navy, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg> },
                { label: 'Time Elapsed', val: formatTime(180 - preparationTimeLeft), color: B.blueMid, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
                { label: 'Articulation Volume', val: `${wordCount} Words`, color: B.emerald, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg> }
              ].map((stat, i) => (
                <div key={i} className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white shadow-lg">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-md" style={{ background: `${stat.color}15`, color: stat.color }}>
                    {stat.icon}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                  <p className="text-lg font-black text-slate-800 line-clamp-2">{stat.val}</p>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              {/* Recorded Speech */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                  </div>
                  <h3 className="text-base font-black uppercase tracking-wider text-slate-900">Transcript Capture</h3>
                </div>
                <div className="relative p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 min-h-[120px]">
                  <p className="text-slate-700 leading-relaxed font-medium italic">
                    {firstTranscript || liveTranscript || "System detection: No significant audio input detected."}
                  </p>
                </div>
              </div>

              {/* Suggestions */}
              {suggestion && (
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9.663 17h4.674a1 1 0 0 0 .722-.31l3.39-3.39a1 1 0 0 0 .251-.71V5a1 1 0 0 0-1-1H4.3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h5.363Z" /></svg>
                    </div>
                    <h3 className="text-base font-black uppercase tracking-wider text-slate-900">Strategic Enhancements</h3>
                  </div>
                  <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-100">
                    <p className="text-slate-700 font-bold leading-relaxed">{suggestion}</p>
                  </div>
                </div>
              )}

              {/* Reference */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                    </div>
                    <h3 className="text-base font-black uppercase tracking-wider text-slate-900">Standard Solution</h3>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <p className="text-slate-700 leading-relaxed font-semibold">{question.speech}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button onClick={calculateScore} className="flex-1 py-4 px-8 rounded-2xl bg-slate-900 text-white font-black text-sm shadow-xl hover:bg-black transition-all active:scale-95 group">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="transition-transform group-hover:rotate-12" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l.3-.3a2 a2 0 0 0 0-2.8l-.3-.3a2 2 0 0 0-2.8 0l-.2.2Z" /><path d="m3.5 20.5 5.5-5.5" /><path d="M15.3 12.3 12.3 15.3l-3-3 3-3 3 3Z" /></svg>
                    {score !== null ? "Re-evaluate Performance" : "Finalize Analytics"}
                  </div>
                </button>
                <button onClick={generateSuggestion} className="flex-1 py-4 px-8 rounded-2xl bg-white border-2 border-slate-900 text-slate-900 font-black text-sm transition-all hover:bg-slate-50 active:scale-95">
                  Consult Strategic Tips
                </button>
                <button onClick={submitResult} disabled={submitting} className="flex-[0.8] py-4 px-8 rounded-2xl bg-emerald-600 text-white font-black text-sm shadow-xl hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-95">
                  {submitting ? "Deploying Data..." : "Commit Results"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

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
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 block mb-0.5">Communication Module</span>
                <h1 className="text-xl md:text-2xl font-black text-white leading-none">Lecturette <span className="text-cyan-400">Terminal</span></h1>
              </div>
            </div>

            <div className={`flex items-center gap-6 ${preparationTimeLeft <= 30 ? "text-rose-400" : "text-white"}`}>
              <div className="hidden sm:block text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#BEE3F8] mb-1">Session Clock</p>
                <p className="text-2xl font-black tabular-nums leading-none tracking-tighter">{formatTime(preparationTimeLeft)}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/10 border border-white/20 shadow-inner">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white/70 backdrop-blur-2xl border-r border-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="h-full pt-20 lg:pt-8 p-6 space-y-6 overflow-y-auto">
              {/* Status Bento */}
              <div className="rounded-3xl p-6 shadow-xl border border-white" style={{ background: `linear-gradient(135deg, ${B.iceBlue}, ${B.iceMid})` }}>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Execution Unit</p>
                <div className="mb-6">
                  <p className={`text-4xl font-black tracking-tighter ${prepStarted ? "text-[#124D96]" : "text-slate-400"}`}>
                    {prepStarted ? "ACTIVE" : "IDLE"}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-2 h-2 rounded-full ${prepStarted ? 'bg-cyan-500 animate-pulse' : 'bg-slate-300'}`} />
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{prepStarted ? "Telemetry Live" : "Awaiting Command"}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/40">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-black uppercase text-slate-400">Buffering</span>
                    <span className="text-xs font-black text-slate-900">{Math.round((preparationTimeLeft / 180) * 100)}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/40 rounded-full overflow-hidden">
                    <div className="h-full bg-[#124D96] transition-all duration-1000" style={{ width: `${(preparationTimeLeft / 180) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="rounded-3xl p-6 bg-white/40 border border-white shadow-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Linguistic Stats</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-2xl bg-white/50 border border-white shadow-sm">
                    <span className="text-xs font-bold text-slate-500">Lexical Count</span>
                    <span className="text-lg font-black text-slate-900">{liveTranscript.split(/\s+/).filter(w => w).length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-2xl bg-white/50 border border-white shadow-sm">
                    <span className="text-xs font-bold text-slate-500">Char Density</span>
                    <span className="text-lg font-black text-slate-900">{liveTranscript.length}</span>
                  </div>
                </div>
              </div>

              {/* Control Deck */}
              <div className="space-y-3 pt-4">
                {!prepStarted ? (
                  <button
                    onClick={startPreparation}
                    className="group w-full px-6 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black text-sm rounded-2xl shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <svg className="transition-transform group-hover:translate-x-1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    Initialize Speech
                  </button>
                ) : (
                  <>
                    <button
                      onClick={resetPreparation}
                      className="w-full px-6 py-4 bg-amber-100 text-amber-700 border-2 border-amber-200 font-black text-sm rounded-2xl transition-all hover:bg-amber-200 active:scale-95"
                    >
                      Restart Calibration
                    </button>
                    <button
                      onClick={stopAndProceed}
                      className="w-full px-6 py-5 bg-rose-600 text-white font-black text-sm rounded-2xl shadow-2xl transition-all hover:bg-rose-700 active:scale-95 flex items-center justify-center gap-3"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></svg>
                      Execute Submission
                    </button>
                  </>
                )}
              </div>
            </div>
          </aside>

          {/* Main Workspace */}
          <main className="flex-1 overflow-y-auto relative z-10 px-6 py-8">
            <div className="max-w-4xl mx-auto space-y-8 pb-12">

              {/* Challenge Card */}
              <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-white">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-100">
                  <div>
                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">Target Objective</span>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight max-w-xl">
                      {question?.topic || "Awaiting Topic Assignment..."}
                    </h2>
                  </div>
                  <div className="shrink-0 flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-slate-400">Sequence</p>
                      <p className="text-xl font-black text-slate-900">#{question?.topic_id || 0}/10</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Visual Port */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Visual Telemetry</label>
                      {isRecording && (
                        <div className="flex items-center gap-2 px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full border border-rose-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                          <span className="text-[9px] font-black uppercase letter-tighter">Recording Live</span>
                        </div>
                      )}
                    </div>
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black aspect-video border-4 border-white group">
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        style={{ transform: "scaleX(-1)" }}
                        className="w-full h-full object-cover transition-opacity duration-500"
                      />
                      {!prepStarted && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8">
                          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white mb-4 animate-bounce">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" /></svg>
                          </div>
                          <h4 className="text-white font-black uppercase tracking-wider text-xs px-6">Input Stream Inactive</h4>
                          <p className="text-white/60 text-[10px] font-bold mt-2">Initialize speech to begin capture</p>
                        </div>
                      )}
                      <div className="absolute top-4 left-4 flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      </div>
                    </div>
                  </div>

                  {/* Recognition Port */}
                  <div className="space-y-4 flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Transcription Engine</label>
                    <div className="flex-1 min-h-[160px] p-6 rounded-3xl bg-slate-100/50 border border-slate-200 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                      </div>
                      <p className={`text-sm leading-relaxed font-bold italic tracking-tight ${liveTranscript ? "text-slate-800" : "text-slate-400"}`}>
                        {liveTranscript || "Awaiting audio signature... System established for live lexical decoding."}
                      </p>
                      <div className="absolute bottom-4 right-6 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-1 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '200ms' }} />
                        <span className="w-1 h-1 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '400ms' }} />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#124D9608] border border-[#124D961A]">
                      <div className="w-8 h-8 rounded-full bg-[#124D9612] flex items-center justify-center text-[#124D96]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                      </div>
                      <p className="text-[10px] font-black text-[#124D96] uppercase tracking-tighter">Secure Communication Channel</p>
                    </div>
                  </div>
                </div>

                {/* Reference Overlay (only during active session) */}
                {prepStarted && (
                  <div className="mt-12 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="w-6 h-[2px] bg-cyan-500 rounded-full" />
                      <h3 className="text-[10px] font-black tracking-widest uppercase text-slate-400">Contextual Reference Library</h3>
                    </div>
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-50/50 to-white border border-indigo-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                      </div>
                      <p className="text-slate-800 font-bold leading-relaxed relative z-10">{question?.speech}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
