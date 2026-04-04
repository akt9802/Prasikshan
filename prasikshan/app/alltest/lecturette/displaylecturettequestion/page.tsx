"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/axios";

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
interface SpeechRecognitionErrorEvent extends Event { error: string; }
interface SpeechRecognitionAlternative { transcript: string; confidence: number; }
interface SpeechRecognitionResult {
  isFinal: boolean; length: number; [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionResultList { [index: number]: SpeechRecognitionResult; length: number; }
interface SpeechRecognition extends EventTarget {
  continuous: boolean; interimResults: boolean; language: string;
  start(): void; stop(): void; abort(): void;
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
  const fullTranscriptRef = useRef<string>("");

  const [stage, setStage] = useState<"loading" | "showTopic" | "showSpeech">("loading");
  const [question, setQuestion] = useState<LecturetteQuestion | null>(null);
  const [preparationTimeLeft, setPreparationTimeLeft] = useState(180);
  const [speechTimeLeft, setSpeechTimeLeft] = useState(180);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [prepStarted, setPrepStarted] = useState(false);
  const [speechStarted, setSpeechStarted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // AI review state
  const [aiReview, setAiReview] = useState<string | null>(null);
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [aiStrengths, setAiStrengths] = useState<string[]>([]);
  const [aiImprovements, setAiImprovements] = useState<string[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);

  // Fetch question on mount
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const { data: data } = await apiClient.get("/lecturettequestions");
        setQuestion(data.data);
        setStage("showTopic");
      } catch (err) {
        setError("Failed to load question. Please try again.");
      }
    };
    fetchQuestion();
  }, []);

  // Initialize camera + speech recognition
  useEffect(() => {
    if (stage !== "showTopic") return;

    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: true });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognitionAPI) {
          const recognition = new SpeechRecognitionAPI();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.language = "en-US";

          recognition.onstart = () => setIsRecording(true);

          recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interim = "";
            for (let i = 0; i < event.results.length; i++) {
              const result = event.results[i];
              if (result.isFinal) {
                fullTranscriptRef.current += " " + result[0].transcript;
              } else {
                interim += result[0].transcript;
              }
            }
            setLiveTranscript(fullTranscriptRef.current + " " + interim);
          };

          recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error("Speech recognition error:", event.error);
          };

          recognition.onend = () => {
            setIsRecording(false);
          };

          recognitionRef.current = recognition;
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to access camera/microphone");
      }
    };

    initializeMedia();

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [stage]);

  // Preparation countdown
  useEffect(() => {
    if (stage !== "showTopic" || !prepStarted || preparationTimeLeft <= 0) return;
    const timer = setInterval(() => {
      setPreparationTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // auto-start speech phase
          startSpeechPhase();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, prepStarted, preparationTimeLeft]);

  // Speech countdown
  useEffect(() => {
    if (!speechStarted || stage !== "showTopic" || speechTimeLeft <= 0) return;
    const timer = setInterval(() => {
      setSpeechTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishSpeech();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechStarted, stage, speechTimeLeft]);

  const startPreparation = () => {
    setPrepStarted(true);
  };

  const startSpeechPhase = () => {
    setSpeechStarted(true);
    recognitionRef.current?.start();
  };

  const finishSpeech = () => {
    recognitionRef.current?.stop();
    const taken = 180 - speechTimeLeft;
    setTimeTaken(taken);
    setStage("showSpeech");
    streamRef.current?.getTracks().forEach(track => track.stop());
  };

  const stopEarly = () => {
    finishSpeech();
  };

  const fetchAiReview = async (transcript: string, topic: string, duration: number) => {
    if (!transcript.trim()) return 0;
    setReviewLoading(true);
    setReviewError(null);
    setQuotaExceeded(false);
    try {
      const res = await fetch("/api/lecturette-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, transcript, durationSeconds: duration }),
      });
      const data = await res.json();
      if (data.success) {
        setAiReview(data.review);
        setAiScore(data.score);
        setAiStrengths(data.strengths || []);
        setAiImprovements(data.improvements || []);
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

  const submitResult = async () => {
    if (!question) return;
    try {
      setSubmitting(true);
      const transcript = fullTranscriptRef.current.trim() || liveTranscript.trim();
      const duration = 180 - speechTimeLeft;

      const aiCalculatedScore = await fetchAiReview(transcript, question.topic, duration);

      await apiClient.post("/lecturettequestions/result", {
        topic: question.topic,
        topic_id: question.topic_id,
        score: aiCalculatedScore,
        duration,
      });
    } catch (err) {
      setReviewError("Failed to save result.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (stage === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: `linear-gradient(160deg,${B.iceBlue},${B.iceMid})` }}>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-10 text-center border border-white">
          <div className="w-12 h-12 border-4 rounded-full animate-spin border-[#124D9622] border-t-[#124D96] mx-auto mb-6"></div>
          <p className="text-lg font-black tracking-tight" style={{ color: B.textDark }}>Loading Lecturette Topic...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: `linear-gradient(160deg,${B.iceBlue},${B.iceMid})` }}>
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-10 text-center max-w-md border border-rose-100">
          <p className="text-2xl font-black mb-4" style={{ color: B.rose }}>Error</p>
          <p className="text-slate-600 font-medium mb-8">{error}</p>
          <button onClick={() => router.push("/alltest")} className="w-full px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all active:scale-95">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────────────
  if (stage === "showSpeech" && question) {
    const transcript = fullTranscriptRef.current.trim() || liveTranscript.trim();
    const wordCount = transcript.split(/\s+/).filter(w => w).length;
    const finalPct = aiScore ? (aiScore / 10) * 100 : 0;
    const mins = Math.floor(timeTaken / 60);
    const secs = timeTaken % 60;

    return (
      <div className="min-h-screen px-4 py-10" style={{ background: `linear-gradient(160deg,${B.iceBlue},${B.iceMid},#c8e8f8)` }}>
        <div className="max-w-7xl mx-auto space-y-5">

          {/* Score Hero */}
          <div className="rounded-2xl p-8 relative overflow-hidden text-center" style={{ background: `linear-gradient(135deg,${B.navyDeep},${B.navy})`, boxShadow: '0 12px 40px rgba(18,77,150,0.28)' }}>
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'rgba(37,99,235,0.18)', filter: 'blur(30px)' }} />
            <p className="text-xs font-black tracking-widest uppercase mb-2" style={{ color: 'rgba(190,227,248,0.65)' }}>Lecturette — Speech Analysis</p>
            {aiScore !== null ? (
              <>
                <p className="text-6xl font-black text-white mb-1">{aiScore}<span className="text-3xl opacity-50">/10</span></p>
                <p className="text-xl font-bold mb-3" style={{ color: 'rgba(190,227,248,0.85)' }}>AI Score</p>
              </>
            ) : (
              <p className="text-2xl font-black text-white mb-3">
                {reviewLoading ? "AI is analysing your speech..." : "Awaiting AI Review"}
              </p>
            )}
            <div className="flex justify-center gap-8 mt-4">
              <div className="text-center">
                <p className="text-xs font-bold" style={{ color: 'rgba(190,227,248,0.65)' }}>Time Spoken</p>
                <p className="text-lg font-black text-white">{mins}m {secs}s</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold" style={{ color: 'rgba(190,227,248,0.65)' }}>Words Spoken</p>
                <p className="text-lg font-black text-white">{wordCount}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold" style={{ color: 'rgba(190,227,248,0.65)' }}>Topic</p>
                <p className="text-lg font-black text-white truncate max-w-[180px]">{question.topic}</p>
              </div>
            </div>
            {aiScore !== null && (
              <div className="mt-4 mx-auto max-w-xs h-2 rounded-full overflow-hidden bg-white/10">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${finalPct}%`, background: '#4ADE80' }} />
              </div>
            )}
          </div>

          {/* Submit Button (triggers AI review + DB save) */}
          {!aiReview && !reviewLoading && !quotaExceeded && !reviewError && (
            <div className="rounded-2xl p-6 text-center" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(18,77,150,0.13)' }}>
              <p className="text-sm font-medium mb-4" style={{ color: B.textMuted }}>
                Your speech has been captured. Click below to get your AI review and save your result.
              </p>
              <button
                onClick={submitResult}
                disabled={submitting}
                className="px-10 py-4 rounded-xl font-black text-white text-base transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                style={{ background: `linear-gradient(90deg,${B.navyDark},${B.navy})`, boxShadow: '0 4px 20px rgba(18,77,150,0.30)' }}
              >
                {submitting ? "Getting AI Review..." : "Get AI Review & Save"}
              </button>
            </div>
          )}

          {/* AI Review Card */}
          {(reviewLoading || aiReview || reviewError || quotaExceeded) && (
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(139,92,246,0.22)' }}>
              <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid rgba(18,77,150,0.08)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(139,92,246,0.12)', border: '1.5px solid rgba(139,92,246,0.30)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /></svg>
                </div>
                <h3 className="font-extrabold" style={{ color: B.textDark }}>
                  {reviewLoading ? "AI is Reviewing your Speech..." : "Speech Assessment"}
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
                <div className="rounded-xl px-5 py-4 flex flex-col gap-2" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(139,92,246,0.02))', border: '1.5px dashed rgba(139,92,246,0.40)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 rounded-full animate-spin shrink-0" style={{ borderColor: 'rgba(139,92,246,0.20)', borderTopColor: '#8B5CF6' }} />
                    <p className="text-sm font-black text-[#8B5CF6]">Analysing your speech with AI…</p>
                  </div>
                  <p className="text-xs font-bold text-[#8B5CF6]/80 pl-8 leading-relaxed">
                    ⚠️ Please wait and do not close this page — your result will not be saved otherwise!
                  </p>
                </div>
              )}

              {quotaExceeded && !reviewLoading && (
                <div className="rounded-xl px-5 py-4 flex items-start gap-4" style={{ background: 'rgba(37,99,235,0.06)', border: '1.5px dashed rgba(37,99,235,0.25)' }}>
                  <p className="text-sm font-black" style={{ color: B.navy }}>AI Review quota exceeded. Please try again later.</p>
                </div>
              )}

              {reviewError && !reviewLoading && !quotaExceeded && (
                <div className="rounded-xl p-4 text-sm font-medium" style={{ background: 'rgba(220,38,38,0.06)', border: '1.5px solid rgba(220,38,38,0.18)', color: '#DC2626' }}>{reviewError}</div>
              )}

              {aiReview && !reviewLoading && (
                <div className="space-y-4">
                  <div className="rounded-xl p-4 text-sm leading-relaxed" style={{ background: 'rgba(139,92,246,0.04)', border: '1.5px solid rgba(139,92,246,0.15)', color: B.textDark, whiteSpace: 'pre-wrap' }}>
                    {aiReview}
                  </div>

                  {aiStrengths.length > 0 && (
                    <div className="rounded-xl p-4" style={{ background: 'rgba(5,150,105,0.05)', border: '1.5px solid rgba(5,150,105,0.18)' }}>
                      <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#059669' }}>✅ Strengths</p>
                      <ul className="space-y-1">
                        {aiStrengths.map((s, i) => (
                          <li key={i} className="text-sm font-medium flex items-start gap-2" style={{ color: B.textDark }}>
                            <span style={{ color: '#059669' }}>•</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiImprovements.length > 0 && (
                    <div className="rounded-xl p-4" style={{ background: 'rgba(245,158,11,0.05)', border: '1.5px solid rgba(245,158,11,0.22)' }}>
                      <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#D97706' }}>💡 Areas to Improve</p>
                      <ul className="space-y-1">
                        {aiImprovements.map((s, i) => (
                          <li key={i} className="text-sm font-medium flex items-start gap-2" style={{ color: B.textDark }}>
                            <span style={{ color: '#D97706' }}>•</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Transcript Card */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(18,77,150,0.13)' }}>
            <h2 className="text-base font-extrabold mb-4 pb-4" style={{ color: B.textDark, borderBottom: '1px solid rgba(18,77,150,0.08)' }}>Your Speech Transcript</h2>
            <div className="rounded-xl p-4 text-sm leading-relaxed font-medium" style={{ background: 'rgba(18,77,150,0.04)', border: '1.5px solid rgba(18,77,150,0.10)', color: B.textDark, minHeight: '100px', whiteSpace: 'pre-wrap' }}>
              {transcript || <span className="italic" style={{ color: B.textLight }}>No transcript captured. Please enable microphone access.</span>}
            </div>
          </div>

          {/* Reference Speech */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(5,150,105,0.18)' }}>
            <h2 className="text-base font-extrabold mb-4 pb-4" style={{ color: B.textDark, borderBottom: '1px solid rgba(18,77,150,0.08)' }}>📚 Reference Speech</h2>
            <p className="text-sm leading-relaxed font-medium" style={{ color: B.textMid }}>{question.speech}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={() => window.location.href = '/alltest/lecturette'} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95" style={{ background: `linear-gradient(90deg,${B.navyDark},${B.navy})`, color: '#fff', boxShadow: '0 4px 16px rgba(18,77,150,0.28)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.52" /></svg> Retake
            </button>
            <button onClick={() => window.location.href = '/alltest'} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95" style={{ background: 'rgba(255,255,255,0.75)', color: B.textMid, border: `1.5px solid rgba(18,77,150,0.18)`, backdropFilter: 'blur(8px)' }}>
              All Tests
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Test Phase (Prep + Speech) ─────────────────────────────────────────────────
  const isInSpeechPhase = speechStarted;
  const currentTimer = isInSpeechPhase ? speechTimeLeft : preparationTimeLeft;
  const isTimeCritical = currentTimer <= 30;

  return (
    <>
      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-40 px-4 py-3" style={{ background: `linear-gradient(135deg,${B.navyDeep},${B.navy})`, boxShadow: '0 4px 20px rgba(10,42,85,0.35)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black tracking-widest uppercase" style={{ color: 'rgba(190,227,248,0.65)' }}>
              {isInSpeechPhase ? "🎙️ Speaking Phase" : prepStarted ? "⏳ Preparation Phase" : "Lecturette"}
            </p>
            <h1 className="text-lg font-black text-white leading-tight">Lecturette Assessment</h1>
          </div>

          <div className="hidden sm:flex flex-col items-center gap-1 flex-1 max-w-xs">
            <p className="text-xs font-bold" style={{ color: 'rgba(190,227,248,0.70)' }}>
              {isInSpeechPhase ? "Speech Time Remaining" : "Preparation Time Remaining"}
            </p>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${(currentTimer / 180) * 100}%`, background: isTimeCritical ? '#F87171' : '#4ADE80' }} />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xl ${isTimeCritical && (prepStarted || isInSpeechPhase) ? 'animate-pulse' : ''}`}
              style={{
                background: isTimeCritical && (prepStarted || isInSpeechPhase) ? 'rgba(220,38,38,0.25)' : 'rgba(255,255,255,0.12)',
                color: isTimeCritical && (prepStarted || isInSpeechPhase) ? '#F87171' : '#fff',
                border: isTimeCritical && (prepStarted || isInSpeechPhase) ? '1.5px solid rgba(220,38,38,0.40)' : '1.5px solid rgba(255,255,255,0.15)'
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              {formatTime(currentTimer)}
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen" style={{ background: `linear-gradient(160deg,${B.iceBlue},${B.iceMid},#c8e8f8)` }}>
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-5">

          {/* Main Panel */}
          <div className="flex-1 min-w-0 rounded-2xl p-6 sm:p-8 flex flex-col gap-6" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(14px)', border: '1.5px solid rgba(18,77,150,0.13)', boxShadow: '0 4px 20px rgba(18,77,150,0.09)' }}>

            {/* Topic */}
            <div>
              <span className="text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full inline-block mb-4" style={{ background: 'rgba(139,92,246,0.10)', color: '#8B5CF6' }}>
                {isInSpeechPhase ? "🎙️ Now Speaking" : "📋 Your Topic"}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black leading-snug" style={{ color: B.navyDeep }}>
                {question?.topic || "Loading..."}
              </h2>
            </div>

            {/* Camera feed */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border-2 border-white/30 shadow-xl">
              <video ref={videoRef} autoPlay muted style={{ transform: "scaleX(-1)" }} className="w-full h-full object-cover" />
              {!prepStarted && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white mb-4 animate-bounce">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /></svg>
                  </div>
                  <p className="text-white font-black uppercase tracking-wider text-sm">Click "Start Preparation" to begin</p>
                </div>
              )}
              {isRecording && (
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-md" style={{ background: 'rgba(0,0,0,0.65)', border: '1.5px solid rgba(255,255,255,0.15)' }}>
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-black text-white tracking-widest">REC</span>
                </div>
              )}
            </div>

            {/* Live Transcript */}
            {(prepStarted || isInSpeechPhase) && (
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: B.textLight }}>
                  {isInSpeechPhase ? "Live Transcript" : "Ambient Audio (Preparation)"}
                </label>
                <div className="rounded-xl p-4 min-h-[80px] text-sm font-medium leading-relaxed" style={{ background: 'rgba(18,77,150,0.04)', border: '1.5px solid rgba(18,77,150,0.12)', color: B.textDark }}>
                  {liveTranscript || <span className="italic" style={{ color: B.textLight }}>Listening…</span>}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-72 shrink-0 flex flex-col gap-4">

            {/* Phase indicator */}
            <div className="rounded-2xl p-5 text-center" style={{ background: isInSpeechPhase ? 'rgba(220,38,38,0.08)' : 'rgba(18,77,150,0.05)', border: `1.5px solid ${isInSpeechPhase ? 'rgba(220,38,38,0.20)' : 'rgba(18,77,150,0.14)'}` }}>
              <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: isInSpeechPhase ? '#DC2626' : B.navy }}>
                {isInSpeechPhase ? "🎙️ Speaking" : prepStarted ? "⏳ Preparing" : "Ready"}
              </p>
              <p className="text-3xl font-black" style={{ color: isTimeCritical && (prepStarted || isInSpeechPhase) ? '#DC2626' : B.textDark }}>
                {formatTime(currentTimer)}
              </p>
            </div>

            {/* Stats */}
            <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(18,77,150,0.12)' }}>
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: B.textLight }}>Speech Stats</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold" style={{ color: B.textMuted }}>Words spoken</span>
                  <span className="text-base font-black" style={{ color: B.textDark }}>{liveTranscript.split(/\s+/).filter(w => w).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold" style={{ color: B.textMuted }}>Characters</span>
                  <span className="text-base font-black" style={{ color: B.textDark }}>{liveTranscript.length}</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-3">
              {!prepStarted && !isInSpeechPhase && (
                <button onClick={startPreparation}
                  className="w-full py-4 rounded-xl font-black text-sm text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ background: 'linear-gradient(90deg,#15803D,#047857)', boxShadow: '0 4px 16px rgba(21,128,61,0.30)' }}>
                  ▶ Start Preparation (3 min)
                </button>
              )}

              {prepStarted && !isInSpeechPhase && (
                <button onClick={startSpeechPhase}
                  className="w-full py-4 rounded-xl font-black text-sm text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ background: `linear-gradient(90deg,${B.navyDark},${B.navy})`, boxShadow: '0 4px 16px rgba(18,77,150,0.28)' }}>
                  🎙️ Start Speaking Now
                </button>
              )}

              {isInSpeechPhase && (
                <button onClick={stopEarly}
                  className="w-full py-4 rounded-xl font-black text-sm text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ background: 'linear-gradient(90deg,#DC2626,#B91C1C)', boxShadow: '0 4px 16px rgba(220,38,38,0.28)' }}>
                  ⏹ Finish Speech
                </button>
              )}
            </div>

            {/* Tip Box */}
            <div className="rounded-2xl p-4" style={{ background: 'rgba(139,92,246,0.05)', border: '1.5px dashed rgba(139,92,246,0.25)' }}>
              <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#8B5CF6' }}>💡 Quick Tip</p>
              <p className="text-xs font-medium leading-relaxed" style={{ color: B.textMuted }}>
                {isInSpeechPhase
                  ? "Speak clearly with a structured flow: Intro → Key Points → Conclusion. Avoid fillers like 'um' and 'uh'."
                  : "Use this 3-minute window to organise your thoughts. Plan: Intro (30s) → 2-3 Points (2 min) → Conclusion (30s)."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
