"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer/Footer";

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading PI questions...</p>
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

  if (stage === "review") {
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Interview Complete</h1>
            <p className="text-gray-600 mb-8">Review your responses below</p>

            <div className="space-y-6">
              {/* Time Summary */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm font-bold mb-2">TOTAL TIME</p>
                    <p className="text-2xl font-bold text-blue-600">{formatTime(timeTaken)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-bold mb-2">QUESTIONS</p>
                    <p className="text-2xl font-bold text-blue-600">{questions.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-bold mb-2">ANSWERED</p>
                    <p className="text-2xl font-bold text-green-600">{Object.keys(answers).length}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-bold mb-2">PENDING</p>
                    <p className="text-2xl font-bold text-orange-600">{questions.length - Object.keys(answers).length}</p>
                  </div>
                </div>
              </div>

              {/* All Responses */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Your Responses</h2>
                {questions.map((q, idx) => (
                  <div key={q.question_id} className="border border-gray-200 rounded-lg p-6">
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-full mb-2">
                        Q{idx + 1}/{questions.length}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-800">{q.question}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Your Answer */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-xs font-bold text-gray-600 mb-2">YOUR ANSWER</p>
                        <p className="text-gray-800">
                          {answers[q.question_id] || <span className="italic text-gray-400">No answer provided</span>}
                        </p>
                      </div>
                      
                      {/* Expected Answer */}
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-xs font-bold text-gray-600 mb-2">EXPECTED GUIDANCE</p>
                        <p className="text-gray-800">{q.expectation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
                <button
                  onClick={() => setStage("questions")}
                  className="px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
                >
                  ← Edit Responses
                </button>
                <button
                  onClick={submitResult}
                  disabled={submitting}
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors"
                >
                  {submitting ? "Submitting..." : "✅ Submit & Finish"}
                </button>
              </div>

              <button
                onClick={() => router.push("/alltest")}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to Tests
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

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
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Personal Interview</h1>
            </div>
            <div className="text-blue-600">
              <p className="text-xs text-gray-600 font-semibold">PROGRESS</p>
              <p className="text-2xl font-bold">{currentIndex + 1}/{questions.length}</p>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Left Sidebar */}
          {(sidebarOpen || window.innerWidth >= 1024) && (
            <div className="fixed left-0 top-20 h-[calc(100vh-80px)] w-full sm:w-64 bg-white border-r border-gray-200 shadow-lg lg:shadow-none overflow-y-auto p-4 space-y-4 z-40 lg:z-auto lg:static lg:h-auto lg:top-auto">
              {/* Progress Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <p className="text-gray-700 text-xs font-bold uppercase mb-3">Progress</p>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700 font-semibold">{currentIndex + 1}/{questions.length}</span>
                    <span className="text-gray-600">{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Status Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <p className="text-gray-700 text-xs font-bold uppercase mb-3">Status</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between bg-white rounded px-2 py-1">
                    <span className="text-gray-600">Answered</span>
                    <span className="font-bold text-green-600">{answeredCount}</span>
                  </div>
                  <div className="flex justify-between bg-white rounded px-2 py-1">
                    <span className="text-gray-600">Remaining</span>
                    <span className="font-bold text-orange-600">{questions.length - answeredCount}</span>
                  </div>
                </div>
              </div>

              {/* Navigation Progress */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <p className="text-gray-700 text-xs font-bold uppercase mb-3">Questions</p>
                <div className="grid grid-cols-5 gap-1">
                  {questions.map((q, idx) => (
                    <button
                      key={q.question_id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`aspect-square text-xs font-bold rounded transition-all ${
                        idx === currentIndex
                          ? "bg-blue-600 text-white ring-2 ring-blue-300"
                          : answers[q.question_id]
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Control Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleFinish}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg transition-all shadow-lg"
                >
                  ✓ Finish Interview
                </button>
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
                {/* Question Number */}
                <div className="mb-8 text-center">
                  <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 text-sm font-bold rounded-full mb-4">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed">
                    {currentQuestion.question}
                  </h2>
                </div>

                {/* Response Textarea */}
                <div className="mb-8">
                  <label className="block text-gray-800 font-bold mb-3 text-sm md:text-base">
                    YOUR RESPONSE:
                  </label>
                  <textarea
                    value={answers[currentQuestion.question_id] || ""}
                    onChange={handleAnswerChange}
                    placeholder="Type your response here..."
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none resize-none text-gray-700 min-h-40"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Character count: {(answers[currentQuestion.question_id] || "").length}
                  </p>
                </div>

                {/* Expected Guidance */}
                <div className="mb-8">
                  <label className="block text-gray-800 font-bold mb-3 text-sm md:text-base">
                    EXPECTED GUIDANCE:
                  </label>
                  <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
                    <p className="text-gray-800 leading-relaxed">{currentQuestion.expectation}</p>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col md:flex-row gap-3 justify-between">
                  <div className="flex gap-3">
                    <button
                      onClick={handlePrevious}
                      disabled={currentIndex === 0}
                      className="flex-1 md:flex-none px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={currentIndex === questions.length - 1}
                      className="flex-1 md:flex-none px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                  <button
                    onClick={handleFinish}
                    className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Finish & Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
