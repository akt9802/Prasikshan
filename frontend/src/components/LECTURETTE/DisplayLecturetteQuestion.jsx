import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer.jsx";

function DisplayLecturetteQuestion() {
  const [stage, setStage] = useState("loading"); // loading, showTopic, showSpeech
  const [lecturette, setLecturette] = useState(null);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes = 180 sec
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLecturette = async () => {
      try {
        const response = await fetch("https://prasikshan-79z7.onrender.com/alltest/lecturette/DisplayLecturetteQuestion");
        if (!response.ok) {
          throw new Error("Failed to fetch lecturette topic");
        }
        const data = await response.json();
        setLecturette(data);
        setStage("showTopic");
      } catch (error) {
        console.error("Error fetching lecturette:", error);
      }
    };

    fetchLecturette();
  }, []);

  useEffect(() => {
    let timer;
    if (stage === "showTopic" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (stage === "showTopic" && timeLeft === 0) {
      setStage("showSpeech");
    }
    return () => clearTimeout(timer);
  }, [timeLeft, stage]);

  const stopHandler = () => {
    setStage("showSpeech");
  };

  const goToAllTest = () => {
    navigate("/alltest");
  };

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(1, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec} MIN`;
  };

  if (stage === "loading" || !lecturette) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-700">Loading Lecturette Topic...</p>
      </div>
    );
  }

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
        <div className="bg-white border border-gray-300 rounded-lg p-6 md:p-10 w-[90%] max-w-3xl text-center shadow-lg">
          <h1 className="text-xl md:text-2xl font-bold mb-6">
            {lecturette.topic}
          </h1>

          {stage === "showTopic" && (
            <>
              <div className="mb-6">
                <span className="inline-block bg-gray-200 text-black font-semibold py-2 px-5 rounded-full text-xl">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <button
                onClick={stopHandler}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-md shadow"
              >
                Stop
              </button>
            </>
          )}

          {stage === "showSpeech" && (
            <>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm text-left mb-6">
                <p className="text-gray-800">{lecturette.speech}</p>
              </div>
              <button
                onClick={goToAllTest}
                className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-md shadow"
              >
                Go to All Test
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DisplayLecturetteQuestion;
