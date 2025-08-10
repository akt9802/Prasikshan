import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer.jsx";

function DisplayPiQuestion() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPiQuestions = async () => {
      try {
        const response = await fetch("https://prasikshan-79z7.onrender.com/alltest/pi/displaypiquestions");
        if (!response.ok) {
          throw new Error("Failed to fetch PI questions");
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching PI questions:", error);
      }
    };

    fetchPiQuestions();
  }, []);

  const handleNext = () => {
    setShowAnswer(false);
    setCurrentIndex((prevIndex) =>
      prevIndex < questions.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrevious = () => {
    setShowAnswer(false);
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : questions.length - 1
    );
  };

  const handleStop = () => {
    navigate("/alltest");
  };

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-700">Loading PI Questions...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <>
      <div
        className="flex justify-center items-center bg-gradient-to-b from-blue-100 to-blue-300"
        style={{
          minHeight: "100vh",
          paddingTop: "50px",
          paddingBottom: "50px",
        }}
      >
        <div className="bg-white border border-gray-300 rounded-lg p-6 md:p-10 w-[90%] max-w-3xl text-center shadow-lg relative">
          {/* Question Text */}
          <div className="mb-6">
            <p className="text-lg md:text-xl font-semibold">
              Question : {currentQuestion.question}
            </p>
          </div>

          {/* Answer */}
          {showAnswer && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm text-left mb-6">
              <p className="text-gray-800">{currentQuestion.expectation}</p>
            </div>
          )}

          {/* Buttons Row */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={handlePrevious}
              className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-md shadow"
            >
              Previous
            </button>

            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-md shadow"
            >
              {showAnswer ? "Hide" : "Expectation"}
            </button>

            <button
              onClick={handleNext}
              className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-md shadow"
            >
              Next
            </button>
          </div>

          {/* Stop Button - Bottom Right */}
          <div className="absolute bottom-4 right-4">
            <button
              onClick={handleStop}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-md shadow"
            >
              Stop
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DisplayPiQuestion;
