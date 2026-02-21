"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/footer/Footer";

interface Question {
  _id: string;
  question: string;
  options: string[];
  answer: string;
}

export default function DisplayOirQuestion() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40 * 60); // 40 minutes in seconds
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/oirquestions");
        const data = await response.json();

        if (data.success && data.data && data.data.length > 0) {
          setQuestions(data.data);
          setAnswers(new Array(data.data.length).fill(null));
          setMarkedForReview(new Set());
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

  // Timer effect
  useEffect(() => {
    if (showResults) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setShowResults(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (selectedOption: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setAnswers(newAnswers);
  };

  const toggleMarkForReview = () => {
    const newMarked = new Set(markedForReview);
    if (newMarked.has(currentQuestionIndex)) {
      newMarked.delete(currentQuestionIndex);
    } else {
      newMarked.add(currentQuestionIndex);
    }
    setMarkedForReview(newMarked);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        correct++;
      }
    });
    return correct;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading OIR questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <p className="text-xl font-semibold text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <>
        <div className="flex justify-center items-center min-h-[calc(100vh-160px)] bg-gradient-to-b from-blue-100 to-blue-300 px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">OIR Test Results</h1>

            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-6 text-center">
              <p className="text-5xl font-bold text-blue-600 mb-2">{score}/{questions.length}</p>
              <p className="text-2xl font-semibold text-gray-700 mb-2">Score: {percentage}%</p>
              <p className="text-gray-600">Keep practicing to improve your performance!</p>
            </div>

            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {questions.map((question, index) => (
                <div key={question._id} className="border rounded-lg p-4 bg-gray-50">
                  <p className="font-semibold text-gray-800 mb-2">
                    Q{index + 1}: {question.question}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Your answer: <span className={answers[index] === question.answer ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{answers[index] || "Not answered"}</span>
                      </p>
                      {answers[index] !== question.answer && (
                        <p className="text-sm text-green-600 font-semibold">
                          Correct answer: {question.answer}
                        </p>
                      )}
                    </div>
                    <div className="text-2xl">
                      {answers[index] === question.answer ? "✓" : "✗"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => window.location.href = "/alltest/oir"}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
              >
                Retake Test
              </button>
              <button
                onClick={() => window.location.href = "/"}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
              >
                Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-xl font-semibold text-red-600">No questions available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 p-4 mb-4 rounded-t-lg flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">🧠 Officer Intelligence Rating (OIR)</h1>
          <p className="text-sm text-gray-600">Question Type: Multiple Choice</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Time Left</p>
          <p className={`text-2xl font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-blue-600'}`}>
            {formatTime(timeLeft)}
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Main Content - Left Side */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6">
          {/* Question Header */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
                <h2 className="text-xl font-bold text-gray-800">{currentQuestion.question}</h2>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full p-4 text-left rounded-lg border-2 transition duration-200 font-semibold ${
                  answers[currentQuestionIndex] === option
                    ? "border-blue-600 bg-blue-50 text-blue-900"
                    : "border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                <span className="flex items-center">
                  <span className="w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center font-bold"
                    style={{
                      borderColor: answers[currentQuestionIndex] === option ? "#1e40af" : "#d1d5db",
                      backgroundColor: answers[currentQuestionIndex] === option ? "#1e40af" : "transparent",
                      color: answers[currentQuestionIndex] === option ? "white" : "#666"
                    }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                </span>
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-between pt-4 border-t border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-md transition"
              >
                ← Previous
              </button>
              <button
                onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === questions.length - 1}
                className="bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-md transition"
              >
                Next →
              </button>
            </div>
            <button
              onClick={toggleMarkForReview}
              className={`font-semibold py-2 px-6 rounded-md transition ${
                markedForReview.has(currentQuestionIndex)
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
              }`}
            >
              {markedForReview.has(currentQuestionIndex) ? '★ Marked for Review' : '☆ Mark for Review'}
            </button>
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="w-80 bg-white rounded-lg shadow-md p-6">
          {/* Status Legend */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4">Question Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                <span className="text-gray-700">Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">Marked for Review</span>
              </div>
            </div>
          </div>

          {/* Question Navigator */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Choose a Question</h3>
            <div className="grid grid-cols-5 gap-2 mb-4 max-h-96 overflow-y-auto">
              {questions.map((_, idx) => {
                const isAnswered = answers[idx] !== null;
                const isMarked = markedForReview.has(idx);
                const isCurrent = idx === currentQuestionIndex;
                
                let bgColor = 'bg-gray-300 text-gray-700 hover:bg-gray-400';
                
                if (isCurrent) {
                  bgColor = 'bg-blue-600 text-white';
                } else if (isMarked && isAnswered) {
                  bgColor = 'bg-orange-600 text-white';
                } else if (isMarked) {
                  bgColor = 'bg-orange-400 text-white';
                } else if (isAnswered) {
                  bgColor = 'bg-green-500 text-white';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-10 h-10 rounded-lg font-semibold transition ${bgColor}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="font-semibold">Answered:</span> {answers.filter(a => a !== null).length}/{questions.length}</p>
              <p><span className="font-semibold">Not Answered:</span> {answers.filter(a => a === null).length}</p>
              <p><span className="font-semibold">Marked:</span> {markedForReview.size}</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={() => setShowResults(true)}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            Submit Test
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
