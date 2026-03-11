"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/components/footer/Footer";
import { getAuthToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface Story {
  title: string;
  narration: string;
}

interface PPDTQuestion {
  _id: number;
  image: string;
  stories: Story[];
}

export default function DisplayPPDTQuestion() {
  const router = useRouter();
  const [stage, setStage] = useState<"loading" | "viewImage" | "waitStory" | "showStories">("loading");
  const [timeLeft, setTimeLeft] = useState(30); // 30 sec for image
  const [question, setQuestion] = useState<PPDTQuestion | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [overallTimeLeft, setOverallTimeLeft] = useState(270); // 4.5 minutes total
  const [userStory, setUserStory] = useState(""); // Store user's written story

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch('/api/ppdtquestions');
        if (!response.ok) {
          throw new Error('Failed to fetch PPDT question');
        }
        const result = await response.json();
        if (result.success) {
          setQuestion(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch PPDT question');
        }
      } catch (err) {
        console.error('Error fetching PPDT question:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch question');
      }
    };

    fetchQuestion();
  }, []);

  // Overall test timer
  useEffect(() => {
    if (stage === "loading" || stage === "showStories") return;

    if (overallTimeLeft > 0) {
      const timer = setTimeout(() => setOverallTimeLeft(overallTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Overall time expired, show stories
      setStage("showStories");
      handleSubmitPPDT();
    }
  }, [overallTimeLeft, stage]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (stage === "viewImage" && timeLeft > 0 && imageLoaded) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (stage === "viewImage" && timeLeft === 0) {
      setStage("waitStory");
      setTimeLeft(240); // 4 minutes for story
    } else if (stage === "waitStory" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (stage === "waitStory" && timeLeft === 0) {
      setStage("showStories");
      handleSubmitPPDT();
    }
    
    return () => clearTimeout(timer);
  }, [timeLeft, stage, imageLoaded]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const stopTimer = () => {
    if (stage === "waitStory") {
      setStage("showStories");
      handleSubmitPPDT();
    }
  };

  const goToAllTests = () => {
    router.push("/alltest");
  };

  // Submit PPDT test result to backend
  const handleSubmitPPDT = async () => {
    if (submitted) return; // Prevent double submission
    
    const calculatedScore = 1; // Basic scoring logic - can be enhanced
    setScore(calculatedScore);
    setSubmitted(true);

    const testResult = {
      testName: "PPDT Test",
      score: calculatedScore,
      timeTaken: 270, // 30 sec image + 4 min story
      dateTaken: new Date().toISOString(),
      responses: [{ story: userStory }], // Include user's story
    };

    const token = getAuthToken();
    if (!token) {
      console.warn('No auth token found, skipping result submission');
      return;
    }

    try {
      console.log('📊 PPDT: Submitting test result...', testResult);
      const response = await fetch('/api/ppdtquestions/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(testResult),
      });

      const result = await response.json();
      console.log('📊 PPDT: API Response:', result);

      if (result.success) {
        console.log('✅ PPDT test result saved successfully');
      } else {
        console.error('❌ Failed to save PPDT test result:', result.error || result.message);
      }
    } catch (err) {
      console.error('❌ Network error saving PPDT test result:', err);
    }
  };

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

  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading PPDT Question...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">PPDT Test</h1>
            </div>
            <div className={`flex items-center gap-4 ${
              overallTimeLeft <= 60 ? "text-red-600" : "text-blue-600"
            }`}>
              <div className="text-right">
                <p className="text-xs text-gray-600 font-semibold">OVERALL TIME</p>
                <p className="text-2xl font-bold">{formatTime(overallTimeLeft)}</p>
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
                <p className="text-gray-700 text-xs font-bold uppercase mb-3">Progress</p>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-3xl font-bold text-blue-600">
                      {stage === "loading" ? "0" : stage === "viewImage" ? "1" : stage === "waitStory" ? "2" : "3"}
                    </span>
                    <span className="text-sm text-gray-600">of 3 stages</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${stage === "loading" ? 0 : stage === "viewImage" ? 33 : stage === "waitStory" ? 66 : 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="bg-white rounded p-2">
                    <p className="text-gray-600 text-xs">Current Stage</p>
                    <p className="font-bold text-blue-600">
                      {stage === "loading" ? "⏳ Loading" : stage === "viewImage" ? "📷 Viewing" : stage === "waitStory" ? "✍️ Writing" : "📖 Results"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stage Timer Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <p className="text-gray-700 text-xs font-bold uppercase mb-3">
                  {stage === "viewImage" ? "Image Timer" : "Story Timer"}
                </p>
                <p className={`text-4xl font-bold mb-2 ${
                  timeLeft <= 10 ? "text-red-600 animate-pulse" : "text-green-600"
                }`}>
                  {stage === "viewImage" ? `${timeLeft}s` : formatTime(timeLeft)}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      timeLeft <= 10 ? "bg-red-600" : "bg-green-600"
                    }`}
                    style={{ 
                      width: `${stage === "viewImage" ? (timeLeft / 30) * 100 : (timeLeft / 240) * 100}%` 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {stage === "viewImage" ? `Auto-advance in ${timeLeft}s` : `Auto-submit in ${formatTime(timeLeft)}`}
                </p>
              </div>

              {/* Statistics Card */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <p className="text-gray-700 text-xs font-bold uppercase mb-3">Statistics</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-white rounded-lg px-3 py-2">
                    <span className="text-sm text-gray-600">Completion</span>
                    <span className="font-bold text-purple-600">
                      {Math.round((270 - overallTimeLeft) / 270 * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded-lg px-3 py-2">
                    <span className="text-sm text-gray-600">Time Elapsed</span>
                    <span className="font-bold text-purple-600">
                      {formatTime(270 - overallTimeLeft)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button Card */}
              {stage === "waitStory" && (
                <button
                  onClick={stopTimer}
                  className="w-full px-4 py-3 md:py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg transition-all text-sm md:text-base shadow-lg"
                >
                  ✓ Finish & Submit Story
                </button>
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
          <div className={`flex-1 ${
            sidebarOpen ? "hidden lg:flex lg:flex-col" : "flex flex-col"
          } min-h-[calc(100vh-80px)]`}>
            <div className="max-w-4xl mx-auto w-full px-4 py-6 md:py-8">
              {/* Main Question Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-6">
                {/* Stage Display */}
                {stage !== "showStories" && (
                  <div className="text-center mb-8">
                    <p className="text-gray-500 text-xs md:text-sm font-bold uppercase tracking-wider mb-4">
                      {stage === "viewImage" ? "Image Observation" : stage === "waitStory" ? "Story Preparation" : "Loading..."}
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                        {stage === "viewImage" ? "📷 Observe" : stage === "waitStory" ? "✍️ Write" : "⏳ Loading"}
                      </span>
                      <span className={`inline-block px-4 py-2 text-xs font-bold rounded-full ${
                        timeLeft <= 10 ? "bg-red-100 text-red-700 animate-pulse" : "bg-green-100 text-green-700"
                      }`}>
                        ⏱️ {stage === "viewImage" ? `${timeLeft}s` : formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Display Image */}
                {(stage === "loading" || stage === "viewImage") && (
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
                      src={question.image}
                      alt="PPDT Scene"
                      className={`rounded-xl border-4 border-blue-200 max-w-full max-h-[500px] object-contain shadow-lg transition-all duration-500 ${
                        imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                      }`}
                      onLoad={() => {
                        setImageLoaded(true);
                        if (stage === "loading") {
                          setStage("viewImage");
                        }
                      }}
                      onError={(e) => {
                        console.error("Image failed to load:", question.image);
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/600x400?text=Image+Not+Available";
                        setImageLoaded(true);
                        if (stage === "loading") {
                          setStage("viewImage");
                        }
                      }}
                    />
                  </div>
                )}

                {/* Instructions during image viewing */}
                {stage === "viewImage" && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-8">
                    <h3 className="font-bold text-blue-900 mb-3">📝 Observation Guidelines:</h3>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• Note the characters: age, gender, expressions</li>
                      <li>• Observe the setting and mood of the scene</li>
                      <li>• Think about what might be happening</li>
                      <li>• Consider the relationships between characters</li>
                    </ul>
                  </div>
                )}

                {/* Story Writing Instructions */}
                {stage === "waitStory" && (
                  <div className="space-y-6">
                    <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
                      <h3 className="font-bold text-green-900 mb-3">✍️ Story Writing Time</h3>
                      <p className="text-gray-700 mb-6">
                        Based on the image you observed, write a complete story.
                      </p>
                      
                      <textarea
                        value={userStory}
                        onChange={(e) => setUserStory(e.target.value)}
                        placeholder="Write your story here..."
                        className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none resize-none font-base text-gray-800"
                      />
                      
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-sm text-gray-600">
                          Characters: <span className="font-bold text-gray-800">{userStory.length}</span> / 2000
                        </p>
                        <p className={`text-sm font-semibold ${userStory.length < 50 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {userStory.length < 50 ? '📝 Keep writing...' : '✓ Good progress'}
                        </p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <h4 className="font-bold text-yellow-800 mb-3">💡 Remember:</h4>
                      <ul className="text-yellow-700 space-y-1 text-sm">
                        <li>• Keep your story positive and constructive</li>
                        <li>• Show leadership and officer-like qualities</li>
                        <li>• Make it realistic and logical</li>
                        <li>• Focus on action and problem-solving</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Show Stories / Results Stage */}
                {stage === "showStories" && (
                  <div className="animate-fade-in">
                    <h1 className="text-3xl font-bold text-blue-900 mb-2">✅ PPDT Test Completed!</h1>
                    <p className="text-gray-600 mb-8">
                      Test Duration: <span className="font-semibold">{formatTime(270 - overallTimeLeft)}</span>
                    </p>

                    <div className="space-y-6 mb-8">
                      {/* User's Story section */}
                      <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-3">
                            <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full font-semibold text-sm">
                              👤
                            </span>
                            <h3 className="font-bold text-xl text-green-900">
                              YOUR STORY
                            </h3>
                          </div>
                          <div className="bg-white border-l-4 border-green-500 rounded-lg p-4 ml-11">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                              {userStory || <span className="italic text-gray-500">No story provided.</span>}
                            </p>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-blue-900 mt-8 mb-4 border-b pb-2">Sample Stories</h3>

                      {question && question.stories.map((story, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                        >
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                              <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-semibold text-sm">
                                {index + 1}
                              </span>
                              <h3 className="font-bold text-xl text-blue-900">
                                {story.title.toUpperCase()}
                              </h3>
                            </div>
                            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 ml-11">
                              <p className="text-gray-700 font-semibold text-sm mb-2">📝 Sample Story:</p>
                              <p className="text-gray-800 leading-relaxed">{story.narration}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Learning Points */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                      <h3 className="font-bold text-yellow-800 mb-3">💡 Learning Points:</h3>
                      <ul className="space-y-2 text-yellow-700 text-sm">
                        <li>✓ Compare your story with these examples</li>
                        <li>✓ Notice how positive leadership qualities are highlighted</li>
                        <li>✓ Observe the logical flow from past to present to future</li>
                        <li>✓ Practice writing more positive and action-oriented stories</li>
                      </ul>
                    </div>

                    <button
                      onClick={goToAllTests}
                      className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Go to All Tests
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
