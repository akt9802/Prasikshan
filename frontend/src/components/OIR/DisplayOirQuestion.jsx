import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MCQquestion from "../Question-Format/MCQquestion.jsx";
import Footer from "../Footer/Footer.jsx";
const LOCAL = import.meta.env.VITE_BACKEND_URL;
const PRODUCTION_URL = import.meta.env.VITE_PRODUCTION_URL;
const apiURL = LOCAL || PRODUCTION_URL;
function DisplayOirQuestion() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${apiURL}/alltest/oir/displayoirquestions`);
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        console.error("Error in fetching questions:", error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Timer logic
  useEffect(() => {
    if (submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = async () => {
    console.log(LOCAL);
    console.log(PRODUCTION_URL);
    
    
  let correctCount = 0;

  questions.forEach((q) => {
    const userAnswer = (answers[q._id] || "").trim().toLowerCase();
    const correctAnswer = (q.answer || "").trim().toLowerCase();
    if (userAnswer === correctAnswer) {
      correctCount += 1;
    }
  });

  setScore(correctCount);
  setSubmitted(true);

  // Prepare test result data
  const testResult = {
    testName: "OIR Test",
    score: correctCount,
    timeTaken: 20 * 60 - timeLeft, // seconds taken
    dateTaken: new Date().toISOString(),
  };

  // Get JWT token from localStorage
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    await fetch(`${apiURL}/v1/addOirTestResult`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(testResult),
    });
  } catch (err) {
    // Optionally handle error
    console.error("Failed to save OIR test result", err);
  }
};

  const handleGoAllTest = () => {
    navigate("/alltest");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold">Loading OIR questions...</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Floating Timer (LEFT side now) */}
      <div className="fixed top-20 left-5 bg-white border border-gray-300 shadow-xl rounded-full px-6 py-3 flex items-center space-x-2 z-50">
        <span className="text-lg font-semibold text-gray-700">⏳</span>
        <span className="text-xl font-bold text-red-600">
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Main Content */}
      <main className="flex-grow py-10 px-4 bg-gradient-to-b from-blue-100 to-blue-300">
        <div className="max-w-3xl mx-auto space-y-6">
          {questions.map((q, index) => (
            <div
              key={q._id}
              className="bg-white shadow rounded-lg p-5 transition transform hover:scale-[1.02]"
            >
              <MCQquestion
                question={`Q${index + 1}: ${q.question}`}
                options={q.options}
                name={`question${index + 1}`}
                selectedAnswer={answers[q._id]}
                correctAnswer={submitted ? q.answer : null}
                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
              />
            </div>
          ))}

          {!submitted && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transform hover:scale-105 transition duration-300"
              >
                Submit Answers
              </button>
            </div>
          )}

          {submitted && (
            <div className="flex flex-col items-center mt-8 space-y-4">
              <p className="text-xl font-semibold text-green-700">
                🎉 You scored {score} out of {questions.length}
              </p>
              <button
                onClick={handleGoAllTest}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition duration-300"
              >
                Go back to All Test
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default DisplayOirQuestion;
