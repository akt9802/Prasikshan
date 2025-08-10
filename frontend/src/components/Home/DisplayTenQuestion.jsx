import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MCQquestion from "../Question-Format/MCQquestion.jsx";
import Footer from "../Footer/Footer.jsx";

function DisplayTenQuestion() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://prasikshan-79z7.onrender.com/question/tenquestions");
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = () => {
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
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl font-semibold">Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow space-y-6 py-10 bg-gradient-to-b from-blue-100 to-blue-300">
        {questions.map((q, index) => (
          <MCQquestion
            key={q._id}
            question={`Q${index + 1}: ${q.question}`}
            options={q.options}
            name={`question${index + 1}`}
            selectedAnswer={answers[q._id]}
            correctAnswer={submitted ? q.answer : null}
            onChange={(e) => handleAnswerChange(q._id, e.target.value)}
          />
        ))}

        {!submitted ? (
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Submit
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center mt-8 space-y-4">
            <p className="text-xl font-semibold text-green-700">
              🎉 You scored {score} out of {questions.length}
            </p>
            <button
              onClick={handleGoHome}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition duration-300"
            >
              Go Back to Home
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default DisplayTenQuestion;
