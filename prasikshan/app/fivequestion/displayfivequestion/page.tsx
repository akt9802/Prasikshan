"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/footer/Footer";

interface Question {
  _id: string;
  question: string;
  options: string[];
  answer: string;
}

export default function DisplayFiveQuestion() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        console.log("Fetching questions from /api/questions/fivequestions");
        
        const response = await fetch("/api/questions/fivequestions");
        console.log("Response status:", response.status);
        
        const data = await response.json();
        console.log("Response data:", data);

        if (data.success && data.data && data.data.length > 0) {
          console.log("Questions loaded successfully:", data.data);
          setQuestions(data.data);
          setAnswers(new Array(data.data.length).fill(null));
        } else {
          const errorMsg = data.message || "Failed to fetch questions";
          console.error("API error:", errorMsg);
          setError(errorMsg);
        }
      } catch (err) {
        const errorMsg = "Error fetching questions: " + (err instanceof Error ? err.message : "Unknown error");
        console.error("Fetch error:", errorMsg);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerSelect = (selectedOption: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-300">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-300">
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
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Quiz Results</h1>

            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-6 text-center">
              <p className="text-5xl font-bold text-blue-600 mb-2">{score}/{questions.length}</p>
              <p className="text-2xl font-semibold text-gray-700 mb-2">Score: {percentage}%</p>
              <p className="text-gray-600">Keep practicing to improve your performance!</p>
            </div>

            <div className="space-y-4 mb-6">
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
                onClick={() => window.location.href = "/fivequestion"}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
              >
                Retake Quiz
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-300">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-xl font-semibold text-red-600">No questions available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center items-center min-h-[calc(100vh-160px)] bg-gradient-to-b from-blue-100 to-blue-300 px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Question {currentQuestionIndex + 1}/{questions.length}
              </span>
              <span className="text-sm font-semibold text-gray-700">
                Answered: {answers.filter(a => a !== null).length}/{questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{currentQuestion.question}</h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition duration-200 font-semibold ${
                    answers[currentQuestionIndex] === option
                      ? "border-blue-600 bg-blue-50 text-blue-800"
                      : "border-gray-300 bg-gray-50 text-gray-700 hover:border-blue-400 hover:bg-blue-100"
                  }`}
                >
                  <span className="flex items-center">
                    <span className="w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center" 
                      style={{
                        borderColor: answers[currentQuestionIndex] === option ? "#1e40af" : "#d1d5db",
                        backgroundColor: answers[currentQuestionIndex] === option ? "#1e40af" : "transparent"
                      }}>
                      {answers[currentQuestionIndex] === option && (
                        <span className="text-white text-sm">✓</span>
                      )}
                    </span>
                    {option}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-md transition duration-300"
            >
              Previous
            </button>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-8 rounded-md transition duration-300"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300"
              >
                Next
              </button>
            )}
          </div>

          {/* Question Indicator */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-8 h-8 rounded-full font-semibold transition duration-200 ${
                  idx === currentQuestionIndex
                    ? "bg-blue-600 text-white"
                    : answers[idx] !== null
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
