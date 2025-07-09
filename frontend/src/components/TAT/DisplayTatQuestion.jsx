import React, { useState, useEffect } from "react";
import Footer from "../Footer/Footer.jsx";

function DisplayTatQuestion() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stage, setStage] = useState("loading"); // loading, viewImage, writeStory, review
  const [timeLeft, setTimeLeft] = useState(30);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/alltest/tat/displaytatquestions");
        if (!response.ok) throw new Error("Failed to fetch TAT questions");
        const data = await response.json();
        setQuestions(data);
        setStage("viewImage");
      } catch (err) {
        console.error("Error fetching TAT questions:", err);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    let timer;
    if ((stage === "viewImage" || stage === "writeStory") && imageLoaded) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);

      if (timeLeft === 0) {
        if (stage === "viewImage") {
          setStage("writeStory");
          setTimeLeft(240);
        } else if (stage === "writeStory") {
          goToNext();
        }
      }
    }
    return () => clearTimeout(timer);
  }, [timeLeft, stage, imageLoaded]);

  const goToNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setStage("viewImage");
      setTimeLeft(30);
      setImageLoaded(false);
    } else {
      setStage("review");
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const stopTest = () => {
    setStage("review");
  };

  if (stage === "loading" || questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-700">Loading TAT Questions...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-4">
        <div className="bg-white border border-gray-300 rounded-lg p-6 w-full max-w-2xl shadow-lg text-center">
          <h2 className="text-xl font-bold mb-4">
            Picture {currentIndex + 1}.
          </h2>

          {/* Timer */}
          {stage !== "review" && (
            <div className="mb-4">
              <span className="inline-block bg-gray-800 text-white font-semibold py-1 px-4 rounded-full text-lg">
                {stage === "viewImage"
                  ? `${timeLeft} SEC`
                  : `${Math.floor(timeLeft / 60)}:${
                      timeLeft % 60 < 10 ? "0" : ""
                    }${timeLeft % 60} MIN`}
              </span>
            </div>
          )}

          {/* Display Image */}
          <div className="flex justify-center mb-6 relative">
            {!imageLoaded && stage !== "writeStory" && (
              <div className="absolute inset-0 flex justify-center items-center bg-gray-100 rounded-md">
                <p className="text-gray-500">Loading image...</p>
              </div>
            )}
            {stage !== "writeStory" && (
              <img
                src={currentQuestion.image}
                alt={`TAT Scene ${currentIndex + 1}`}
                className={`rounded-md border border-gray-400 max-w-full ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/600x400?text=Image+Not+Available";
                  setImageLoaded(true);
                }}
              />
            )}
          </div>

          {/* Stage Instructions */}
          {stage === "writeStory" && (
            <p className="mb-4 text-gray-700 text-lg">
              Think and prepare your story…
            </p>
          )}

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="bg-gray-400 text-white font-semibold py-2 px-4 rounded-md shadow disabled:opacity-50"
            >
              Previous
            </button>
            {stage !== "review" && (
              <button
                onClick={stopTest}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow"
              >
                STOP
              </button>
            )}
            <button
              onClick={goToNext}
              disabled={
                currentIndex + 1 === questions.length && stage !== "review"
              }
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow"
            >
              Next
            </button>
          </div>

          {/* Review Mode: Show All Stories */}
          {stage === "review" && (
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-2">Stories</h3>
              {currentQuestion.stories.map((story, idx) => (
                <div
                  key={idx}
                  className="bg-blue-50 p-3 rounded-md mb-2 text-left"
                >
                  <h4 className="font-semibold">{story.title}</h4>
                  <p className="text-gray-700">{story.narration}</p>
                </div>
              ))}
              <button
                onClick={() => (window.location.href = "/")}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow"
              >
                Go to home
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DisplayTatQuestion;
