"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/components/footer/Footer";
import { getAuthToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface Story {
  title: string;
  narration: string;
}

interface TATQuestion {
  _id: number;
  image: string;
  stories: Story[];
}

export default function DisplayTatQuestion() {
  const router = useRouter();

  const [questions, setQuestions] = useState<TATQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stage, setStage] = useState<"loading" | "viewImage" | "waitStory" | "showStories">("loading");

  const [timeLeft, setTimeLeft] = useState(30);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [userStories, setUserStories] = useState<string[]>([]);
  const [currentStory, setCurrentStory] = useState("");
  const [overallTimeElapsed, setOverallTimeElapsed] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/tatquestions');
        if (!response.ok) throw new Error('Failed to fetch TAT questions');
        const result = await response.json();

        if (result.success && result.data.length > 0) {
          setQuestions(result.data);
          setUserStories(new Array(result.data.length).fill(""));
          setStage("viewImage");
        } else {
          throw new Error(result.error || 'No questions received');
        }
      } catch (err) {
        console.error('Error fetching TAT questions:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch questions');
      }
    };

    fetchQuestions();
  }, []);

  // Overall time tracker
  useEffect(() => {
    if (stage === "loading" || stage === "showStories") return;

    const timer = setInterval(() => {
      setOverallTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [stage]);

  // Stage timer
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (stage === "viewImage" && timeLeft > 0 && imageLoaded) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (stage === "viewImage" && timeLeft === 0) {
      setStage("waitStory");
      setTimeLeft(240); // 4 minutes for story writing
    } else if (stage === "waitStory" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (stage === "waitStory" && timeLeft === 0) {
      goToNext();
    }

    return () => clearTimeout(timer);
  }, [timeLeft, stage, imageLoaded, currentIndex, questions.length]);

  const goToNext = () => {
    const newStories = [...userStories];
    newStories[currentIndex] = currentStory;
    setUserStories(newStories);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setCurrentStory(newStories[currentIndex + 1] || "");
      setStage("viewImage");
      setTimeLeft(30);
      setImageLoaded(false);
    } else {
      setStage("showStories");
      handleSubmitTAT(newStories);
    }
  };

  // Give them a way to go previous while in testing phase (matching legacy logic)
  const goToPrevious = () => {
    if (currentIndex > 0) {
      const newStories = [...userStories];
      newStories[currentIndex] = currentStory;
      setUserStories(newStories);

      setCurrentIndex(currentIndex - 1);
      setCurrentStory(userStories[currentIndex - 1] || "");
      setStage("waitStory"); // Default to writing stage when going back to not be stressful
      setTimeLeft(240);
      setImageLoaded(true);
    }
  };

  const stopTest = () => {
    const newStories = [...userStories];
    newStories[currentIndex] = currentStory;
    setUserStories(newStories);
    setStage("showStories");
    handleSubmitTAT(newStories);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const goToAllTests = () => {
    router.push("/alltest");
  };

  const handleSubmitTAT = async (finalStories: string[]) => {
    if (submitted) return;
    setSubmitted(true);

    const testResult = {
      testName: "TAT Test",
      score: questions.length,
      timeTaken: overallTimeElapsed,
      dateTaken: new Date().toISOString(),
      responses: finalStories.map((story, i) => ({
        questionId: questions[i]?._id,
        story: story
      })),
    };

    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await fetch('/api/tatquestions/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(testResult),
      });

      const result = await response.json();
      if (!result.success) {
        console.error('❌ Failed to save TAT test result:', result.error);
      }
    } catch (err) {
      console.error('❌ Network error saving TAT test result:', err);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={goToAllTests}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to All Tests
          </button>
        </div>
      </div>
    );
  }

  if (stage === "loading" || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading TAT Questions...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  // Calculate completion percentage based on current index and stages
  const getOverallCompletion = () => {
    if (stage === "showStories") return 100;
    const basePercent = (currentIndex / questions.length) * 100;
    const stagePercent = stage === "waitStory" ? (1 / questions.length) * 100 : 0;
    return Math.round(basePercent + (stagePercent / 2));
  };

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
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">TAT Test</h1>
            </div>
            <div className="flex items-center gap-4 text-blue-600">
              <div className="text-right">
                <p className="text-xs text-gray-600 font-semibold uppercase">Elapsed Time</p>
                <p className="text-2xl font-bold">{formatTime(overallTimeElapsed)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Left Sidebar - Collapsible on Mobile */}
          {sidebarOpen && (
            <div className="fixed left-0 top-20 h-[calc(100vh-80px)] w-full sm:w-64 bg-white border-r border-gray-200 shadow-lg lg:shadow-none overflow-y-auto p-4 space-y-4 z-40 lg:z-auto lg:static lg:h-auto lg:top-auto lg:shadow-none lg:relative">

              {/* Progress Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <p className="text-gray-700 text-xs font-bold uppercase mb-3">Overall Progress</p>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-3xl font-bold text-blue-600">
                      {stage === 'showStories' ? questions.length : currentIndex + 1}
                    </span>
                    <span className="text-sm text-gray-600">of {questions.length} pics</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${getOverallCompletion()}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-white rounded p-2 text-sm">
                  <p className="text-gray-600 text-xs">Current Action</p>
                  <p className="font-bold text-blue-600">
                    {stage === "viewImage" ? "📷 Viewing Image" : stage === "waitStory" ? "✍️ Writing Story" : "📖 Reviewing Results"}
                  </p>
                </div>
              </div>

              {/* Timer Card */}
              {stage !== "showStories" && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <p className="text-gray-700 text-xs font-bold uppercase mb-3">
                    {stage === "viewImage" ? "Observation Timer" : "Writing Timer"}
                  </p>
                  <p className={`text-4xl font-bold mb-2 ${timeLeft <= 10 ? "text-red-600 animate-pulse" : "text-green-600"
                    }`}>
                    {stage === "viewImage" ? `${timeLeft}s` : formatTime(timeLeft)}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${timeLeft <= 10 ? "bg-red-600" : "bg-green-600"
                        }`}
                      style={{
                        width: `${stage === "viewImage" ? (timeLeft / 30) * 100 : (timeLeft / 240) * 100}%`
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {stage === "viewImage" ? `Auto-advance in ${timeLeft}s` : `Auto-next or submit in ${formatTime(timeLeft)}`}
                  </p>
                </div>
              )}

              {/* Quick Navigation during testing */}
              {stage !== "showStories" && (
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={goToPrevious}
                    disabled={currentIndex === 0}
                    className="w-full px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50 font-semibold rounded-lg transition-colors text-sm"
                  >
                    ← Previous Picture
                  </button>
                  <button
                    onClick={stopTest}
                    className="w-full px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition-colors text-sm"
                  >
                    ⏹ Stop Test Early
                  </button>
                </div>
              )}

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
          <div className={`flex-1 ${sidebarOpen ? "hidden lg:flex lg:flex-col" : "flex flex-col"
            } min-h-[calc(100vh-80px)]`}>
            <div className="max-w-4xl mx-auto w-full px-4 py-6 md:py-8">
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-6">

                {stage !== "showStories" && (
                  <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between border-b pb-4">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-1">
                        Picture {currentIndex + 1}
                      </h2>
                      <p className="text-gray-500 text-xs md:text-sm font-bold uppercase tracking-wider">
                        {stage === "viewImage" ? "Phase 1: Observation" : "Phase 2: Preparation"}
                      </p>
                    </div>

                    <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                      <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                        {stage === "viewImage" ? "📷 Observe carefully" : "✍️ Write story"}
                      </span>
                      <span className={`inline-block px-4 py-2 text-xs font-bold rounded-full ${timeLeft <= 10 ? "bg-red-100 text-red-700 animate-pulse" : "bg-gray-100 text-gray-700"
                        }`}>
                        ⏱️ {stage === "viewImage" ? `${timeLeft}s` : formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Shared test view (images & textbox) */}
                {stage !== "showStories" && (
                  <>
                    {stage === "viewImage" && (
                      <div className="flex justify-center mb-8 relative">
                        {!imageLoaded && (
                          <div className="absolute inset-0 flex justify-center items-center bg-gray-100 rounded-xl min-h-[400px]">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                              <p className="text-gray-500 font-semibold">Loading image...</p>
                            </div>
                          </div>
                        )}
                        <img
                          src={currentQuestion.image}
                          alt={`TAT Scene ${currentIndex + 1}`}
                          className={`rounded-xl border-4 border-blue-200 max-w-full max-h-[500px] object-contain shadow-lg transition-all duration-500 ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                            }`}
                          onLoad={() => {
                            setImageLoaded(true);
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/600x400?text=Image+Not+Available";
                            setImageLoaded(true);
                          }}
                        />
                      </div>
                    )}

                    {stage === "viewImage" && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 my-4">
                        <h3 className="font-bold text-blue-900 mb-2">📝 Observation Time:</h3>
                        <p className="text-gray-700 text-sm">Observe the characters, setting, and mood carefully for 30 seconds before writing.</p>
                      </div>
                    )}

                    {stage === "waitStory" && (
                      <div className="space-y-6">
                        <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
                          <h3 className="font-bold text-green-900 mb-3">✍️ Story Writing Time</h3>
                          <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                            Based on picture {currentIndex + 1}, write a complete story. Identify the hero, what led to the situation, what is currently happening, and a positive outcome.
                          </p>

                          <textarea
                            value={currentStory}
                            onChange={(e) => setCurrentStory(e.target.value)}
                            placeholder="Write your story for this picture here..."
                            className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none resize-none font-base text-gray-800 shadow-inner"
                          />

                          <div className="flex justify-between items-center mt-4">
                            <p className="text-sm text-gray-600">
                              Characters: <span className="font-bold text-gray-800">{currentStory.length}</span> / 2000
                            </p>
                            <button
                              onClick={goToNext}
                              className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow"
                            >
                              {currentIndex + 1 === questions.length ? "Finish Test ✓" : "Next Picture →"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Show Stories / Results Stage */}
                {stage === "showStories" && (
                  <div className="animate-fade-in">
                    <div className="text-center mb-10 pb-6 border-b">
                      <h1 className="text-3xl font-bold text-blue-900 mb-3">✅ TAT Test Completed!</h1>
                      <p className="text-gray-600 mb-2">
                        You have completed all {questions.length} TAT pictures.
                      </p>
                      <p className="text-gray-600 font-semibold bg-blue-50 inline-block px-4 py-2 rounded-lg">
                        Total time taken: {formatTime(overallTimeElapsed)}
                      </p>
                    </div>

                    <div className="space-y-12 mb-8">
                      {questions.map((q, idx) => {
                        const writtenStory = userStories[idx];

                        return (
                          <div key={idx} className="border border-gray-300 shadow-sm rounded-xl overflow-hidden bg-white">
                            {/* Card Header */}
                            <div className="bg-gray-100 flex items-center justify-between p-4 border-b">
                              <h3 className="font-bold text-xl text-blue-900">
                                Picture {idx + 1}
                              </h3>
                            </div>

                            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                              {/* Reference Thumbnail */}
                              <div className="w-full md:w-1/3 flex flex-col gap-2">
                                <img
                                  src={q.image}
                                  alt={`Scene ${idx + 1}`}
                                  className="rounded-lg shadow-sm border w-full max-h-64 object-contain"
                                />
                                <p className="text-xs text-gray-500 text-center italic">Reference Scene</p>
                              </div>

                              <div className="w-full md:w-2/3 space-y-6">
                                {/* User's Story section */}
                                <div className="border border-green-200 rounded-lg p-5 bg-green-50">
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 bg-green-600 text-white rounded-full text-xs">👤</span>
                                    <h4 className="font-bold text-green-900">YOUR STORY</h4>
                                  </div>
                                  <div className="bg-white border text-sm border-green-300 rounded p-4 text-gray-800 leading-relaxed whitespace-pre-wrap">
                                    {writtenStory ? writtenStory : <span className="italic text-gray-500">No story submitted for this picture.</span>}
                                  </div>
                                </div>

                                {/* Sample Stories */}
                                <div className="space-y-4">
                                  <h4 className="font-bold text-gray-700 mb-2">Sample Reference Stories:</h4>
                                  {q.stories && q.stories.map((story, sIdx) => (
                                    <div key={sIdx} className="bg-blue-50 border-l-4 border-blue-400 rounded p-4">
                                      <h5 className="font-bold text-blue-900 text-sm mb-1">{story.title.toUpperCase()}</h5>
                                      <p className="text-gray-700 text-sm leading-relaxed">{story.narration}</p>
                                    </div>
                                  ))}
                                  {(!q.stories || q.stories.length === 0) && (
                                    <p className="text-sm text-gray-500 italic">No sample stories available.</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={goToAllTests}
                      className="w-full px-6 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
                    >
                      Return to Test Dashboard
                    </button>
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
