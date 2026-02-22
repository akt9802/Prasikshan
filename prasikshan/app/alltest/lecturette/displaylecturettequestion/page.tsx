"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer/Footer";

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

interface SpeechRecognitionResult {
  isFinal: boolean;
  transcript: string;
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
      } catch (error) {
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
  }, [stage]);

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
      suggestions.push("Try to speak more. Aim for at least 20-30 words for a structured response.");
      suggestions.push("Structure: Introduction → 2-3 main points → Conclusion");
    }
    if (words.length < 50) {
      suggestions.push("Elaborate more on your points with examples or details.");
    }

    suggestions.push("Speak clearly and avoid filler words like 'um', 'uh', 'like'.");
    suggestions.push("Maintain a steady pace and confident tone throughout.");

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading Lecturette topic...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => router.push("/alltest")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to All Tests
          </button>
        </div>
      </div>
    );
  }

  if (stage === "showSpeech" && question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Test Completed</h1>
            <p className="text-gray-600 mb-6">Your Lecturette Performance</p>

            <div className="space-y-6">
              {/* Score Card */}
              {score !== null && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 rounded-lg p-6">
                  <p className="text-green-900 font-bold text-sm mb-2">YOUR SCORE</p>
                  <p className="text-5xl font-bold text-green-600">{score} / 10</p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-gray-600 text-sm font-bold mb-1">Topic</p>
                  <p className="text-gray-800 font-semibold">{question.topic}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-gray-600 text-sm font-bold mb-1">Duration</p>
                  <p className="text-gray-800 font-semibold">{formatTime(180 - preparationTimeLeft)}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-gray-600 text-sm font-bold mb-1">Words Spoken</p>
                  <p className="text-gray-800 font-semibold">{(firstTranscript || liveTranscript).split(/\s+/).filter(w => w).length}</p>
                </div>
              </div>

              {/* Your Speech */}
              <div>
                <h3 className="text-gray-900 font-bold mb-3">Your Speech</h3>
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed">
                    {firstTranscript || liveTranscript || (
                      <span className="italic text-gray-400">No speech recorded</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Suggestions */}
              {suggestion && (
                <div>
                  <h3 className="text-gray-900 font-bold mb-3">Suggestions</h3>
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6">
                    <p className="text-gray-700 leading-relaxed">{suggestion}</p>
                  </div>
                </div>
              )}

              {/* Reference Speech */}
              <div>
                <h3 className="text-gray-900 font-bold mb-3">Reference Speech</h3>
                <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed">{question.speech}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8">
                <button
                  onClick={calculateScore}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {score !== null ? "Recalculate" : "Calculate Score"}
                </button>
                <button
                  onClick={generateSuggestion}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {suggestion ? "More Suggestions" : "Get Suggestions"}
                </button>
                <button
                  onClick={submitResult}
                  disabled={submitting}
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors"
                >
                  {submitting ? "Submitting..." : "Submit Result"}
                </button>
              </div>

              <button
                onClick={() => router.push("/alltest")}
                className="w-full px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go to All Tests
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {sidebarOpen ? (
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Lecturette Test</h1>
            </div>
            <div className={`flex items-center gap-4 ${preparationTimeLeft <= 30 ? "text-red-600" : "text-blue-600"}`}>
              <div className="text-right">
                <p className="text-xs text-gray-600 font-semibold">PREP TIME</p>
                <p className="text-2xl font-bold">{formatTime(preparationTimeLeft)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Left Sidebar */}
          {(sidebarOpen || window.innerWidth >= 1024) && (
            <div className="fixed left-0 top-20 h-[calc(100vh-80px)] w-full sm:w-64 bg-white border-r border-gray-200 shadow-lg lg:shadow-none overflow-y-auto p-4 space-y-4 z-40 lg:z-auto lg:static lg:h-auto lg:top-auto">
              {/* Status Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <p className="text-gray-700 text-xs font-bold uppercase mb-3">Preparation Status</p>
                <div className="mb-4">
                  <p className={`text-3xl font-bold ${prepStarted ? "text-blue-600" : "text-gray-600"}`}>
                    {prepStarted ? "In Progress" : "Ready"}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{preparationTimeLeft}s remaining</p>
                </div>
              </div>

              {/* Topic Card */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <p className="text-gray-700 text-xs font-bold uppercase mb-3">Topic</p>
                <p className="text-gray-800 font-semibold text-sm">{question?.topic}</p>
                <p className="text-xs text-gray-600 mt-2">Topic #{question?.topic_id}/10</p>
              </div>

              {/* Transcript Stats */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <p className="text-gray-700 text-xs font-bold uppercase mb-3">Speech Stats</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between bg-white rounded px-2 py-1">
                    <span className="text-gray-600">Words</span>
                    <span className="font-bold text-green-600">{liveTranscript.split(/\s+/).filter(w => w).length}</span>
                  </div>
                  <div className="flex justify-between bg-white rounded px-2 py-1">
                    <span className="text-gray-600">Characters</span>
                    <span className="font-bold text-green-600">{liveTranscript.length}</span>
                  </div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="space-y-2">
                {!prepStarted ? (
                  <button
                    onClick={startPreparation}
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg transition-all shadow-lg"
                  >
                    ▶ Start Preparation
                  </button>
                ) : (
                  <>
                    <button
                      onClick={resetPreparation}
                      className="w-full px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-all"
                    >
                      🔄 Reset
                    </button>
                    <button
                      onClick={stopAndProceed}
                      className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all"
                    >
                      ⏹ Submit & View Results
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {/* Main Content */}
          <div className={`flex-1 ${sidebarOpen ? "hidden lg:flex lg:flex-col" : "flex flex-col"} min-h-[calc(100vh-80px)]`}>
            <div className="max-w-4xl mx-auto w-full px-4 py-6 md:py-8">
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-6">
                {/* Topic Display */}
                <div className="text-center mb-8">
                  <p className="text-gray-500 text-xs md:text-sm font-bold uppercase tracking-wider mb-4">
                    Current Topic
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                      Topic #{question?.topic_id}/10
                    </span>
                    <span className={`inline-block px-4 py-2 text-xs font-bold rounded-full ${
                      preparationTimeLeft <= 30 ? "bg-red-100 text-red-700 animate-pulse" : "bg-green-100 text-green-700"
                    }`}>
                      ⏱️ {formatTime(preparationTimeLeft)}
                    </span>
                  </div>
                </div>

                {/* Topic Text */}
                <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
                  <p className="text-gray-900 text-lg md:text-xl leading-relaxed font-semibold">
                    {question?.topic}
                  </p>
                </div>

                {/* Video Preview */}
                <div className="mb-8">
                  <label className="block text-gray-800 font-bold mb-3 text-sm md:text-base">
                    CAMERA PREVIEW:
                  </label>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full rounded-lg bg-black aspect-video object-cover mb-4 border-2 border-gray-300"
                  />
                  {isRecording && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-red-100 rounded-lg border border-red-300">
                      <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                      <span className="text-red-700 text-sm font-bold">Recording in Progress...</span>
                    </div>
                  )}
                </div>

                {/* Transcript Display */}
                <div className="mb-8">
                  <label className="block text-gray-800 font-bold mb-3 text-sm md:text-base">
                    LIVE TRANSCRIPT:
                  </label>
                  <div className="bg-gray-100 rounded-lg p-4 min-h-32 max-h-40 overflow-y-auto border-2 border-gray-300">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {liveTranscript || (
                        <span className="italic text-gray-400">Your speech will appear here...</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Reference Speech - when prep starts */}
                {prepStarted && (
                  <div className="mb-8">
                    <label className="block text-gray-800 font-bold mb-3 text-sm md:text-base">
                      REFERENCE SPEECH:
                    </label>
                    <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-6">
                      <p className="text-gray-700 text-sm leading-relaxed">{question?.speech}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
