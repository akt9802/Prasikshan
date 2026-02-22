"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/footer/Footer";
import { useRouter } from "next/navigation";

interface SrtQuestion {
  _id: string;
  situation_id: number;
  situation: string;
  sample_reaction: string;
}

export default function DisplaySrtQuestion() {
  const router = useRouter();
  const [questions, setQuestions] = useState<SrtQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [currentResponse, setCurrentResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per situation
  const [overallTimeLeft, setOverallTimeLeft] = useState(30 * 60); // 30 minutes total (1800 seconds)
  const [testStarted, setTestStarted] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch SRT questions and start test automatically
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/srtquestions");
        const data = await response.json();

        if (data.success && data.data && data.data.length > 0) {
          setQuestions(data.data);
          setResponses(new Array(data.data.length).fill(""));
          setTestStarted(true);
        } else {
          setError(data.error || "Failed to fetch SRT questions");
        }
      } catch (err) {
        setError("Error fetching questions: " + (err instanceof Error ? err.message : "Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Timer for each situation (30 seconds)
  useEffect(() => {
    if (!testStarted || showResults || !questions.length) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Time expired, move to next situation
      moveToNextSituation();
    }
  }, [timeLeft, testStarted, showResults, questions.length]);

  // Overall test timer (30 minutes)
  useEffect(() => {
    if (!testStarted || showResults) return;

    if (overallTimeLeft > 0) {
      const timer = setTimeout(() => setOverallTimeLeft(overallTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Overall time expired, submit test
      submitTest();
    }
  }, [overallTimeLeft, testStarted, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const moveToNextSituation = () => {
    // Save current response
    const newResponses = [...responses];
    newResponses[currentIndex] = currentResponse;
    setResponses(newResponses);
    setCurrentResponse("");

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(30); // Reset timer to 30 seconds
    } else {
      // Test complete
      setShowResults(true);
      submitTest();
    }
  };

  const moveToPreviousSituation = () => {
    // Save current response before moving
    const newResponses = [...responses];
    newResponses[currentIndex] = currentResponse;
    setResponses(newResponses);

    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentResponse(responses[currentIndex - 1]);
      setTimeLeft(30);
    }
  };

  const submitTest = async () => {
    try {
      setSubmitting(true);

      // Save current response
      const newResponses = [...responses];
      newResponses[currentIndex] = currentResponse;
      setResponses(newResponses);

      // Get token from localStorage
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        console.warn("No authentication token found");
      } else {
        // Submit results to backend
        const testData = {
          testName: "SRT",
          score: newResponses.filter((r) => r.trim().length > 0).length,
          timeTaken: 30 * 60 - overallTimeLeft,
          dateTaken: new Date().toISOString(),
          responses: questions.map((q, idx) => ({
            situation_id: q.situation_id,
            response: newResponses[idx] || "",
          })),
        };

        await fetch("/api/srtquestions/result", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(testData),
        });
      }

      setShowResults(true);
    } catch (err) {
      console.error("Error submitting test:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const goToAllTests = () => {
    router.push("/alltest");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading SRT questions...</p>
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

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Test Completed</h1>
            <p className="text-gray-600 mb-6">
              Situations answered: <span className="font-semibold">{responses.filter((r) => r.trim().length > 0).length}</span> / {questions.length}
            </p>

            <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
              {questions.map((q, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-semibold text-sm">
                        {idx + 1}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{q.situation}</p>
                    <p className="text-gray-700">
                      <span className="font-semibold text-gray-800">Your Response:</span>
                      <br />
                      {responses[idx] ? (
                        responses[idx]
                      ) : (
                        <span className="italic text-gray-400">No response</span>
                      )}
                    </p>
                    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3">
                      <p className="text-gray-700 font-semibold text-xs mb-2">📝 Sample Reaction (Reference):</p>
                      <p className="text-gray-700 text-xs leading-relaxed">{q.sample_reaction}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={goToAllTests}
              className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to All Tests
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
        {/* Header with Controls */}
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
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">SRT Test</h1>
            </div>
            <div className={`flex items-center gap-4 ${overallTimeLeft <= 60 ? "text-red-600" : "text-blue-600"}`}>
              <div className="text-right">
                <p className="text-xs text-gray-600 font-semibold">OVERALL TIME</p>
                <p className="text-2xl font-bold">{formatTime(overallTimeLeft)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Left Sidebar - Collapsible on Mobile */}
          {(sidebarOpen || window.innerWidth >= 1024) && (
            <div className="fixed left-0 top-20 h-[calc(100vh-80px)] w-full sm:w-64 bg-white border-r border-gray-200 shadow-lg lg:shadow-none overflow-y-auto p-4 space-y-4 z-40 lg:z-auto lg:static lg:h-auto lg:top-auto lg:shadow-none">
              {/* Progress Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <p className="text-gray-700 text-xs font-bold uppercase mb-3">Progress</p>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-3xl font-bold text-blue-600">{currentIndex + 1}</span>
                    <span className="text-sm text-gray-600">of {questions.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-white rounded p-2">
                    <p className="text-gray-600 text-xs">Answered</p>
                    <p className="font-bold text-green-600">{responses.filter((r) => r.trim().length > 0).length}</p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <p className="text-gray-600 text-xs">Not Answered</p>
                    <p className="font-bold text-red-600">{responses.filter((r) => r.trim().length === 0).length}</p>
                  </div>
                </div>
              </div>

              {/* Situation Timer Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <p className="text-gray-700 text-xs font-bold uppercase mb-3">Situation Timer</p>
                <p className={`text-4xl font-bold mb-2 ${timeLeft <= 5 ? "text-red-600 animate-pulse" : "text-green-600"}`}>
                  {timeLeft}s
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      timeLeft <= 5 ? "bg-red-600" : "bg-green-600"
                    }`}
                    style={{ width: `${(timeLeft / 30) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">Auto-advance in {timeLeft}s</p>
              </div>

              {/* Statistics Card */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <p className="text-gray-700 text-xs font-bold uppercase mb-3">Statistics</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-white rounded-lg px-3 py-2">
                    <span className="text-sm text-gray-600">Completion</span>
                    <span className="font-bold text-purple-600">
                      {Math.round(((currentIndex + 1) / questions.length) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded-lg px-3 py-2">
                    <span className="text-sm text-gray-600">Time Elapsed</span>
                    <span className="font-bold text-purple-600">
                      {formatTime(30 * 60 - overallTimeLeft)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button Card */}
              <button
                onClick={submitTest}
                disabled={submitting}
                className="w-full px-4 py-3 md:py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-400 disabled:to-green-500 text-white font-bold rounded-lg transition-all text-sm md:text-base shadow-lg"
              >
                {submitting ? "⏳ Submitting..." : "✓ Submit Test"}
              </button>

              {/* Close button for mobile */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Close Panel
              </button>
            </div>
          )}

          {/* Main Content Area */}
          <div className={`flex-1 ${sidebarOpen ? "hidden lg:flex lg:flex-col" : "flex flex-col"} min-h-[calc(100vh-80px)]`}>
            <div className="max-w-4xl mx-auto w-full px-4 py-6 md:py-8">
              {/* Main Question Card */}
              {currentQuestion && (
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-6">
                  {/* Situation Display */}
                  <div className="text-center mb-8">
                    <p className="text-gray-500 text-xs md:text-sm font-bold uppercase tracking-wider mb-4">Current Situation</p>
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                        Q {currentIndex + 1} / {questions.length}
                      </span>
                      <span className={`inline-block px-4 py-2 text-xs font-bold rounded-full ${
                        timeLeft <= 5 ? "bg-red-100 text-red-700 animate-pulse" : "bg-green-100 text-green-700"
                      }`}>
                        ⏱️ {timeLeft}s
                      </span>
                    </div>
                  </div>

                  {/* Situation Text */}
                  <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
                    <p className="text-gray-900 text-lg md:text-xl leading-relaxed">
                      {currentQuestion.situation}
                    </p>
                  </div>

                  {/* Response Input */}
                  <div className="mb-8">
                    <label className="block text-gray-800 font-bold mb-3 text-sm md:text-base">
                      YOUR REACTION:
                    </label>
                    <div className="relative mb-4">
                      <textarea
                        value={currentResponse}
                        onChange={(e) => setCurrentResponse(e.target.value)}
                        placeholder="Write your immediate and appropriate reaction to this situation..."
                        className="w-full px-5 py-4 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-200 resize-none text-black bg-white text-base md:text-lg min-h-40 md:min-h-48 transition-all"
                        autoFocus
                      />
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-gray-500 text-xs md:text-sm">{currentResponse.length} / 500 characters</p>
                      {currentResponse.trim().length > 0 && (
                        <span className="text-green-600 text-xs md:text-sm font-bold flex items-center gap-1">
                          ✓ Response saved
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={moveToPreviousSituation}
                      disabled={currentIndex === 0}
                      className="px-4 py-3 md:py-4 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white font-bold rounded-lg disabled:cursor-not-allowed transition-all text-sm md:text-base"
                    >
                      ← Previous
                    </button>
                    {currentIndex === questions.length - 1 ? (
                      <button
                        onClick={submitTest}
                        disabled={submitting}
                        className="px-4 py-3 md:py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-400 disabled:to-green-500 text-white font-bold rounded-lg transition-all text-sm md:text-base shadow-lg"
                      >
                        {submitting ? "⏳ Submitting..." : "✓ Submit"}
                      </button>
                    ) : (
                      <button
                        onClick={moveToNextSituation}
                        className="px-4 py-3 md:py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all text-sm md:text-base"
                      >
                        Next →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Question Navigator */}
              <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6">
                <h3 className="font-bold text-gray-800 mb-4 text-xs md:text-sm uppercase tracking-wider">Question Navigator</h3>
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5 md:gap-2">
                  {questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const newResponses = [...responses];
                        newResponses[currentIndex] = currentResponse;
                        setResponses(newResponses);
                        setCurrentIndex(idx);
                        setCurrentResponse(newResponses[idx]);
                        setTimeLeft(30);
                      }}
                      className={`aspect-square rounded-lg font-bold text-xs md:text-sm transition-all transform hover:scale-110 ${
                        idx === currentIndex
                          ? "bg-blue-600 text-white ring-2 ring-blue-800 scale-110 shadow-lg"
                          : responses[idx].trim().length > 0
                          ? "bg-green-500 text-white hover:bg-green-600 shadow-md"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      title={`Question ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Info Footer */}
              <div className="lg:hidden mt-6 bg-blue-50 rounded-lg p-4 text-center text-sm text-gray-600">
                <p>Use buttons above to navigate or click question numbers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
