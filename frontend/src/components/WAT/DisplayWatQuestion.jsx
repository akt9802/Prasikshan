import Footer from "../Footer/Footer.jsx";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const LOCAL = import.meta.env.VITE_BACKEND_URL;
const PRODUCTION_URL = import.meta.env.VITE_PRODUCTION_URL;
const apiURL = LOCAL || PRODUCTION_URL;

function DisplayWatQuestion() {
  const [stage, setStage] = useState("loading"); // loading, displayWord, showAll
  const [timeLeft, setTimeLeft] = useState(15); // 15 sec for each word
  const [currentIndex, setCurrentIndex] = useState(0);
  const [watWords, setWatWords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWATQuestions = async () => {
      try {
        const response = await fetch(`${apiURL}/alltest/wat/displaywatquestions`);
        if (!response.ok) {
          throw new Error("Failed to fetch WAT questions");
        }
        const data = await response.json();
        console.log("Fetched WAT Questions:", data); // Debug
        setWatWords(data);
        setStage("displayWord");
      } catch (err) {
        console.error("Error fetching WAT questions:", err);
      }
    };

    fetchWATQuestions();
  }, []);

  useEffect(() => {
    let timer;
    if (stage === "displayWord" && currentIndex < watWords.length) {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      } else {
        setCurrentIndex(currentIndex + 1);
        setTimeLeft(15); // reset timer for next word
      }
    } else if (stage === "displayWord" && currentIndex >= watWords.length) {
      setStage("showAll");
    }
    return () => clearTimeout(timer);
  }, [timeLeft, currentIndex, stage, watWords]);

  const stopTimer = () => {
    setStage("showAll");
  };

  const goToAllTests = () => {
    navigate("/alltest"); // Adjust path if needed
  };

  if (stage === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-700">Loading WAT Questions...</p>
      </div>
    );
  }

  return (
    <>
      <div
        className={`flex justify-center items-center ${
          stage === "showAll" ? "py-20" : "min-h-screen"
        } bg-gradient-to-b from-blue-100 to-blue-300`}
      >
        <div className="bg-white border border-gray-300 rounded-lg p-4 md:p-8 w-[90%] max-w-3xl text-center shadow-lg">
          {stage === "displayWord" && watWords.length > 0 && (
            <>
              <div className="mb-4">
                <span className="inline-block bg-gray-200 text-black font-semibold py-1 px-3 rounded-full text-lg">
                  {timeLeft} SEC
                </span>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold">
                  {currentIndex + 1}. {watWords[currentIndex].word}
                </span>
              </div>
              <button
                onClick={stopTimer}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow"
              >
                Stop
              </button>
            </>
          )}

          {stage === "showAll" && watWords.length > 0 && (
            <div className="space-y-4">
              {watWords.map((item, index) => (
                <div
                  key={index}
                  className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm"
                >
                  <h2 className="font-bold text-lg mb-2 text-left">
                    {index + 1}. {item.word}
                  </h2>
                  <ul className="text-gray-800 list-disc list-inside">
                    {item.sentences.map((sentence, i) => (
                      <li key={i} className="text-left">
                        {sentence}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="mt-8">
                <button
                  onClick={goToAllTests}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md shadow"
                >
                  Go to All Tests
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DisplayWatQuestion;
